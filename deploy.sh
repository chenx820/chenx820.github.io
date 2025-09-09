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

# deploy to GitHub Pages with incremental updates
deploy_to_gh_pages() {
    print_status "Preparing to deploy to GitHub Pages..."
    
    DEPLOY_DIR=.deploy-gh
    GH_PAGES_REPO="https://github.com/chenx820/chenx820.github.io.git"
    
    # Check if deployment directory exists (for incremental updates)
    if [ -d "$DEPLOY_DIR" ]; then
        print_status "Found existing deployment directory, checking for updates..."
        cd $DEPLOY_DIR
        
        # Check if remote exists and is accessible
        if git remote get-url origin &>/dev/null; then
            print_status "Fetching latest changes from GitHub Pages..."
            git fetch origin gh-pages 2>/dev/null || {
                print_warning "Could not fetch from remote, will do fresh deployment"
                cd ..
                rm -rf $DEPLOY_DIR
            }
        else
            print_warning "No valid remote found, will do fresh deployment"
            cd ..
            rm -rf $DEPLOY_DIR
        fi
    fi
    
    # Create fresh deployment directory if needed
    if [ ! -d "$DEPLOY_DIR" ]; then
        print_status "Creating fresh deployment directory..."
        rm -rf $DEPLOY_DIR
        mkdir $DEPLOY_DIR
        cd $DEPLOY_DIR
        
        git init
        git remote add origin $GH_PAGES_REPO
        git fetch origin gh-pages 2>/dev/null || true
        
        if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
            git checkout -b gh-pages origin/gh-pages
            print_success "Checked out existing gh-pages branch"
        else
            git checkout -b gh-pages
            print_success "Created new gh-pages branch"
        fi
        
        touch .nojekyll
        cd ..
    else
        cd $DEPLOY_DIR
    fi
    
    # Copy build files with smart handling
    print_status "Copying build files with smart handling..."
    
    # Get list of files that have changed
    # For fresh deployment, always copy files
    if [ ! -f ".git/COMMIT_EDITMSG" ]; then
        CHANGED_FILES=$(find ../public -type f)
        print_status "Fresh deployment detected, copying all files..."
        print_status "Found $(echo "$CHANGED_FILES" | wc -l) files to copy"
    else
        CHANGED_FILES=$(find ../public -type f -newer .git/COMMIT_EDITMSG 2>/dev/null || find ../public -type f)
        print_status "Incremental deployment detected"
    fi
    
    # Debug: show the condition result
    print_status "COMMIT_EDITMSG exists: $([ -f ".git/COMMIT_EDITMSG" ] && echo "YES" || echo "NO")"
    
    if [ -n "$CHANGED_FILES" ]; then
        print_status "Copying changed files..."
        cp -a ../public/. .
        
        # Handle large files with Git LFS
        print_status "Processing large files with Git LFS..."
        find . -type f \( -name "*.pdf" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.mp4" -o -name "*.mov" \) -size +10M | while read file; do
            if [ -f "$file" ]; then
                print_status "Adding large file to Git LFS: $file"
                git lfs track "$file" 2>/dev/null || true
            fi
        done
        
        # Check deployment directory size
        DEPLOY_SIZE=$(du -sh . | cut -f1)
        print_status "Deployment directory size: $DEPLOY_SIZE"
        
        # Add and commit changes
        git add .
        
        # Check if there are any changes to commit
        if ! git diff --cached --quiet; then
            git commit -m "Auto deploy - $(date '+%Y-%m-%d %H:%M:%S')"
            print_success "Changes committed"
            
            # Push changes
            print_status "Pushing to GitHub Pages..."
            git push origin gh-pages
            print_success "Deployment completed!"
        else
            print_success "No changes to deploy"
        fi
    else
        print_success "No changes detected, skipping deployment"
    fi
    
    cd ..
    
    # Keep deployment directory for future incremental updates
    print_status "Keeping deployment directory for future incremental updates"
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
