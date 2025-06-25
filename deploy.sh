#!/bin/bash
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 打印函数
print_status() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# 检查Git状态
check_git_status() {
    print_status "检查Git状态..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "发现未提交的更改"
        echo "请选择操作："
        echo "1) 提交所有更改"
        echo "2) 暂存更改"
        echo "3) 继续部署（不推荐）"
        read -p "请输入选择 (1-3): " choice
        
        case $choice in
            1)
                git add .
                git commit -m "Auto commit before deployment"
                print_success "已提交所有更改"
                ;;
            2)
                git stash
                print_success "已暂存更改"
                ;;
            3)
                print_warning "继续部署，但建议先处理未提交的更改"
                ;;
            *)
                print_error "无效选择，退出部署"
                exit 1
                ;;
        esac
    else
        print_success "Git工作目录干净"
    fi
}

# 同步远程分支
sync_remote() {
    print_status "同步远程分支..."
    git fetch origin
    
    if [ "$(git rev-list HEAD...origin/main --count)" != "0" ]; then
        print_warning "本地分支落后于远程分支"
        git pull origin main
        print_success "已同步远程更改"
    else
        print_success "本地分支已是最新"
    fi
}

# 构建项目
build_project() {
    print_status "构建Gatsby项目..."
    
    if [ -d "public" ]; then
        rm -rf public
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "安装依赖..."
        npm install
    fi
    
    npm run build
    
    if [ ! -f "public/index.html" ]; then
        print_error "构建失败：未找到index.html"
        exit 1
    fi
    
    print_success "项目构建完成"
}

# 部署到GitHub Pages
deploy_to_gh_pages() {
    print_status "准备部署到GitHub Pages..."
    
    DEPLOY_DIR=.deploy-gh
    rm -rf $DEPLOY_DIR
    mkdir $DEPLOY_DIR
    
    print_status "复制构建文件..."
    cp -a public/. $DEPLOY_DIR
    
    if command -v git-lfs &> /dev/null; then
        print_status "处理Git LFS文件..."
        git lfs ls-files | cut -d' ' -f3 | while read file; do
            if [ -f "$file" ]; then
                mkdir -p "$DEPLOY_DIR/$(dirname "$file")"
                cp "$file" "$DEPLOY_DIR/$file"
            fi
        done
    fi
    
    cd $DEPLOY_DIR
    
    git init
    git checkout -b gh-pages
    touch .nojekyll
    git add .
    git commit -m "Auto deploy - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_status "推送到GitHub Pages..."
    git remote remove origin 2>/dev/null || true
    git remote add origin https://github.com/chenx820/chenx820.github.io.git
    git push origin gh-pages --force
    
    cd ..
    rm -rf $DEPLOY_DIR
    
    print_success "部署完成！"
}

# 恢复暂存的更改
restore_stash() {
    if git stash list | grep -q "stash@{0}"; then
        print_status "恢复暂存的更改..."
        git stash pop
        print_success "已恢复暂存的更改"
    fi
}

# 主函数
main() {
    print_status "开始部署流程..."
    
    if [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ]; then
        print_error "请在Gatsby项目根目录运行此脚本"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm未安装"
        exit 1
    fi
    
    check_git_status
    sync_remote
    build_project
    deploy_to_gh_pages
    restore_stash
    
    print_success "部署成功完成！"
    print_success "网站地址: https://chenx820.github.io"
    print_warning "注意：GitHub Pages可能需要几分钟时间更新"
}

main "$@"
