from urllib import parse
import jwt
import aiohttp
from app.core.config import settings

class GoogleoauthService:
    def __init__(self):
        self.google_token_url = settings.GOOGLE_TOKEN_URL

    def generate_google_oauth_redirect_uri(self):
        base_uri = "https://accounts.google.com/o/oauth2/v2/auth"
        query_params = {
            "redirect_uri": "http://localhost:3000/auth/google",
            "client_id": f"{settings.OAUTH_GOOGLE_CLIENT_ID}",
            "response_type": "code",
            "scope": " ".join(
                [
                    "openid",
                    "profile",
                    "email",
                ]
            ),
        }
        query_string = parse.urlencode(query_params, quote_via=parse.quote)
        return f"{base_uri}?{query_string}"
    
    async def decode_token(self, code: str) -> dict:
        async with (
            aiohttp.ClientSession() as session,
            session.post(
                url=self.google_token_url,
                data={
                    "client_id": settings.OAUTH_GOOGLE_CLIENT_ID,
                    "client_secret": settings.OAUTH_GOOGLE_CLIENT_SECRET,
                    "grant_type": "authorization_code",
                    "redirect_uri": "http://localhost:3000/auth/google",
                    "code": code,
                },
                ssl=False,
            ) as response,
        ):
            token_data = await response.json()
            print(token_data)
            if "error" in token_data:
                return {
                    "error": token_data.get("error_description", token_data["error"])
                }
            id_token_jwt = token_data.get("id_token")
            if not id_token_jwt:
                return {"error": "No id_token received from Google"}
            try:
                decoded = jwt.decode(id_token_jwt, options={"verify_signature": False})
                user_email = decoded.get("email")
                user_name = decoded.get("name", "No name")
                payload = {
                    "email": user_email,
                    "name": user_name,
                }
                return payload
            except Exception as e:
                return {"error": f"Failed to decode token: {str(e)}"}
