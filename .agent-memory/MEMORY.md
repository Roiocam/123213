# 项目记忆 · 项目需求看板

## 数据存储架构：PG 主存储 + 多维表格双写

- 事实源是 PostgreSQL `requirement` 表（Drizzle，RLS 已开）；`feishu-bitable` 插件实例 `feishu_multitable_crud_analysis_1` 仅作写操作双写，用于演示连接与备份，页面读数据一律走 PG，不读多维表格。
- 双写在 **Server 侧**用 `CapabilityService`（`@Inject(CapabilityService)`，禁止空参 `@Inject()`，否则启动 502），模块 `server/modules/requirement`，编排服务 `bitable-sync.service.ts`。
- 容错：多维表格失败不阻断 PG 写，结果落 `bitable_sync_status`(synced/pending/failed) + `bitable_sync_error` + `bitable_record_id`；工作台「同步到多维表格」按钮补偿无 recordId 的记录（`POST /api/requirements/bitable/sync`）。
- 前端数据 hook 仍是 `features/requirements/requirement-store.tsx`，但已从 Context+localStorage 改为 react-query，对外方法签名（add/update/changeStatus/remove/resetDemo）保持不变，页面零改造接入。

## 多维表格字段不对应的映射（重要）

- 插件绑定的目标表是「项目财务台账」，与需求模型字段不对应。映射：`title→项目名称`、`status→项目状态`（backlog/todo=未开始，in_progress/review=进行中，done=已完成）；项目/优先级/类型/标签/负责人/截止/描述合并写「财务洞察」文本；金额/客户/区域/人员等无来源字段留空。
- 多维表格单选 `项目状态` enum 只有「未开始/进行中/已完成」三值，禁止自造选项；Text 字段写入直接传字符串；插件返回直接读 `response.records`，无 `.data` 前缀。
- 若以后换成与需求同构的多维表，改 `requirement.mapper.ts` 的 `buildBitableFields` 即可，服务编排无需动。

## 数据模型约定

- `due_date` 是 PG date，Drizzle 映射为 string（`YYYY-MM-DD`），不要 `new Date()` 转换；审计列 `_created_at/_updated_at` 是 timestamptz→Date，接口层用 `.getTime()` 转 number 给前端。
- 示例种子数据在后端 `requirement.seed.ts`（12 条），`POST /api/requirements/seed/reset` 会清表并逐条双写重建；前端常量文件不再保留种子数据。
