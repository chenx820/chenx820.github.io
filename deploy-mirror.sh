#!/bin/bash
set -e

# color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# print functions
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

# 使用GitHub镜像部署（支持增量部署和大文件处理）
deploy_with_mirror() {
    print_status "使用GitHub镜像进行增量部署..."
    
    DEPLOY_DIR=.deploy-mirror
    GH_PAGES_REPO="https://github.com/chenx820/chenx820.github.io.git"
    MIRROR_REPO="https://github.com.cnpmjs.org/chenx820/chenx820.github.io.git"
    
    # 检查是否已存在部署目录（增量部署）
    if [ -d "$DEPLOY_DIR" ]; then
        print_status "发现现有部署目录，检查更新..."
        cd $DEPLOY_DIR
        
        # 检查远程仓库状态
        if git remote get-url origin &>/dev/null; then
            print_status "获取最新更改..."
            git fetch origin gh-pages 2>/dev/null || {
                print_warning "无法获取远程更新，将进行完整部署"
                cd ..
                rm -rf $DEPLOY_DIR
            }
        else
            print_warning "未找到有效的远程仓库，将进行完整部署"
            cd ..
            rm -rf $DEPLOY_DIR
        fi
    fi
    
    # 创建新的部署目录（如果需要）
    if [ ! -d "$DEPLOY_DIR" ]; then
        print_status "创建新的部署目录..."
        mkdir $DEPLOY_DIR
        cd $DEPLOY_DIR
        
        # 初始化Git仓库
        git init
        git checkout -b gh-pages
        touch .nojekyll
        
        # 尝试使用镜像添加远程仓库
        print_status "添加镜像远程仓库..."
        if git remote add origin "$MIRROR_REPO"; then
            print_success "镜像远程仓库添加成功"
        else
            print_warning "镜像远程仓库添加失败，使用原始地址"
            git remote add origin "$GH_PAGES_REPO"
        fi
        
        # 尝试获取现有分支
        git fetch origin gh-pages 2>/dev/null || true
        if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
            git reset --hard origin/gh-pages
            print_success "已同步现有gh-pages分支"
        fi
    else
        cd $DEPLOY_DIR
    fi
    
    # 检查文件变化
    print_status "检查文件变化..."
    
    # 创建临时目录来比较文件
    TEMP_DIR=$(mktemp -d)
    cp -a ../public/. "$TEMP_DIR/"
    
    # 检查是否有文件变化
    CHANGED_FILES=""
    if [ -f ".git/COMMIT_EDITMSG" ]; then
        # 比较文件修改时间
        CHANGED_FILES=$(find "$TEMP_DIR" -type f -newer .git/COMMIT_EDITMSG 2>/dev/null || find "$TEMP_DIR" -type f)
    else
        CHANGED_FILES=$(find "$TEMP_DIR" -type f)
    fi
    
    if [ -n "$CHANGED_FILES" ]; then
        print_status "发现文件变化，开始增量更新..."
        
        # 复制变化的文件
        print_status "复制变化的文件..."
        cp -a "$TEMP_DIR"/. .
        
        # 处理大文件（使用Git LFS）
        print_status "处理大文件..."
        find . -type f \( -name "*.pdf" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp4" -o -name "*.mov" \) -size +10M | while read file; do
            if [ -f "$file" ]; then
                print_status "发现大文件: $file"
                # 确保大文件被Git LFS跟踪
                git lfs track "$file" 2>/dev/null || true
            fi
        done
        
        # 移除超过50MB的文件以避免部署问题
        print_status "移除超大文件（>50MB）以避免部署问题..."
        find . -type f -size +50M -exec rm {} \;
        
        # 检查部署目录大小
        DEPLOY_SIZE=$(du -sh . | cut -f1)
        print_status "部署目录大小: $DEPLOY_SIZE"
        
        # 添加并提交文件
        git add .
        
        # 检查是否有变化需要提交
        if ! git diff --cached --quiet; then
            git commit -m "Auto deploy via mirror - $(date '+%Y-%m-%d %H:%M:%S')"
            print_success "文件已提交"
            
            # 尝试推送到镜像
            print_status "推送到GitHub镜像..."
            local push_retries=3
            local push_count=0
            
            while [ $push_count -lt $push_retries ]; do
                if git push origin gh-pages; then
                    print_success "部署成功！"
                    break
                else
                    push_count=$((push_count + 1))
                    if [ $push_count -lt $push_retries ]; then
                        print_warning "推送失败，重试中... (尝试 $push_count/$push_retries)"
                        sleep 10
                    else
                        print_error "推送失败，尝试使用原始地址"
                        # 尝试使用原始GitHub地址
                        git remote set-url origin "$GH_PAGES_REPO"
                        if git push origin gh-pages; then
                            print_success "使用原始地址部署成功！"
                        else
                            print_error "所有推送方式都失败了"
                            print_warning "部署文件已准备在: $DEPLOY_DIR"
                            print_warning "您可以手动上传到GitHub Pages"
                        fi
                    fi
                fi
            done
        else
            print_success "没有变化需要部署"
        fi
    else
        print_success "没有检测到文件变化，跳过部署"
    fi
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    
    cd ..
    print_success "增量部署完成！"
}

# 主函数
main() {
    print_status "启动GitHub镜像部署脚本..."
    
    # 检查必要文件
    if [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ]; then
        print_error "请在Gatsby项目根目录运行此脚本"
        exit 1
    fi
    
    # 检查是否有public目录
    if [ ! -d "public" ]; then
        print_error "未找到public目录，请先运行构建"
        print_status "运行: npm run build"
        exit 1
    fi
    
    # 执行部署
    deploy_with_mirror
}

# 清理部署目录
clean_deploy_dir() {
    if [ -d ".deploy-mirror" ]; then
        print_status "清理部署目录..."
        rm -rf .deploy-mirror
        print_success "部署目录已清理"
    else
        print_warning "未找到部署目录"
    fi
}

# 显示帮助信息
show_help() {
    echo "GitHub镜像部署脚本（支持增量部署）"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --clean    清理部署目录并重新部署"
    echo "  --help     显示此帮助信息"
    echo ""
    echo "说明:"
    echo "  此脚本使用GitHub镜像进行增量部署，适合中国大陆网络环境"
    echo "  支持大文件处理和智能文件变化检测"
    echo "  如果镜像失败，会自动尝试原始GitHub地址"
    echo ""
    echo "特性:"
    echo "  - 增量部署：只更新变化的文件"
    echo "  - 大文件处理：自动使用Git LFS"
    echo "  - 智能重试：网络失败时自动重试"
    echo "  - 镜像支持：优先使用GitHub镜像"
}

# 解析命令行参数
case "${1:-}" in
    --clean)
        print_status "清理部署目录并重新部署..."
        clean_deploy_dir
        main
        ;;
    --help)
        show_help
        exit 0
        ;;
    "")
        main
        ;;
    *)
        print_error "未知选项: $1"
        show_help
        exit 1
        ;;
esac
