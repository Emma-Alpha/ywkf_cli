# 学习搭建cli脚手架

## 安装

### 全局安装
```bash
pnpm install -g @4399ywkf/cli
```

### 使用
创建模版
```bash
@4399ywkf/cli create <name> [-t|--template]
```
示例
```bash
@4399ywkf/cli create hello-cli -t dumi2-demo
```

### 不全局安装，借助npx
创建模版
```bash
npx @4399ywkf/cli create <name> [-t|--template]
```
示例
```bash
npx @4399ywkf/cli create hello-cli -template dumi2-demo
```
