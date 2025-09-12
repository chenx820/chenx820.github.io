#!/bin/bash
set -e

# color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# print functions
print_status() { echo -e "${BLUE}[INFO] $1${NC}"; }
print_success() { echo -e "${GREEN}[SUCCESS] $1${NC}"; }
print_warning() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
print_error() { echo -e "${RED}[ERROR] $1${NC}"; }

# detect default branch
detect_default_branch() {
    DEFAULT_BRANCH=$(git remote show origin | sed -n '/HEAD branch/s/.*: //p')
    if [ -z "$DEFAULT_BRANCH" ]; then
        DEFAULT_BRANCH="main"
    fi
    echo "$DEFAULT_BRANCH"
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
                STASH_NAME=$(git stash create "auto-stash-before-deploy")
                if [ -n "$STASH_NAME" ]; then
                    git stash store -m "auto-stash-before-deploy" "$STASH_NAME"
                    export DEPLOY_STASH="stash@{0}"
                    print_success "Changes stashed"
                fi
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
    local branch
    branch=$(detect_default_branch)
    print_status "Syncing remote branch '$branch'..."
    git fetch origin
    
    if [ "$(git rev-list HEAD...origin/$branch --count)" != "0" ]; then
        print_warning "Local branch is behind remote branch"
        git pull --rebase origin "$branch" || {
            print_error "git pull failed, please resolve conflicts manually"
            exit 1
        }
        print_success "Remote changes synced"
    else
        print_success "Local branch is up to date"
    fi
}

# setup git lfs
setup_git_lfs() {
    print_status "Setting up Git LFS..."
    if ! command -v git-lfs &> /dev/null; then
        print_warning "Git LFS not installed. Installing..."
        if command -v brew &> /dev/null; then
            brew install git-lfs
        else
            print_error "Please install Git LFS manually: https://git-lfs.github.io/"
            exit 1
        fi
    fi
    
    git lfs install --local || true
    git lfs pull || true
    git lfs checkout || true

    if [ ! -f ".gitattributes" ]; then
        git lfs track "*.pdf" "*.jpg" "*.jpeg" "*.png" "*.gif" "*.mp4" "*.mov" 2>/dev/null || true
        git add .gitattributes 2>/dev/null || true
        git commit -m "Add Git LFS tracking for large files" 2>/dev/null || true
        print_success "Git LFS tracking configured"
    fi
}

# build project
build_project() {
    print_status "Building Gatsby project..."
    rm -rf public
    [ ! -d "node_modules" ] && npm install
    
    npm run build
    
    if [ ! -f "public/index.html" ]; then
        print_error "Build failed: index.html not found"
        exit 1
    fi
    print_success "Project built successfully"
}

# deploy to gh-pages
deploy_to_gh_pages() {
    print_status "Preparing to deploy to GitHub Pages (incremental)..."
    REPO_URL="https://github.com/chenx820/chenx820.github.io.git"
    BRANCH="gh-pages"
    DEPLOY_DIR=".deploy-gh"

    if [ -d "$DEPLOY_DIR/.git" ]; then
        print_status "Using existing $DEPLOY_DIR..."
        git -C "$DEPLOY_DIR" remote set-url origin "$REPO_URL" || true
        git -C "$DEPLOY_DIR" fetch origin "$BRANCH" --depth=1 || true
        if git -C "$DEPLOY_DIR" rev-parse --verify origin/$BRANCH >/dev/null 2>&1; then
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH" "origin/$BRANCH"
            git -C "$DEPLOY_DIR" reset --hard "origin/$BRANCH"
        else
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH"
        fi
    else
        print_status "Cloning $BRANCH branch shallowly..."
        rm -rf "$DEPLOY_DIR"
        mkdir -p "$DEPLOY_DIR"
        git init "$DEPLOY_DIR"
        git -C "$DEPLOY_DIR" remote add origin "$REPO_URL"
        if git ls-remote --exit-code --heads "$REPO_URL" "$BRANCH" >/dev/null 2>&1; then
            git -C "$DEPLOY_DIR" fetch origin "$BRANCH" --depth=1
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH" "origin/$BRANCH"
        else
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH"
        fi
    fi

    print_status "Syncing files with rsync..."
    rsync -a --delete --exclude ".git" --exclude ".gitattributes" public/ "$DEPLOY_DIR"/
    touch "$DEPLOY_DIR/.nojekyll"

    git -C "$DEPLOY_DIR" config user.name "deploy-bot" || true
    git -C "$DEPLOY_DIR" config user.email "deploy-bot@local" || true

    git -C "$DEPLOY_DIR" add -A
    if ! git -C "$DEPLOY_DIR" diff --cached --quiet; then
        git -C "$DEPLOY_DIR" commit -m "Auto deploy - $(date '+%Y-%m-%d %H:%M:%S')"
        print_status "Pushing incremental changes..."
        git -C "$DEPLOY_DIR" push origin "$BRANCH" --set-upstream
    else
        print_status "No changes to deploy. Skipping push."
    fi

    print_success "Deployment step finished"
}

# restore stashed changes
restore_stash() {
    if [ -n "$DEPLOY_STASH" ]; then
        print_status "Restoring stashed changes..."
        git stash pop "$DEPLOY_STASH" || true
        print_success "Stashed changes restored"
    fi
}

# clean deployment directory
clean_deploy_dir() {
    [ -d ".deploy-gh" ] && { print_status "Cleaning deployment directory..."; rm -rf .deploy-gh; print_success "Deployment directory cleaned"; }
}

# show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --clean     Clean deployment directory and do fresh deployment"
    echo "  --help      Show this help message"
    echo "  --setup     Only setup Git LFS (no deployment)"
    echo ""
    echo "Default: Incremental deployment"
}

# main
main() {
    case "${1:-}" in
        --clean) print_status "Starting clean deployment..."; clean_deploy_dir ;;
        --help) show_usage; exit 0 ;;
        --setup) print_status "Setting up Git LFS only..."; setup_git_lfs; print_success "Git LFS setup completed!"; exit 0 ;;
        "") print_status "Starting incremental deployment..." ;;
        *) print_error "Unknown option: $1"; show_usage; exit 1 ;;
    esac
    
    [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ] && { print_error "Run script in Gatsby project root"; exit 1; }
    command -v git &>/dev/null || { print_error "Git not installed"; exit 1; }
    command -v npm &>/dev/null || { print_error "npm not installed"; exit 1; }
    
    check_git_status
    sync_remote
    setup_git_lfs
    build_project
    deploy_to_gh_pages
    restore_stash
    
    print_success "Deployment completed!"
    print_success "Website: https://chenx820.github.io"
    print_warning "GitHub Pages may take a few minutes to update"
}

main "$@"