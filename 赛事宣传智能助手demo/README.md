# AI 智能宣传内容创作平台 Demo

面向赛事主办方和品牌合作方的宣传内容生产演示系统。平台围绕同一份赛事资料，展示公众号文案、照片成片、合作 PPT 和文创设计四类成果的生成、修改、核查与导出流程。

## 当前案例

默认案例为“鹏飞集团杯·氢筑新程马拉松”。

- 正式事实、资料来源与状态：`cases/pengfei-marathon/index.ts`
- 公众号内容：`cases/pengfei-marathon/copywriting.ts`
- 视频素材配置：`cases/pengfei-marathon/video.ts`
- PPT 结构与成果：`cases/pengfei-marathon/ppt.ts`
- 文创方向与产品：`cases/pengfei-marathon/creative.ts`
- 当前案例入口：`lib/current-case.ts`

太原古县城、晋阳文化属于文创演示预设，不代表正式举办地点。比赛日期、规模、项目、路线和领物安排尚未在当前材料中确认，系统不会自动补成确定事实。

## 本地运行

要求 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

默认本地地址为 `http://localhost:3000/`。

## 演示前检查

每次正式演示前运行：

```bash
npm run demo:check
```

该命令会检查：

- 案例事实状态与来源
- 视频、PPT和文创素材
- PPT页码及领导版索引
- 组件案例硬编码
- 无来源旧赛事数据
- 生产构建和自动化测试

## 演示资料

- 3分钟、5分钟和8分钟路线：`cases/pengfei-marathon/demo-script.md`
- 客户常见问题口径：`cases/pengfei-marathon/demo-faq.md`
- 发布前人工清单：`cases/pengfei-marathon/checklist.md`
- 最近一次验收记录：`cases/pengfei-marathon/rehearsal-report.md`

推荐以5分钟标准版为默认路线。现场出现异常时不调试，直接切换到导出PPT、本地成片或备用录屏。

## 更换案例

1. 复制 `cases/pengfei-marathon/`，创建新的案例目录。
2. 在 `index.ts` 中填写赛事事实、状态和来源。
3. 分别配置公众号、视频、PPT和文创模块。
4. 将 `lib/current-case.ts` 指向新案例。
5. 运行 `npm run demo:check`。
6. 按5分钟标准路线完成人工彩排。

页面组件只能读取 `currentCase`，不得直接写入客户名称、城市、口号或案例素材路径。

## 能力边界

当前版本定位为稳定演示系统：

- 事实管理、场景切换、内容修改、风险提示、素材预览和成果导出按照正式产品逻辑实现。
- 部分 AI 理解和生成过程采用高质量预设内容，保证现场结果稳定、可重复。
- 正式产品可继续接入大模型、文档解析、图片或视频服务、审核流程及赛事业务系统。
- AI输出需由宣传人员或组委会审核后正式发布。

## 常用命令

```bash
npm run dev         # 启动本地演示
npm run build       # 生产构建
npm run test        # 构建并运行自动化测试
npm run test:unit   # 只运行自动化测试
npm run demo:check  # 完整演示发布检查
```

## 稳定版本流程

1. 自动检查通过。
2. 人工清单完成。
3. 3分钟和5分钟彩排通过。
4. 准备导出PPT、成片和备用录屏。
5. 提交代码并创建版本标签，例如 `pengfei-demo-v1.0`。

录屏和大型备用文件可以不进入Git，但必须在人工清单和验收记录中写明存放位置。
