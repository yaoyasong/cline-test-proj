# DG Helper 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

现代任务管理平台，集成文档协作与团队通讯功能

## 技术栈架构
```mermaid
graph TD
    A[Frontend] --> B[Next.js 13]
    A --> C[Tailwind CSS]
    A --> D[NextAuth]
    E[Backend] --> F[FastAPI]
    E --> G[PostgreSQL]
    E --> H[Redis]
    A <--> E
```

## 主要功能
- OAuth身份验证（GitHub/Google）
- 实时任务看板
- Markdown文档协作
- 团队消息系统

## 开发环境配置

### 前置要求
- Node.js 18.x
- Python 3.10+
- PostgreSQL 14
- Redis 6

### 依赖安装
```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
poetry install
```

## 环境变量配置

### 后端配置 (backend/.env)
```ini
DATABASE_URL="postgresql://user:pass@localhost:5432/dghelper"
REDIS_URL="redis://localhost:6379"
SECRET_KEY="your-secret-key-here"
```

### 前端配置 (frontend/.env.local)
```ini
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-client-id" 
GITHUB_CLIENT_SECRET="your-github-secret"
```

## Docker部署
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_USER: youruser
      POSTGRES_DB: dghelper

  redis:
    image: redis:6-alpine
    
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://youruser:yourpassword@postgres:5432/dghelper
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

## 开发命令
```bash
# 启动前端开发服务器
cd frontend
npm run dev

# 启动后端开发服务器
cd ../backend
poetry run uvicorn app.main:app --reload
```

## 贡献指南
1. Fork项目仓库
2. 创建特性分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 创建Pull Request
