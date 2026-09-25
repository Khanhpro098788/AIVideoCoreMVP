import sys
import os
# Fix path for tests/auth
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pytest
from fastapi.testclient import TestClient
import pymongo
from datetime import datetime, timedelta

from src.main import app
from src.core.config import settings
from src.core.database import db_instance

client = TestClient(app)

# Configuration
MONGO_URI = settings.MONGO_URI
DB_NAME = settings.MONGO_DB_NAME
BASE_URL = f"{settings.API_V1_STR}/auth"

# Test Data
QA_USERNAME = "qa_test_user_123"
QA_EMAIL = "qa_tester_123@example.com"
QA_PASSWORD = "Password123!"
QA_NEW_PASSWORD = "NewPassword456!"

@pytest.fixture(scope="module", autouse=True)
def setup_db_connection():
    # Setup test DB instance to bypass motor connect for TestClient
    from motor.motor_asyncio import AsyncIOMotorClient
    db_instance.client = AsyncIOMotorClient(MONGO_URI)
    db_instance.db = db_instance.client[DB_NAME]
    yield
    db_instance.client.close()

@pytest.fixture(scope="module")
def setup_teardown(setup_db_connection):
    mongo_client = pymongo.MongoClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    db.users.delete_many({"username": QA_USERNAME})
    db.otps.delete_many({"email": QA_EMAIL})
    
    yield
    
    db.users.delete_many({"username": QA_USERNAME})
    db.otps.delete_many({"email": QA_EMAIL})
    mongo_client.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

# --- OTP & SIGNUP TESTS ---
def test_signup_happy_path(client, setup_teardown):
    payload = {
        "username": QA_USERNAME,
        "email": QA_EMAIL,
        "password": QA_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signup", json=payload)
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "id" in data
    # Optional: is_verified check if included in response

def test_signup_duplicate_username(client):
    payload = {
        "username": QA_USERNAME,
        "email": "another_email@example.com",
        "password": QA_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signup", json=payload)
    assert resp.status_code == 409

def test_signin_unverified_user(client):
    payload = {
        "email": QA_EMAIL,
        "password": QA_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signin", json=payload)
    assert resp.status_code == 403, "Should not be able to sign in without verification"

def test_resend_otp(client):
    resp = client.post(f"{BASE_URL}/resend-otp", json={"email": QA_EMAIL})
    assert resp.status_code == 202, f"Expected 202, got {resp.status_code}"

def test_verify_otp(client):
    # Fetch OTP from DB directly for testing
    mongo_client = pymongo.MongoClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    otp_record = db.otps.find_one({"email": QA_EMAIL, "used": False})
    otp_code = otp_record["otp"] if otp_record else "000000"
    mongo_client.close()
    
    payload = {
        "email": QA_EMAIL,
        "otp": otp_code
    }
    resp = client.post(f"{BASE_URL}/verify-otp", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"

# --- SIGNIN TESTS ---
@pytest.fixture(scope="module")
def login_session(client):
    payload = {
        "email": QA_EMAIL,
        "password": QA_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signin", json=payload)
    assert resp.status_code == 200
    access_token = resp.json()["access_token"]
    cookies = resp.cookies
    return access_token, cookies

def test_signin_happy_path(client):
    payload = {
        "email": QA_EMAIL,
        "password": QA_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signin", json=payload)
    assert resp.status_code == 200

# --- GET ME TESTS ---
def test_get_me_happy_path(client, login_session):
    access_token, _ = login_session
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = client.get(f"{BASE_URL}/me", headers=headers)
    assert resp.status_code == 200

def test_get_me_no_token(client):
    resp = client.get(f"{BASE_URL}/me")
    assert resp.status_code == 401

# --- REFRESH TOKEN TESTS ---
def test_refresh_token_happy_path(client, login_session):
    _, cookies = login_session
    resp = client.post(f"{BASE_URL}/refresh", cookies=cookies)
    assert resp.status_code == 200

# --- CHANGE PASSWORD & REVOKE TESTS ---
def test_change_password_happy_path(client, login_session):
    access_token, _ = login_session
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "old_password": QA_PASSWORD,
        "new_password": QA_NEW_PASSWORD
    }
    resp = client.patch(f"{BASE_URL}/password", json=payload, headers=headers)
    assert resp.status_code == 200

def test_revoke_after_password_change(client, login_session):
    _, cookies = login_session
    resp = client.post(f"{BASE_URL}/refresh", cookies=cookies)
    assert resp.status_code == 401

def test_signout(client):
    payload = {
        "email": QA_EMAIL,
        "password": QA_NEW_PASSWORD
    }
    resp = client.post(f"{BASE_URL}/signin", json=payload)
    cookies = resp.cookies
    
    resp_signout = client.post(f"{BASE_URL}/signout", cookies=cookies)
    assert resp_signout.status_code == 204
