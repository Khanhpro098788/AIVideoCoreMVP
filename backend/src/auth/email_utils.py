import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from src.core.config import settings

def send_otp_email(to_email: str, otp_code: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("Cảnh báo: Chưa cấu hình SMTP_USER và SMTP_PASSWORD. Bỏ qua gửi email.")
        return
        
    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_USER
    msg['To'] = to_email
    msg['Subject'] = "Mã Xác Nhận Đăng Ký - Klink AI Core"
    
    body = f"""
    <html>
      <body>
        <h2>Chào mừng bạn đến với Klink AI Core!</h2>
        <p>Mã xác nhận (OTP) của bạn là: <strong>{otp_code}</strong></p>
        <p>Mã này có hiệu lực trong vòng 5 phút.</p>
        <p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
      </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(settings.SMTP_USER, to_email, text)
        server.quit()
        print(f"Đã gửi OTP {otp_code} tới {to_email}")
    except Exception as e:
        print(f"Lỗi gửi email: {e}")
        print("Vui lòng kiểm tra lại SMTP_USER và SMTP_PASSWORD trong file .env (phải dùng App Password của Google).")
