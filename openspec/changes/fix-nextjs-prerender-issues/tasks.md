## 1. Help Layout 重构

- [ ] 1.1 创建 `apps/frontend/app/help/HelpLayoutClient.tsx`，将 `layout.tsx` 中的客户端逻辑迁移过去
- [ ] 1.2 重构 `apps/frontend/app/help/layout.tsx` 为 Server Component，添加 Suspense 包装

## 2. Settings Layout 重构

- [ ] 2.1 创建 `apps/frontend/app/settings/SettingsLayoutClient.tsx`，将 `layout.tsx` 中的客户端逻辑迁移过去
- [ ] 2.2 重构 `apps/frontend/app/settings/layout.tsx` 为 Server Component，添加 Suspense 包装

## 3. Login 页面重构

- [ ] 3.1 创建 `apps/frontend/app/login/LoginClient.tsx`，将 `useSearchParams` 相关逻辑迁移过去
- [ ] 3.2 重构 `apps/frontend/app/login/page.tsx` 为 Server Component，添加 Suspense 包装

## 4. 验证

- [ ] 4.1 本地运行 `pnpm build` 验证构建成功
- [ ] 4.2 运行 Docker 构建验证 prerendering 问题已解决
