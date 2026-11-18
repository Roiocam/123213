# 项目需求看板 · 研发规范

## 应用概览

团队级「项目需求看板」：统揽需求从提出到交付的全流程，提供统计工作台、状态看板、需求列表（含增删改查）。

- **数据边界（当前）**：纯前端闭环 demo，无后端、无数据库、无插件。数据保存在浏览器 `localStorage`，首次进入写入内置示例数据；刷新不丢、可「重置示例数据」。判定依据：用户选择「还没有多维表格，先用示例数据搭建演示」。
- **未来切换点**：用户提供真实飞书多维表格链接后，创建 `feishu-bitable` 插件实例（searchRecords / batchAddRecords / batchUpdateRecords / deleteRecords / aggregateQuery），仅替换 `client/src/features/requirements/requirement-store.tsx` 的数据实现，页面与组件契约不变。切换前禁止 mock 插件、禁止伪造 appToken。
- 应用类型：全栈模板，但本阶段只写 `client/**`；不新增 server 模块、不注册路由、不动 `shared/api.interface.ts`。

## 目录结构

```
client/src/
├── app.tsx                       # 路由（已预填，业务单元勿改）
├── components/Layout.tsx         # 全局深墨青侧边栏 + <Outlet/>
├── pages/
│   ├── dashboard/DashboardPage.tsx   # 工作台：指标卡 + 图表
│   ├── board/BoardPage.tsx           # 看板：5 状态分列 + 状态流转
│   └── requirements/RequirementListPage.tsx  # 列表：表格 + 筛选搜索 + CRUD
└── features/requirements/
    ├── types.ts                  # Requirement 等类型
    ├── constants.ts              # 枚举/label/配色/团队成员/项目/标签/示例数据
    ├── requirement-store.tsx     # RequirementProvider + useRequirements（localStorage 数据层）
    └── components/               # 跨页面共享组件（StatusBadge/PriorityBadge/RequirementCard/StatCard/RequirementFormDialog）
```

## 数据模型（Requirement）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string | 唯一 ID（crypto.randomUUID） |
| title | string | 需求标题，必填 |
| description | string | 需求描述，多行可空 |
| project | string | 所属项目（constants 内固定选项） |
| type | RequirementType | feature 新功能 / improvement 优化改进 / bug 缺陷修复 / tech 技术需求 |
| priority | Priority | P0 紧急 / P1 高 / P2 中 / P3 低 |
| status | RequirementStatus | backlog 待规划 / todo 待处理 / in_progress 进行中 / review 评审中 / done 已完成 |
| owner | string | 负责人姓名（固定团队成员，文本） |
| tags | string[] | 标签多选 |
| dueDate | string | 截止日期 `YYYY-MM-DD`，可空 |
| createdAt | number | 创建时间戳 |
| updatedAt | number | 更新时间戳 |

固定取值（状态/优先级/类型/项目/成员/标签）全部集中在 `constants.ts` 用 `as const` 定义并导出 label 与配色，页面只导入、不另写枚举。

## 设计规范

### 场景约束
- 产品定位：团队负责人和成员用它统揽需求从提出到交付的全流程，用起来像作战室墙上一块卡片可挪动的报事看板，而不是又一张冷冰冰的 Excel 台账。
- 应用类型：业务工具（多人协作、数据长期累积、高密度）；克制但有立场，主色与状态体系专门定制，强调色只用于关键处。
- 使用者与场合：工位桌面端长时间操作为主，兼顾窄屏；视觉主角是需求卡片的状态与优先级。
- 页面结构：全局侧边栏（工作台 / 需求看板 / 需求列表三个并列模块需持续导航）；品牌区在侧栏顶部，用 `useAppInfo()` 的 appName/appLogo。
- 工作面板：无；列表筛选条是页面内工具区，不是全局导航。
- 用户风格原话：无。

### 视觉方向（内部代号：作战报事板）
| 项 | 取值 | 用途 |
|---|---|---|
| 背景 | hsl(210 24% 97%) | 页面底色，浅冷灰蓝 |
| 正文 | hsl(215 22% 16%) | 主文字 |
| 主色 | hsl(186 72% 32%) 深青 | 主按钮、选中、链接、进行中状态 |
| 浅青底 | hsl(186 42% 94%) | hover/选中浅底、表头点缀 |
| 强调色 | hsl(36 90% 46%) 琥珀 | 高优先级、评审中、关键数字点缀（少量） |
| 边框 | hsl(214 18% 88%) | 分隔线、输入框、卡片边 |
| 侧栏 | hsl(205 32% 13%) 深墨青 | 侧边栏底，选中项深青底白字 |
| 语义-状态 | backlog 灰 hsl(220 10% 58%) / todo 蓝 hsl(214 82% 56%) / in_progress 深青 hsl(186 72% 34%) / review 琥珀 hsl(36 90% 45%) / done 绿 hsl(145 58% 38%) | 看板列头、状态徽章 |
| 语义-优先级 | P0 红 hsl(0 72% 55%) / P1 橙 hsl(22 88% 52%) / P2 琥珀 hsl(36 90% 45%) / P3 灰 hsl(220 10% 55%) | 优先级徽章、卡片左色条 |
| 逾期 | hsl(0 72% 55%) | 截止日期过期且未完成时的日期文字与徽标 |
| 字体 | 标题 Manrope/Noto Sans SC；正文 Noto Sans SC+系统无衬线；数字 JetBrains Mono | 网络字体走妙搭镜像 |
| 圆角 | 8px 卡片/弹窗（rounded-lg），6px 输入/按钮（rounded-md），徽章 rounded-full | 单页不超过 3 档 |
| 阴影 | 卡片轻阴影；看板卡 hover 上浮 + shadow-md；弹窗 shadow-lg | |
| 图标线宽 | 1.75，全应用统一，仅用 lucide-react | |
| 字号阶梯 | 11 / 12 / 13 / 14 / 18 / 24px | 辅助 / 表格 / 正文 / 小标题 / 区块标题 / 页标题 |
| 点睛样式 | 看板卡片左侧 3px 优先级色条；列头状态色点；逾期日期红字 | 最要紧状态=逾期，必须醒目 |
| 动效 | 入场 `.rise` 淡入上移；卡片/列表项 framer-motion `layout` 增删位移；弹窗 0.2s 淡入缩放；卡片 hover 上浮+阴影 | 尊重 prefers-reduced-motion |
| 配图风格 | 无（业务表格/看板/表单不配装饰图） | |

### 间距
- 三级：small 8px / medium 16px / large 24px；卡片内边距统一 16px，并列元素用 `gap`（gap-3/gap-4/gap-6），父容器已给内边距子容器不叠加。
- 页面内容区：`p-6`，最大宽度自适应，不贴边。

### 页面实现约束
- 颜色只用 `tailwind-theme.css` 变量与语义类（`bg-primary`、`text-status-*`、`bg-priority-*` 等），禁止写死色值；图表 hex 从 constants 的 CHART_COLORS 取。
- 主标题用 `.font-display`，数字/日期/编号加 `.tnum`；入场用 `.rise`。
- 悬停规则：卡片/按钮 hover 至少变化两样（底色加深 + 上浮/阴影/边框变主色）；表格行、看板列内列表行 hover 只加深底色不上浮；选中态用主色浅底或主色左边框，比 hover 更明确。
- 弹窗、tab、列展开有 0.15–0.3s 过渡，不瞬间跳变；操作有可见反馈（按钮 loading、行内变化、toast），不仅靠 toast。
- 图标只用 lucide-react，尺寸跟随文字（12/14/16）；纯图标按钮加 `aria-label`。
- 输入一律用 shadcn 组件（Input/Textarea/Select/Calendar+Popover），禁止原生 input/select；弹窗用 Dialog，禁止 alert/confirm。
- 异步/本地数据加载用骨架屏（Skeleton）同构占位；空态说明原因并给「新建需求」入口；删除有确认 Dialog。
- 路由跳转用 NavLink/Link/useNavigate；品牌区用 useAppInfo，不硬编码应用名。
- 列表页数据表格使用 `@lark-apaas/client-toolkit/antd-table`（遵循 table-skill，index.css 已做主题覆盖）；图表用 echarts-for-react（遵循 charts-skill）；表单用 react-hook-form+zod（遵循 forms-skill）。
- 日志用 `@lark-apaas/client-toolkit/logger`，禁止 console。
