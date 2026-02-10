import secrets
import ssl
from email.message import EmailMessage

import aiosmtplib

from app.core.config import settings
from app.core.redis import redis_client


class MailService:
    def __init__(self) -> None:
        pass

    async def send_email(
        self,
        to_email: str,
        code: str,
    )-> bool:
        msg = EmailMessage()
        msg["From"] = settings.EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = "Your MindSpark Verification Code"
        plain_text = f"""
            Your MindSpark Verification Code: {code}

            Valid for 10 minutes.

            This isn't just a code — it's your first step toward becoming the most mindful version of yourself.

            MindSpark: Personal evolution, delivered daily.


            —
            The MindSpark Team
        """
        msg.set_content(plain_text)

        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        aiosmtplib.SMTP(
            hostname=settings.SMTP_SERVER,
            port=settings.SMTP_PORT,
            use_tls=True,
            tls_context=ssl_context,
            username=settings.EMAIL_ADDRESS,
            password=settings.EMAIL_PASSWORD,
            timeout=10,
        )
        try:
            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_SERVER,
                port=settings.SMTP_PORT,
                use_tls=True,
                tls_context=ssl_context,
                username=settings.EMAIL_ADDRESS,
                password=settings.EMAIL_PASSWORD,
                timeout=30,
            )
            return True
        except Exception:
            return False


    async def send_verification_code(self, to_email: str) -> dict:
        code = f"{secrets.randbelow(90000) + 10000:05d}"
        saved = await redis_client.save_verification_code(to_email, code)
        if not saved:
            return {
                "success": False,
                "message": "error while saving code",
            }
        email_sent = await self.send_email(to_email, code)
        if email_sent:
            return {
                "success": True,
                "message": "code sent",
            }
        return {
            "success": False,
            "message": "error while sending code",
            "code": None,
        }

    async def verify_code(self, email: str, code: str) -> dict:
        is_valid = await redis_client.is_code_valid(email, code)

        if is_valid:
            await redis_client.delete_verification_code(email)
            return {
                "success": True,
                "message": "Correct code",
            }
        return {
            "success": False,
            "message": "Incorrect code",
        }


mail_service = MailService()
