from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .api import router as api_router

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="DG Helper API",
    description="DG Helper 后端服务API文档",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# 包含API路由
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Hello World2"}

@app.get("/welcome")
async def welcome():
    return {"message": "欢迎使用DG 系统"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
