# Zotero GPT Plus 功能复现计划

基于 GPT Pro 2.2.9.5 截图分析，规划开源复现方案。

**注：原版的 "Zotero GPT Connector" 验证模块已被移除，本项目为完全开源实现。**

---

## 一、Settings Panel (设置面板)

### 1.1 General 基础设置

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Base API | 下拉 + 输入框 | ✅ 已实现 | P0 |
| API Provider | 下拉 (openrouter/openai/custom) | ✅ 已实现 | P0 |
| API Key | 密码输入 + 显示/隐藏 | ✅ 已实现 | P0 |
| Model | 输入框 + 下拉预设 | ✅ 已实现 | P0 |
| Temperature | 滑块 (0-2) | ✅ 已实现 | P1 |
| Max Tokens | 滑块 | ✅ 已实现 | P1 |
| Related Number | 滑块 (语义搜索 top-k) | ✅ 已实现 | P1 |
| Chat Number | 滑块 (历史对话数) | ✅ 已实现 | P1 |
| Extra Params | Edit 弹窗 (JSON) | ❌ 未实现 | P2 |
| System Prompt | Edit 弹窗 | ✅ 已实现 | P1 |

### 1.2 Custom Embeddings 自定义嵌入

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| 启用开关 | 复选框 | ✅ 已实现 | P1 |
| Full API | 输入框 | ✅ 已实现 | P1 |
| Embedding Key | 密码输入 | ✅ 已实现 | P1 |
| Embedding Model | 输入框 | ✅ 已实现 | P1 |
| Batch Size | 滑块 | ✅ 已实现 | P1 |
| Max PDFs | 滑块 | ✅ 已实现 | P1 |
| Test 按钮 | 按钮 | ✅ 已实现 | P2 |

### 1.3 Config 配置管理

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Save Config | 按钮 | ✅ 已实现 | P2 |
| Switch to Config | 下拉 | ✅ 已实现 | P2 |
| Delete Config | 按钮 | ✅ 已实现 | P2 |

### 1.4 功能开关

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Reader Side Panel | 复选框 | ✅ 已实现 | P1 |
| Note Side Panel | 复选框 | ✅ 已实现 | P2 |
| Popup shortcut prompts | 复选框 | ✅ 已实现 | P2 |
| Auto insert to annotation | 复选框 | ✅ 已实现 | P2 |
| Annotation Color | 颜色选择 | ✅ 已实现 | P3 |
| Continuous selection (Alt) | 复选框 | ❌ 未实现 | P3 |

### 1.5 Prompts 提示词管理

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Prompts 表格 | 表格 (名称/类型/提示词) | ✅ 已实现 | P1 |
| 类型选择 | 输入框 | ✅ 已实现 | P1 |
| Add/Edit/Delete | 按钮 | ✅ 已实现 | P1 |
| 排序 (上/下移) | 按钮 | ✅ 已实现 | P2 |

### 1.6 Other 其他

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Copy reasoning to clipboard | 复选框 | ❌ 未实现 | P3 |
| Save reasoning as note | 复选框 | ❌ 未实现 | P3 |

---

## 二、Reader Side Panel (阅读器侧边栏)

### 2.1 顶部工具栏

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 模型名称显示 | ✅ 已实现 | P1 |
| 复制按钮 | ✅ 已实现 | P1 |
| 清空按钮 | ✅ 已实现 | P1 |
| 关闭按钮 | ✅ 已实现 | P1 |

### 2.2 快捷操作按钮

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| Summarize | ✅ 已实现 | P1 |
| Translate | ✅ 已实现 | P1 |
| Explain | ✅ 已实现 | P1 |
| Key Points | ✅ 已实现 | P1 |
| 自定义快捷按钮 (基于 Prompts) | ✅ 已实现 | P1 |

### 2.3 右键菜单

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 显示文件 | ❌ 未实现 | P2 |
| 保存会话 | ❌ 未实现 | P2 |
| 清空会话 | ✅ 已实现 | P1 |
| 对话参考 (子菜单) | ❌ 未实现 | P2 |
| 反转布局 | ❌ 未实现 | P2 |
| 历史命令 | ❌ 未实现 | P2 |
| 字体大小 (子菜单) | ❌ 未实现 | P2 |

### 2.4 底部输入栏

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 文本输入框 | ✅ 已实现 | P0 |
| 发送按钮 | ✅ 已实现 | P0 |
| 模型快速切换下拉 | ✅ 已实现 | P1 |

### 2.5 PDF 左侧快捷菜单

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 总结本页 | ✅ 已实现 | P1 |
| 翻译本页 | ✅ 已实现 | P1 |
| 总结选中 | ✅ 已实现 | P1 |
| 解释选中 | ✅ 已实现 | P1 |
| 截图翻译 | ❌ 未实现 | P2 |
| 填充笔记 | ❌ 未实现 | P2 |
| 截图本页 | ❌ 未实现 | P3 |
| 上传附件 | ❌ 未实现 | P3 |

---

## 三、实现计划

### Phase 1: 设置面板基础 (P0) ✅ 已完成

**目标：** 替代命令行配置，提供 GUI 设置

**已实现文件：**
```
addon/chrome/content/preferences.xhtml  # UI 定义
src/modules/preferences.ts              # 逻辑
src/hooks.ts                            # 注册
addon/prefs.js                          # 默认值
```

**已完成：**
- [x] 创建 `addon/chrome/content/preferences.xhtml`
- [x] 在 `hooks.ts` 注册 PreferencePane
- [x] 实现基础设置项 (API/Key/Model)
- [x] 绑定 Zotero.Prefs 读写

### Phase 2: 设置面板完整 (P1) ✅ 已完成

**目标：** 完善所有设置项

**已完成：**
- [x] 添加滑块控件 (Temperature/Tokens/RelatedNumber)
- [x] 添加 Custom Embeddings 区块
- [x] 添加 Prompts 表格管理
- [x] 添加功能开关
- [x] Test Connection 按钮
- [x] Test Embeddings 按钮

### Phase 3: Reader Side Panel (P1) ✅ 已完成

**目标：** PDF 阅读器集成侧边栏

**已实现文件：**
```
src/modules/readerPanel.ts  # 侧边栏面板
```

**已完成：**
- [x] 注册 Reader Side Panel
- [x] 实现快捷操作按钮 (Summarize/Translate/Explain/Key Points)
- [x] 实现清空会话
- [x] 实现模型快速切换

### Phase 4: 高级功能 (P2-P3) ✅ 已完成

**目标：** 完善细节

**已实现文件：**
```
src/modules/configManager.ts      # 配置管理
src/modules/pdfQuickMenu.ts       # PDF 左侧快捷菜单
src/modules/annotationHandler.ts  # 自动插入 annotation
```

**已完成：**
- [x] Config 配置管理 (保存/切换/删除)
- [x] PDF 左侧快捷菜单
- [x] 自动插入 annotation

**未实现 (低优先级)：**
- [ ] 截图翻译功能
- [ ] 右键菜单完整功能
- [ ] Copy/Save reasoning 功能

---

## 四、项目结构

```
src/
├── hooks.ts                 # 生命周期钩子
├── addon.ts                 # 插件主类
├── index.ts                 # 入口
└── modules/
    ├── views.ts             # 主 UI 视图
    ├── base.ts              # 基础配置
    ├── utils.ts             # 工具函数
    ├── preferences.ts       # 设置面板逻辑
    ├── readerPanel.ts       # Reader 侧边栏
    ├── pdfQuickMenu.ts      # PDF 左侧快捷菜单
    ├── configManager.ts     # 配置管理
    ├── annotationHandler.ts # 自动注释处理
    ├── localStorage.ts      # 本地存储
    └── Meet/
        ├── api.ts           # API 入口
        ├── Zotero.ts        # Zotero 集成
        ├── OpenAI.ts        # OpenAI 集成
        └── BetterNotes.ts   # Better Notes 集成

addon/
├── chrome/content/
│   ├── preferences.xhtml    # 设置面板 UI
│   ├── md.css               # Markdown 样式
│   └── icons/               # 图标资源
├── prefs.js                 # 默认偏好设置
├── manifest.json            # WebExtension 清单
├── bootstrap.js             # 引导加载器
└── chrome.manifest          # Chrome 注册
```

---

## 五、技术要点

### 5.1 PreferencePane 注册

```typescript
// hooks.ts
Zotero.PreferencePanes.register({
  pluginID: config.addonID,
  src: `chrome://${config.addonRef}/content/preferences.xhtml`,
  label: config.addonName,
  image: `chrome://${config.addonRef}/content/icons/favicon.png`,
});
```

### 5.2 Reader 事件监听

```typescript
// readerPanel.ts
Zotero.Reader.registerEventListener("renderToolbar", (event) => {
  const { reader, append } = event;
  // 添加工具栏按钮
});
```

### 5.3 Notifier 监听 (自动注释)

```typescript
// annotationHandler.ts
Zotero.Notifier.registerObserver({
  notify: async (event, type, ids) => {
    if (type === "item" && event === "add") {
      // 处理新注释
    }
  }
}, ["item"], "ZoteroGPTPlus");
```

---

## 六、参考资源

- [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit)
- [Zotero 7 Plugin Development](https://www.zotero.org/support/dev/zotero_7_for_developers)
- [XUL Reference](https://udn.realityripple.com/docs/Archive/Mozilla/XUL)

---

## 七、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 0.2.8 | 2026-01-14 | Phase 1-4 完成，开源替代 GPT Pro 验证模块 |
