#!/bin/bash
set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 快速部署开始...${NC}"

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${BLUE}📝 发现未提交的更改，自动提交...${NC}"
    git add .
    git commit -m "🚀 快速部署更新 - $(date '+%Y-%m-%d %H:%M')"
fi

# 同步远程分支
echo -e "${BLUE}🔄 同步远程分支...${NC}"
git pull origin main

# 构建项目
echo -e "${BLUE}📦 构建项目...${NC}"
npm run build

# 部署到GitHub Pages
echo -e "${BLUE}🌐 部署到GitHub Pages...${NC}"
npm run deploy:gh-pages

echo -e "${GREEN}✅ 快速部署完成！${NC}"
echo -e "${GREEN}🌐 网站地址: https://chenx820.github.io${NC}" 