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

# 中国大陆网络优化配置
setup_china_network() {
    print_status "配置中国大陆网络环境..."
    
    # 使用GitHub镜像或代理
    git config --global http.version HTTP/1.1
    git config --global http.postBuffer 524288000
    git config --global http.lowSpeedLimit 0
    git config --global http.lowSpeedTime 999999
    
    # 尝试使用GitHub镜像
    if [ -z "$GITHUB_MIRROR" ]; then
        export GITHUB_MIRROR="https://github.com.cnpmjs.org"
        print_status "使用GitHub镜像: $GITHUB_MIRROR"
    fi
    
    print_success "网络配置完成"
}

# 检查网络连接
check_network() {
    print_status "检查网络连接..."
    
    # 检查GitHub连接
    if curl -s --connect-timeout 5 https://github.com > /dev/null 2>&1; then
        print_success "GitHub连接正常"
        return 0
    elif curl -s --connect-timeout 5 https://github.com.cnpmjs.org > /dev/null 2>&1; then
        print_warning "GitHub连接较慢，建议使用镜像"
        return 1
    else
        print_error "无法连接到GitHub"
        return 2
    fi
}

# 使用镜像克隆/拉取
git_with_mirror() {
    local url="$1"
    local mirror_url="${url/github.com/github.com.cnpmjs.org}"
    
    print_status "尝试使用镜像: $mirror_url"
    
    if git clone "$mirror_url" 2>/dev/null || git pull "$mirror_url" 2>/dev/null; then
        print_success "镜像连接成功"
        return 0
    else
        print_warning "镜像连接失败，尝试原始地址"
        return 1
    fi
}

# 本地部署（不依赖网络）
local_deploy() {
    print_status "执行本地部署..."
    
    DEPLOY_DIR=.deploy-local
    rm -rf $DEPLOY_DIR
    mkdir $DEPLOY_DIR
    
    print_status "复制构建文件..."
    cp -a public/. $DEPLOY_DIR
    
    # 处理大文件
    print_status "处理大文件..."
    find $DEPLOY_DIR -type f \( -name "*.pdf" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +10M | while read file; do
        if [ -f "$file" ]; then
            print_status "发现大文件: $file"
        fi
    done
    
    # 检查部署目录大小
    DEPLOY_SIZE=$(du -sh $DEPLOY_DIR | cut -f1)
    print_status "部署目录大小: $DEPLOY_SIZE"
    
    print_success "本地部署准备完成！"
    print_warning "部署文件位于: $DEPLOY_DIR"
    print_warning "您可以手动上传到GitHub Pages或使用其他方式部署"
    
    # 提供手动部署说明
    echo ""
    print_status "手动部署说明:"
    echo "1. 将 $DEPLOY_DIR 目录内容上传到GitHub Pages仓库"
    echo "2. 或使用GitHub Desktop等工具同步"
    echo "3. 或等待网络恢复后使用原始部署脚本"
}

# 主函数
main() {
    print_status "启动中国大陆优化部署脚本..."
    
    # 检查必要文件
    if [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ]; then
        print_error "请在Gatsby项目根目录运行此脚本"
        exit 1
    fi
    
    # 设置网络环境
    setup_china_network
    
    # 检查网络连接
    network_status=$(check_network)
    
    case $network_status in
        0)
            print_success "网络连接良好，可以尝试正常部署"
            print_warning "如果遇到问题，请运行: ./deploy.sh"
            ;;
        1)
            print_warning "网络连接较慢，建议使用本地部署"
            local_deploy
            ;;
        2)
            print_error "网络连接失败，使用本地部署"
            local_deploy
            ;;
    esac
}

# 显示帮助信息
show_help() {
    echo "中国大陆网络优化部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --local    强制本地部署（不依赖网络）"
    echo "  --help     显示此帮助信息"
    echo ""
    echo "说明:"
    echo "  此脚本专门针对中国大陆网络环境优化"
    echo "  如果网络连接有问题，会自动切换到本地部署模式"
}

# 解析命令行参数
case "${1:-}" in
    --local)
        print_status "强制本地部署模式"
        local_deploy
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
