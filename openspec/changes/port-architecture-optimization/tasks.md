## 1. 消除 3010 端口

- [ ] 1.1 修改 `apps/frontend/.env.local` 中的 `NEXT_PUBLIC_SNOWBALL_URL` 为 `http://localhost:3000`
- [ ] 1.2 更新 `apps/backend/modules/web/profiles/application-local.yaml` 移除 CORS 配置中的 `localhost:3010`

## 2. 代码清理

- [ ] 2.1 使用 grep 验证 `admin_models.py` 中的模型类未被其他文件引用
- [ ] 2.2 删除 `apps/backend/modules/admin/models/admin_models.py` 文件

## 3. 功能验证

- [ ] 3.1 启动 Next.js 前端服务 (3000)
- [ ] 3.2 启动 Admin API 服务 (8002)
- [ ] 3.3 启动 Web API 服务 (8003)
- [ ] 3.4 验证 http://localhost:3000 正常访问
- [ ] 3.5 验证 http://localhost:3000/admin 管理后台正常
- [ ] 3.6 验证 http://localhost:3000/ratel Ratel Mind Web 正常
- [ ] 3.7 验证 iframe 页面加载正常
