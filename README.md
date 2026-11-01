# Quiz Website Builder

当前版本 **1.2.3**：新增“方向→自主检索→方案确认→原型反馈→接受原型→最终审查”流程、8类报告配方和可组合的分析模块。保留1.1版的资料库、证据映射、36种图形、8套配色和界面设计规则。

电脑端制作，成品优先适配手机并兼容电脑。

把“我想做一个测试”变成一份能答题、能解释结果、能下载报告的网页。面向新手，也供支持 Agent Skills 的助手复用。

**从结果倒推题目：** 用户问题 → 结果画像 → 情境与选项 → 透明计分 → 网页 → 验收 → 上线。

## 文件怎么用

- `SKILL.md`：标准技能定义和完整制作流程。
- `references/research-library.md`：从论文、书籍、官方事实到问题和结果的资料工作流。
- `assets/evidence-library.json`：来源、观点、题目、规则、结果与指标的数据结构示例；原创假设和外部资料分开标记。
- `assets/design-library.json`：36种图形及其数据前提、配色和界面结构。
- `demo/design-atlas.html`：可筛选的图集、整页换色、问答状态和结果布局预览。
- `assets/report-recipes.json`：8类报告目的、设定层、模块输入、解释力度和替代规则。
- `references/staged-workflow.md` / `report-composition.md`：用户确认点、反馈循环和报告组合方法。
- `scripts/workflow.cjs`：保存/检查阶段；`scripts/compose-report.cjs`：输出作者评审蓝图。
- `prompts/doubao-copy.md`：普通豆包对话可复制的分阶段指令。
- `assets/example.json`：9 题 / 3 结果的可编辑教学数据。
- `assets/quiz-template.html`：单文件页面模板。
- `scripts/`：零第三方依赖的构建、逻辑校验和回归检查。
- `demo/index.html`：已构建的可用示例，下载后双击打开。
- `docs/`：使用说明、事实核对和验证记录。
- `tutorial/`：小红书场景化教程图。

## 先试一次

下载仓库 ZIP，解压后打开 `demo/index.html`。示例是“周末充电方式”，不是心理或职业诊断。无需账号或 API key。

想改自己的主题，编辑 `assets/example.json`。装有 Node.js 18+ 时，在仓库目录执行：

```sh
node scripts/validate.cjs assets/example.json
node scripts/build.cjs assets/example.json output/index.html
node scripts/check.cjs
node scripts/check-library.cjs
node scripts/build-atlas.cjs
node scripts/check-workflow.cjs
```

校验器会检查题目和结果结构、小型题库的全部回答路径、结果可达性及分数边界。它不能代替真实手机试用或验证测量效度。

## 先给方向，后续怎样推进

你只说“做一个逃避模式测试”，助手应主动扩展概念、区别项、情境、测量、机制/反例、形成条件和改变路径等关键词，按实际可用检索工具查证，再给初步方案。它不能在没有工具或没实际查过时假称完成文献检索。

初步方案包含内容方向、代表题、资料依据、计分和报告蓝图。**确认方案后**制作完整可体验的原型；反馈后继续改，**原型被接受后**再做最终审查。不要把一次配色反馈当作整套方案批准。

已有8类仅是示例，可根据新主题新增或组合报告模块。报告按目的组合：心理/行为、历史人物、动物隐喻、虚构角色、职业、生活偏好、决策、知识。每种组合决定模块、材料与回答需求。例如，心理探索可谈情境、短长期作用与可能形成线索；历史相似着重多维相似、不同之处、史料情境和可借鉴部分，不共用一套心理成因报告。

在设计图集的“报告组合”区切换目的，或运行：

```sh
node scripts/compose-report.cjs psych-exploration
node scripts/compose-report.cjs historical-match
node scripts/check-workflow.cjs
```

这些输出是蓝图与规则检查，不表示已检索该主题文献或生成了个人报告。心理形成原因只能结合自述提出条件化解释；不能从选择题“查出”童年创伤、疾病或必然的未来。人物档案需要实际材料和解释依据，相似百分比也不是身份命中率。

## 资料与界面如何接入

先读 `references/research-library.md`，按主题建自己的来源和观点记录，再将题目、计分和结果ID映射进去。构建时可加入资料库检查：

```sh
node scripts/build.cjs assets/example.json output/index.html assets/evidence-library.json
```

这会核对来源/观点/题目/结果的结构、引用关系和界面目录，不能替人判断论文结论是否可靠。示例里的周末分类与权重是原创假设，W3C来源只支持UI规则。没有为用户尚未指定的各类主题预装一份“万能科学数据库”。

示例题库的 `ui.palette` 可选8套预设之一；`ui.chart` 支持 `bar`、`dot`、`lollipop`，构建后是实际报告中的真实计算图。其余图形提供预览、选型和实现参考，需要按主题数据实现，不能宣称36种都已做成任意数据的生产级组件。

先用浏览器打开 `demo/design-atlas.html`，按数据类型和目的筛图。每张图都有要求、慎用情况和合成数据表。通常一份报告只用2–4张；有几道单次回答不等于拥有常模、时间趋势或置信区间。

## 豆包用户怎么用

普通聊天用户先打开 `prompts/doubao-copy.md`，复制全文到新对话，改主题后发送。看到方案后回复“确认方案，开始制作”。拿到完整 HTML 后保存并测试。这是将方法用于一次对话，不表示为豆包安装了持久技能，也不保证某个客户端具备浏览器、文件或部署工具。

豆包工作官方文档另有商店技能路线；只有本技能日后实际通过相应上架流程，才可把帖子写为“到商店安装它”。**本仓库尚未上架豆包商店。** [安装和能力核对](docs/INSTALL.md)

## 支持 Agent Skills 的客户端

按客户端文档将整个文件夹装入其技能目录，确保路径末尾是 `quiz-website-builder/SKILL.md`。或者让客户端自带的技能安装器安装发布后的实际 GitHub 地址。安装后发出：“使用 quiz-website-builder，帮我做一个关于……的测试网站。”不同客户端能执行的动作不同。

本包没有自动安装器，也不会索取账户密码或启动付费服务。

## 发布到 GitHub

将本目录内文件上传到你自己的新仓库，保留目录结构。MIT 许可证允许修改、分享及商业使用，需保留许可证。然后把真实仓库地址贴进 `POST.md` 的占位处。这里没有伪造 GitHub 链接，也没有替你发布。

按 [Agent Skills 开放规范](https://agentskills.io/specification)组织技能；不宣称已经通过任何客户端商店审核。

## v1.2.1 报告展示约定
消费者报告与导出只呈现结果、图形、解读及建议；出处、计分公式、方法与设计过程保存在独立作者资料中。详见 references/report-composition.md。

