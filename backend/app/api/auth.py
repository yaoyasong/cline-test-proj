from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import httpx
import os
from jose import jwt, JWTError
from datetime import datetime, timedelta
import logging

router = APIRouter(prefix="/auth", tags=["authentication"])
logger = logging.getLogger(__name__)

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

@router.get("/github")
async def github_auth():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user:email"
    )

@router.get("/github/callback")
async def github_callback(code: str):
    try:
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET or not SECRET_KEY:
            logger.error("GitHub OAuth配置不完整")
            raise HTTPException(status_code=500, detail="服务器配置错误")
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code
                },
                headers={"Accept": "application/json"}
            )
            token_data = response.json()
            if "error" in token_data:
                logger.error(f"GitHub token获取失败: {token_data['error']}")
                raise HTTPException(status_code=400, detail=token_data['error_description'])
            
            access_token = token_data.get("access_token")
            if not access_token:
                logger.error("无法获取access_token")
                raise HTTPException(status_code=400, detail="无效的授权码")
            
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"token {access_token}"}
            )
            user_data = user_response.json()
            
            token = jwt.encode({
                "sub": user_data["id"],
                "name": user_data.get("name"),
                "exp": datetime.utcnow() + timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")
            
            logger.info(f"用户 {user_data['login']} 登录成功")
            return {"token": token}
            
    except JWTError as e:
        logger.error(f"JWT生成失败: {str(e)}")
        raise HTTPException(status_code=500, detail="令牌生成失败")
    except httpx.HTTPStatusError as e:
        logger.error(f"GitHub API请求失败: {str(e)}")
        raise HTTPException(status_code=502, detail="GitHub服务不可用")
    except Exception as e:
        logger.error(f"未知错误: {str(e)}")
        raise HTTPException(status_code=500, detail="服务器内部错误")
