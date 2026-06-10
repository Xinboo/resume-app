# 木简 Resume App

在线免费制作简历。左侧编辑、右侧实时预览，数据保存在浏览器本地，隐私安全。

🌐 **在线使用**：[resume.xinboo.com](https://resume.xinboo.com)

基于 Vue3 + TypeScript + Vite 构建，无 UI 库、无路由、无状态管理库依赖。

## 功能特性

- 左右分栏布局，拖拽调整宽度
- 编辑内容实时预览
- 手动保存到 localStorage，数据不上传服务器
- 新标签页打开完整简历预览
- 支持工作经历、项目经验、教育背景、技能特长等模块
- 技能等级可视化（精通 / 熟练 / 良好 / 一般）
- 自定义头像（URL / Base64）
- 公司/学校 Logo 支持 URL 和 Base64
- 导出 PDF / HTML / JSON，导入 JSON
- SEO 优化，支持搜索引擎收录

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Docker 部署

从 Docker Hub 拉取：

```bash
docker pull xinboo/resume-app
docker run -d -p 8080:80 xinboo/resume-app
```

或本地构建：

```bash
docker build -t resume-app .
docker run -d -p 8080:80 resume-app
```

访问 http://localhost:8080

## 技术栈

- Vue 3
- TypeScript
- Vite
- Nginx（Docker 部署）
- GitHub Actions（CI/CD）

## License

[MIT](LICENSE)
