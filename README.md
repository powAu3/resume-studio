# Resume Studio

一个基于 React、TypeScript 和 Vite 构建的在线简历编辑器，支持可视化编辑、样式调整、JSON 导入导出和 PDF 预览/导出。

演示地址：https://powau3.github.io/resume-studio/

## 预览

本仓库只包含匿名演示数据。真实简历内容、导入 JSON、导出 PDF、私人截图等都应只保留在本地，禁止提交到公开仓库。

![匿名演示预览](./docs/preview-default.png)

## 功能

- 在线编辑个人信息、教育背景、实习经历、项目经历、专业技能等模块
- 支持模块排序、折叠填写、字段增删和样式参数调整
- 支持头像上传占位、字体大小调整、一页压缩/扩充
- 支持导入/导出 JSON，便于保存和恢复编辑状态
- 支持浏览器预览并导出 PDF
- 内置隐私检查，避免把真实简历数据提交到仓库

## 本地运行

```bash
npm install
npm run dev
```

## 检查命令

```bash
npm run privacy:check
npm run build
npm run lint
```

## 隐私说明

应用在浏览器内运行，编辑数据默认保存在本地。仓库配置了本地 git hooks 和 GitHub Actions 隐私检查，会拦截常见手机号、身份证、个人邮箱、简历导出文件、PDF/DOC 等敏感资产。

如果你想在本机额外拦截自己的姓名、学校、公司或联系方式，可以把这些词写入 `.privacy-denylist.local`。该文件已被 `.gitignore` 忽略，不会进入仓库。
