# Zotero GPT Plus 功能复现计划

基于 GPT Pro 2.2.9.5 截图分析，规划开源复现方案。

---

## 一、Settings Panel (设置面板)

### 1.1 General 基础设置

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Base API | 下拉 + 输入框 | ❌ 仅命令行 | P0 |
| API Provider | 下拉 (openrouter/openai/custom) | ❌ | P0 |
| API Key | 密码输入 + 显示/隐藏 | ❌ 仅命令行 | P0 |
| Model | 输入框 + 下拉预设 | ❌ 仅命令行 | P0 |
| Temperature | 滑块 (0-2) | ❌ 仅命令行 | P1 |
| Max Tokens | 滑块 | ❌ | P1 |
| Related Number | 滑块 (语义搜索 top-k) | ❌ 仅命令行 | P1 |
| Chat Number | 滑块 (历史对话数) | ❌ 仅命令行 | P1 |
| Extra Params | Edit 弹窗 (JSON) | ❌ | P2 |
| System Prompt | Edit 弹窗 | ❌ | P1 |

### 1.2 Custom Embeddings 自定义嵌入

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| 启用开关 | 复选框 | ❌ | P1 |
| Full API | 输入框 + 下拉 | ❌ | P1 |
| Embedding Key | 密码输入 | ❌ | P1 |
| Embedding Model | 输入框 + 下拉 | ❌ | P1 |
| Batch Size | 滑块 | ✅ 有 pref | P1 |
| Test 按钮 | 按钮 | ❌ | P2 |

### 1.3 Config 配置管理

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Save Config | 按钮 | ❌ | P2 |
| Switch to Config | 下拉 | ❌ | P2 |
| Delete Config | 按钮 | ❌ | P2 |

### 1.4 功能开关

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Reader Side Panel | 复选框 | ❌ | P1 |
| Note Side Panel | 复选框 | ❌ | P2 |
| Popup shortcut prompts | 复选框 | ❌ | P2 |
| Auto insert to annotation | 复选框 | ❌ | P2 |
| Annotation Color | 颜色选择 | ❌ | P3 |
| Continuous selection (Alt) | 复选框 | ❌ | P3 |

### 1.5 Prompts 提示词管理

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Prompts 表格 | 表格 (名称/类型/提示词) | ❌ | P1 |
| 类型选择 | 下拉 (text/pageText/pagesText/abstractPagesText) | ❌ | P1 |
| Add/Edit/Delete | 按钮 | ✅ 有命令行 | P1 |
| 排序 (上/下移) | 按钮 | ❌ | P2 |

### 1.6 Other 其他

| 功能 | 控件类型 | 当前状态 | 优先级 |
|------|---------|---------|--------|
| Copy reasoning to clipboard | 复选框 | ❌ | P3 |
| Save reasoning as note | 复选框 | ❌ | P3 |

---

## 二、Reader Side Panel (阅读器侧边栏)

### 2.1 顶部工具栏

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 模型名称显示 | ❌ | P1 |
| 复制按钮 | ❌ | P1 |
| 反馈按钮 | ❌ | P3 |
| 关闭按钮 | ❌ | P1 |

### 2.2 快捷操作按钮

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 分析文献 | ❌ | P1 |
| 提出问题 | ❌ | P1 |
| 自定义快捷按钮 (基于 Prompts) | ❌ | P1 |

### 2.3 右键菜单

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 显示文件 | ❌ | P2 |
| 保存会话 | ❌ | P2 |
| 清空会话 | ❌ | P1 |
| 对话参考 (子菜单) | ❌ | P2 |
| 反转布局 | ❌ | P2 |
| 历史命令 | ❌ | P2 |
| 字体大小 (子菜单) | ❌ | P2 |

### 2.4 底部输入栏

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| AskPDF 模式指示 | ✅ 有 | P0 |
| 模型快速切换下拉 | ❌ | P1 |

### 2.5 PDF 左侧快捷菜单

| 功能 | 当前状态 | 优先级 |
|------|---------|--------|
| 总结本页 | ❌ | P1 |
| 翻译本页 | ❌ | P1 |
| 截图翻译 | ❌ | P2 |
| 部分总结 | ❌ | P1 |
| 填充笔记 | ❌ | P2 |
| 截图本页 | ❌ | P3 |
| 上传附件 | ❌ | P3 |

---

## 三、实现计划

### Phase 1: 设置面板基础 (P0)

**目标：** 替代命令行配置，提供 GUI 设置

**文件结构：**
```
src/
├── modules/
│   ├── preferences/
│   │   ├── index.ts          # 入口
│   │   ├── prefPane.xhtml    # UI 定义
│   │   └── prefPane.ts       # 逻辑
```

**步骤：**
1. 创建 `addon/chrome/content/preferences.xhtml`
2. 在 `hooks.ts` 注册 PreferencePane
3. 实现基础设置项 (API/Key/Model)
4. 绑定 Zotero.Prefs 读写

**预计工作量：** 4-6 小时

### Phase 2: 设置面板完整 (P1)

**目标：** 完善所有设置项

**步骤：**
1. 添加滑块控件 (Temperature/Tokens/RelatedNumber)
2. 添加 Custom Embeddings 区块
3. 添加 Prompts 表格管理
4. 添加功能开关

**预计工作量：** 6-8 小时

### Phase 3: Reader Side Panel (P1)

**目标：** PDF 阅读器集成侧边栏

**步骤：**
1. 注册 Reader Side Panel (ztoolkit.ReaderTab)
2. 实现快捷操作按钮
3. 实现右键菜单
4. 实现模型快速切换

**预计工作量：** 8-10 小时

### Phase 4: 高级功能 (P2-P3)

**目标：** 完善细节

**步骤：**
1. Config 配置管理 (保存/切换/删除)
2. PDF 左侧快捷菜单
3. 截图翻译功能
4. 自动插入 annotation

**预计工作量：** 10+ 小时

---

## 四、技术要点

### 4.1 PreferencePane 注册

```typescript
// hooks.ts
import { config } from "../package.json";

async function onStartup() {
  // ... existing code ...

  // 注册设置面板
  ztoolkit.PreferencePane.register({
    pluginID: config.addonID,
    src: `chrome://${config.addonRef}/content/preferences.xhtml`,
    label: config.addonName,
    image: `chrome://${config.addonRef}/content/icons/favicon.png`,
  });
}
```

### 4.2 XHTML 结构示例

```xml
<?xml version="1.0"?>
<vbox xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
      xmlns:html="http://www.w3.org/1999/xhtml">
  <groupbox>
    <label><html:h2>General</html:h2></label>
    <hbox align="center">
      <label value="Base API"/>
      <menulist id="pref-api-provider">
        <menupopup>
          <menuitem label="OpenAI" value="openai"/>
          <menuitem label="OpenRouter" value="openrouter"/>
          <menuitem label="Custom" value="custom"/>
        </menupopup>
      </menulist>
      <textbox id="pref-api" flex="1"/>
    </hbox>
    <!-- ... more controls ... -->
  </groupbox>
</vbox>
```

### 4.3 Preferences 绑定

```typescript
// 读取
const api = Zotero.Prefs.get(`${config.addonRef}.api`);

// 写入
Zotero.Prefs.set(`${config.addonRef}.api`, value);

// 监听变化
Zotero.Prefs.registerObserver(`${config.addonRef}.api`, (value) => {
  // 处理变化
});
```

---

## 五、开发顺序建议

```
Week 1: Phase 1 (设置面板基础)
  ├── Day 1-2: XHTML UI 骨架
  ├── Day 3-4: Prefs 绑定逻辑
  └── Day 5: 测试调试

Week 2: Phase 2 (设置面板完整)
  ├── Day 1-2: 滑块/下拉控件
  ├── Day 3-4: Prompts 表格
  └── Day 5: 功能开关

Week 3: Phase 3 (Reader Side Panel)
  ├── Day 1-2: Panel 注册集成
  ├── Day 3-4: 快捷按钮/菜单
  └── Day 5: 测试优化

Week 4+: Phase 4 (高级功能)
```

---

## 六、参考资源

- [zotero-plugin-toolkit PreferencePane](https://github.com/windingwind/zotero-plugin-toolkit)
- [Zotero 7 Plugin Development](https://www.zotero.org/support/dev/zotero_7_for_developers)
- [XUL Reference](https://udn.realityripple.com/docs/Archive/Mozilla/XUL)
