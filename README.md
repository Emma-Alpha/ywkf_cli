# 学习搭建cli脚手架

## 安装

### 全局安装
```bash
pnpm install -g ywkf-cli
```

### 使用
创建模版
```bash
ywkf-cli create <name> [-t|--template]
```
示例
```bash
ywkf-cli create hello-cli -t dumi2-demo
```

### 不全局安装，借助npx
创建模版
```bash
npx ywkf-cli create <name> [-t|--template]
```
示例
```bash
npx ywkf-cli create hello-cli -template dumi2-demo
```
