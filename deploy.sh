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

# deploy to GitHub Pages
deploy_to_gh_pages() {
    print_status "Preparing to deploy to GitHub Pages..."
    
    DEPLOY_DIR=.deploy-gh
    rm -rf $DEPLOY_DIR
    mkdir $DEPLOY_DIR
    
    print_status "Copying build files..."
    cp -a public/. $DEPLOY_DIR
    
    # Remove large files to avoid GitHub Pages size limits
    print_status "Removing large files (>50MB) to avoid deployment issues..."
    find $DEPLOY_DIR -type f -size +50M -exec rm {} \;
    print_success "Large files removed"
    
    # Check deployment directory size
    DEPLOY_SIZE=$(du -sh $DEPLOY_DIR | cut -f1)
    print_status "Deployment directory size: $DEPLOY_SIZE"
    
    if command -v git-lfs &> /dev/null; then
        print_status "Processing Git LFS files..."
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
    
    print_status "Pushing to GitHub Pages..."
    git remote remove origin 2>/dev/null || true
    git remote add origin https://github.com/chenx820/chenx820.github.io.git
    git push origin gh-pages --force
    
    cd ..
    rm -rf $DEPLOY_DIR
    
    print_success "Deployment completed!"
}

# restore stashed changes
restore_stash() {
    if git stash list | grep -q "stash@{0}"; then
        print_status "Restoring stashed changes..."
        git stash pop
        print_success "Stashed changes restored"
    fi
}

# main function
main() {
    print_status "Starting deployment process..."
    
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
    build_project
    deploy_to_gh_pages
    restore_stash
    
    print_success "Deployment completed!"
    print_success "Website address: https://chenx820.github.io"
    print_warning "Note: GitHub Pages may take a few minutes to update"
}

main "$@"
