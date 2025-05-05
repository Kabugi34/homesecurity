import smtplib
from email.mime.text import MIMEText

SMTP_USER = "kabugifrancis34@gmail.com"
SMTP_PASS = "grwi bwrz xehj wwgo"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

try:
    msg = MIMEText("Test email body")
    msg["Subject"] = "Test Email"
    msg["From"] = SMTP_USER
    msg["To"] = "kabugifrancis58@gmail.com"

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

    print("Test email sent successfully.")
except Exception as e:
    print(f"Error: {e}")