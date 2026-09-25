import sys
import asyncio
from fastapi.testclient import TestClient
from src.main import app
from src.core.database import get_database

# QA Test configuration
TEST_USER = {
    "username": "qa_test_user_999",
    "email": "qa_test_999@example.com",
    "password": "SecurePassword123!"
}
NEW_PASSWORD = "NewSecurePassword456!"

import asyncio
import httpx

# QA Test configuration
BASE_URL = "http://127.0.0.1:8000/api/v1/auth"
TEST_USER = {
    "username": "qa_test_user_999",
    "email": "qa_test_999@example.com",
    "password": "SecurePassword123!"
}
NEW_PASSWORD = "NewSecurePassword456!"

async def run_tests():
    print("Bat dau QA Testing cho Module Auth...")
    results = []
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # --- TEST 1: Đăng ký thành công ---
        print("[TEST] Dang ky tai khoan (Signup) - Hop le")
        res = await client.post(f"{BASE_URL}/signup", json=TEST_USER)
        if res.status_code == 201:
            results.append(("Signup (Valid)", "PASS", "Tao user thanh cong, tra ve 201"))
        elif res.status_code == 409:
             results.append(("Signup (Valid)", "WARN", "User da ton tai tu truoc (co the do test cu chua xoa)"))
        else:
            results.append(("Signup (Valid)", "FAIL", f"Ma loi {res.status_code}: {res.text}"))

        # --- TEST 2: Đăng ký trùng lặp ---
        print("[TEST] Dang ky tai khoan (Signup) - Trung lap")
        res = await client.post(f"{BASE_URL}/signup", json=TEST_USER)
        if res.status_code == 409:
            results.append(("Signup (Duplicate)", "PASS", "Chan user trung lap, tra ve 409"))
        else:
            results.append(("Signup (Duplicate)", "FAIL", f"Ma loi {res.status_code}: {res.text}"))

        # --- TEST 3: Đăng nhập thành công ---
        print("[TEST] Dang nhap (Signin) - Hop le")
        res = await client.post(f"{BASE_URL}/signin", json={"username": TEST_USER["username"], "password": TEST_USER["password"]})
        access_token = None
        refresh_cookie = None
        
        # Nếu đang là mật khẩu mới (do test cũ đổi pass)
        if res.status_code == 401:
             res = await client.post(f"{BASE_URL}/signin", json={"username": TEST_USER["username"], "password": NEW_PASSWORD})
             
        if res.status_code == 200:
            data = res.json()
            cookies = dict(res.cookies)
            if "access_token" in data and "refresh_token" in cookies:
                results.append(("Signin (Valid)", "PASS", "Tra ve access_token va set cookie refresh_token"))
                access_token = data["access_token"]
                refresh_cookie = {"refresh_token": cookies["refresh_token"]}
            else:
                results.append(("Signin (Valid)", "FAIL", "Thieu token trong phan hoi"))
        else:
            results.append(("Signin (Valid)", "FAIL", f"Ma loi {res.status_code}: {res.text}"))

        # --- TEST 4: Lấy thông tin User (Me) ---
        print("[TEST] Lay Profile (Me) - Co Token")
        if access_token:
            res = await client.get(f"{BASE_URL}/me", headers={"Authorization": f"Bearer {access_token}"})
            if res.status_code == 200 and res.json()["username"] == TEST_USER["username"]:
                results.append(("Profile (Valid)", "PASS", "Lay dung thong tin user"))
            else:
                results.append(("Profile (Valid)", "FAIL", f"Ma loi {res.status_code}"))
        else:
            results.append(("Profile (Valid)", "SKIP", "Khong co access token"))

        # --- TEST 5: Refresh Token hợp lệ ---
        print("[TEST] Cap lai Token (Refresh) - Hop le")
        new_access_token = None
        if refresh_cookie:
            res = await client.post(f"{BASE_URL}/refresh", cookies=refresh_cookie)
            if res.status_code == 200 and "access_token" in res.json():
                results.append(("Refresh (Valid)", "PASS", "Cap lai access_token moi thanh cong"))
                new_access_token = res.json()["access_token"]
            else:
                results.append(("Refresh (Valid)", "FAIL", f"Ma loi {res.status_code}: {res.text}"))
        else:
            results.append(("Refresh (Valid)", "SKIP", "Khong co refresh cookie"))

        # --- TEST 6: Đổi mật khẩu ---
        print("[TEST] Doi mat khau (Password) - Hop le")
        if new_access_token:
            # Thu doi tu OLD -> NEW hoac nguoc lai
            res = await client.patch(
                f"{BASE_URL}/password", 
                json={"old_password": TEST_USER["password"], "new_password": NEW_PASSWORD},
                headers={"Authorization": f"Bearer {new_access_token}"}
            )
            if res.status_code == 200:
                results.append(("Change Password", "PASS", "Doi mat khau thanh cong"))
            elif res.status_code == 400: # Could be wrong old pass if we already changed it
                 res = await client.patch(
                    f"{BASE_URL}/password", 
                    json={"old_password": NEW_PASSWORD, "new_password": TEST_USER["password"]},
                    headers={"Authorization": f"Bearer {new_access_token}"}
                )
                 if res.status_code == 200:
                     results.append(("Change Password", "PASS", "Doi mat khau (tro ve cu) thanh cong"))
                 else:
                     results.append(("Change Password", "FAIL", f"Ma loi {res.status_code}: {res.text}"))
            else:
                results.append(("Change Password", "FAIL", f"Ma loi {res.status_code}: {res.text}"))
        else:
            results.append(("Change Password", "SKIP", "Khong co access token"))

        # --- TEST 7: Kiểm tra Revoke (Dùng refresh token cũ sau khi đổi mật khẩu) ---
        print("[TEST] Kiem tra Revoke Token")
        if refresh_cookie:
            res = await client.post(f"{BASE_URL}/refresh", cookies=refresh_cookie)
            if res.status_code == 401:
                results.append(("Revoke Token", "PASS", "Refresh token cu da bi chan (401)"))
            else:
                results.append(("Revoke Token", "FAIL", f"Loi bao mat! Tra ve {res.status_code} thay vi 401"))
        else:
             results.append(("Revoke Token", "SKIP", "Khong co refresh cookie"))

        # --- TEST 8: Đăng xuất ---
        print("[TEST] Dang xuat (Signout)")
        res = await client.post(f"{BASE_URL}/signout")
        if res.status_code == 204:
            results.append(("Signout", "PASS", "Dang xuat thanh cong, xoa cookie"))
        else:
            results.append(("Signout", "FAIL", f"Ma loi {res.status_code}"))

    print("\n" + "="*50)
    print("BAO CAO QA TESTING")
    print("="*50)
    for name, status, msg in results:
        print(f"[{status}] {name}: {msg}")

if __name__ == "__main__":
    asyncio.run(run_tests())

