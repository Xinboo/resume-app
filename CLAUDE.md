# resume-app

简历在线编辑器。Vue3 + Vite + TypeScript，无UI库、无路由、无状态管理库。

## 项目结构

```
src/
  main.ts                          # 入口
  App.vue                          # 主布局：左编辑器 + 拖拽分栏 + 右预览（默认编辑器宽560px）
  assets/main.css                  # 全局样式重置
  types/resume.ts                  # 所有 TypeScript 接口（ResumeData 为根类型）
  data/defaultResume.ts            # 空白简历模板（所有字段为空）
  composables/useResumeStore.ts    # 状态管理：reactive + localStorage 手动保存
  components/
    ResumePreview.vue              # iframe 渲染预览
    EditorPanel.vue                # 左侧手风琴编辑面板（默认全部折叠）
  utils/
    renderResumeHtml.ts            # 内置 HTML 模板（CSS + 表格结构）
```

## 核心架构

- **数据与模板分离**：`ResumeData`（数据）+ `renderResumeHtml()`（模板）= 完整 HTML
- **模板**：`renderResumeHtml.ts` 包含内置的CSS和table布局，不要随意修改其结构
- **预览机制**：`ResumePreview.vue` 通过 `iframe.contentDocument.write()` 渲染，`watch` 监听数据变化自动刷新
- **新标签页预览**：EditorPanel 中的"预览"链接通过 Blob URL 在新标签页打开完整简历
- **持久化**：仅 `useResumeStore.ts` 操作 localStorage，用户点「保存」按钮才写入，非自动保存
- **编辑状态**：保存按钮有 dirty 状态，保存后灰掉，编辑后亮起
- **不做兼容性处理**：开发阶段，localStorage 不兼容就清掉，不写迁移代码

## 数据流

1. 启动 → 加载空白模板（`defaultResume.ts`）
2. 读取 localStorage → 有数据则覆盖，无则保持空白
3. 编辑 → 实时更新预览（通过 reactive + watch）
4. 点保存 → 写入 localStorage

## 关键设计

- **时间段**：工作/项目经验使用 `<input type="month">` + `isCurrentJob`/`isCurrentProject` 布尔值实现"至今"功能，勾选至今时 endDate 赋值为当前月，时长每次打开自动计算
- **教育经历**：同样使用月份选择器，但没有"至今"选项
- **空格分割渲染**：`targetPositions`、`targetCities`、`industry` 存储为 `string`，渲染时通过 `splitToTags()` 按空格切割为 `<span class="tag">`
- **项目经验所属公司**：下拉框，选项来自工作经验中的公司名 + "无"
- **公司/学校 Logo**：手填 URL 输入框，支持 base64
- **技能特长**：技能名不加粗（`<span>` 非 `<strong>`），行间距 `padding: 3px 0`

## 开发命令

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## 注意事项

- 不要修改 `renderResumeHtml.ts` 中的 CSS 和 HTML 结构，除非模板本身需要更新
- 头像引用外部CDN图片
- `targetPositions`、`targetCities`、`industry` 是 `string`，按空格分隔，渲染时切割为标签
- 技能等级对应 CSS 类：精通（无类名 100%）、熟练（`sl` 70%）、良好（`lh` 45%）、一般（`yb` 20%）
- 编辑器字段顺序应与简历模板渲染顺序保持一致
