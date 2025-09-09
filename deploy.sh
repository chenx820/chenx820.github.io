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

# check git status
check_git_status() {
    print_status "Checking Git status..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Found uncommitted changes"
        echo "Please select an action:"
        echo "1) Commit all changes"
        echo "2) Stash changes"
        echo "3) Continue deployment (not recommended)"
        read -p "Please enter your choice (1-3): " choice
        
        case $choice in
            1)
                git add .
                git commit -m "Auto commit before deployment"
                print_success "All changes committed"
                ;;
            2)
                git stash
                print_success "Changes stashed"
                ;;
            3)
                print_warning "Continue deployment, but it is recommended to handle uncommitted changes first"
                ;;
            *)
                print_error "Invalid choice, exiting deployment"
                exit 1
                ;;
        esac
    else
        print_success "Git working directory is clean"
    fi
}

# sync remote branches
sync_remote() {
    print_status "Syncing remote branches..."
    git fetch origin
    
    if [ "$(git rev-list HEAD...origin/main --count)" != "0" ]; then
        print_warning "Local branch is behind remote branch"
        git pull origin main
        print_success "Remote changes synced"
    else
        print_success "Local branch is up to date"
    fi
}

# build project
build_project() {
    print_status "Building Gatsby project..."
    
    if [ -d "public" ]; then
        rm -rf public
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    npm run build
    
    if [ ! -f "public/index.html" ]; then
        print_error "Build failed: index.html not found"
        exit 1
    fi
    
    print_success "Project built successfully"
}

# setup git lfs for large files
setup_git_lfs() {
    print_status "Setting up Git LFS for large files..."
    
    if ! command -v git-lfs &> /dev/null; then
        print_warning "Git LFS is not installed. Installing..."
        if command -v brew &> /dev/null; then
            brew install git-lfs
        else
            print_error "Please install Git LFS manually: https://git-lfs.github.io/"
            exit 1
        fi
    fi
    
    # Initialize Git LFS if not already done
    if [ ! -f ".gitattributes" ]; then
        git lfs track "*.pdf" "*.jpg" "*.jpeg" "*.png" "*.gif" "*.mp4" "*.mov"
        git add .gitattributes
        git commit -m "Add Git LFS tracking for large files" 2>/dev/null || true
        print_success "Git LFS tracking configured"
    fi
}

# deploy to GitHub Pages 
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

# restore stashed changes
restore_stash() {
    if git stash list | grep -q "stash@{0}"; then
        print_status "Restoring stashed changes..."
        git stash pop
        print_success "Stashed changes restored"
    fi
}

# clean deployment directory
clean_deploy_dir() {
    if [ -d ".deploy-gh" ]; then
        print_status "Cleaning deployment directory..."
        rm -rf .deploy-gh
        print_success "Deployment directory cleaned"
    fi
}

# show usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --clean     Clean deployment directory and do fresh deployment"
    echo "  --help      Show this help message"
    echo "  --setup     Only setup Git LFS (no deployment)"
    echo ""
    echo "Default: Incremental deployment (only update changed files)"
}

# main function
main() {
    # Parse command line arguments
    case "${1:-}" in
        --clean)
            print_status "Starting clean deployment process..."
            clean_deploy_dir
            ;;
        --help)
            show_usage
            exit 0
            ;;
        --setup)
            print_status "Setting up Git LFS only..."
            setup_git_lfs
            print_success "Git LFS setup completed!"
            exit 0
            ;;
        "")
            print_status "Starting incremental deployment process..."
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
    
    if [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ]; then
        print_error "Please run this script in the Gatsby project root directory"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    check_git_status
    sync_remote
    setup_git_lfs
    build_project
    deploy_to_gh_pages
    restore_stash
    
    print_success "Deployment completed!"
    print_success "Website address: https://chenx820.github.io"
    print_warning "Note: GitHub Pages may take a few minutes to update"
}

main "$@"
