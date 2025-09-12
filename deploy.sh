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
    [ -z "$DEFAULT_BRANCH" ] && DEFAULT_BRANCH="main"
    echo "$DEFAULT_BRANCH"
}

# check git status
check_git_status() {
    print_status "Checking Git status..."
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Found uncommitted changes"
        echo "1) Commit all changes"
        echo "2) Stash changes"
        echo "3) Continue deployment (not recommended)"
        read -p "Please enter your choice (1-3): " choice
        case $choice in
            1) git add . && git commit -m "Auto commit before deployment"
               print_success "All changes committed" ;;
            2) STASH_NAME=$(git stash create "auto-stash-before-deploy")
               if [ -n "$STASH_NAME" ]; then
                   git stash store -m "auto-stash-before-deploy" "$STASH_NAME"
                   export DEPLOY_STASH="stash@{0}"
                   print_success "Changes stashed"
               fi ;;
            3) print_warning "Continue deployment anyway" ;;
            *) print_error "Invalid choice"; exit 1 ;;
        esac
    else
        print_success "Git working directory is clean"
    fi
}

# sync remote
sync_remote() {
    local branch=$(detect_default_branch)
    print_status "Syncing remote branch '$branch'..."
    git fetch origin
    if [ "$(git rev-list HEAD...origin/$branch --count)" != "0" ]; then
        git pull --rebase origin "$branch" || {
            print_error "git pull failed, resolve conflicts manually"
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
    if ! command -v git-lfs &>/dev/null; then
        print_warning "Git LFS not installed"
        if command -v brew &>/dev/null; then
            brew install git-lfs
        else
            print_error "Please install Git LFS manually: https://git-lfs.github.com/"
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
    [ ! -f "public/index.html" ] && { print_error "Build failed"; exit 1; }
    print_success "Project built successfully"
}

# ensure lfs files are real binaries before deploy
ensure_real_files() {
    print_status "Ensuring LFS files are real binaries..."
    git lfs pull || true
    git lfs checkout || true
    # double-check public dir
    find public -type f -size -200c -exec grep -l "git-lfs" {} \; | while read f; do
        print_error "Found LFS pointer in $f"
        exit 1
    done
    print_success "All files are real binaries"
}

# deploy
deploy_to_gh_pages() {
    print_status "Deploying to GitHub Pages..."
    REPO_URL="https://github.com/chenx820/chenx820.github.io.git"
    BRANCH="gh-pages"
    DEPLOY_DIR=".deploy-gh"

    if [ -d "$DEPLOY_DIR/.git" ]; then
        git -C "$DEPLOY_DIR" remote set-url origin "$REPO_URL" || true
        git -C "$DEPLOY_DIR" fetch origin "$BRANCH" --depth=1 || true
        if git -C "$DEPLOY_DIR" rev-parse --verify origin/$BRANCH >/dev/null 2>&1; then
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH" "origin/$BRANCH"
            git -C "$DEPLOY_DIR" reset --hard "origin/$BRANCH"
        else
            git -C "$DEPLOY_DIR" checkout -B "$BRANCH"
        fi
    else
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

    rsync -a --delete --exclude ".git" --exclude ".gitattributes" public/ "$DEPLOY_DIR"/
    touch "$DEPLOY_DIR/.nojekyll"

    git -C "$DEPLOY_DIR" config user.name "deploy-bot" || true
    git -C "$DEPLOY_DIR" config user.email "deploy-bot@local" || true

    git -C "$DEPLOY_DIR" add -A
    if ! git -C "$DEPLOY_DIR" diff --cached --quiet; then
        git -C "$DEPLOY_DIR" commit -m "Auto deploy - $(date '+%Y-%m-%d %H:%M:%S')"
        git -C "$DEPLOY_DIR" push origin "$BRANCH" --set-upstream
        print_success "Deployment pushed"
    else
        print_status "No changes to deploy"
    fi
}

# restore stash
restore_stash() {
    [ -n "$DEPLOY_STASH" ] && { print_status "Restoring stashed changes..."; git stash pop "$DEPLOY_STASH" || true; }
}

# main
main() {
    case "${1:-}" in
        --clean) rm -rf .deploy-gh ;;
        --help) echo "Usage: $0 [--clean|--help|--setup]"; exit 0 ;;
        --setup) setup_git_lfs; exit 0 ;;
    esac

    [ ! -f "package.json" ] || [ ! -f "gatsby-config.js" ] && { print_error "Run in Gatsby root"; exit 1; }
    command -v git &>/dev/null || { print_error "Git not installed"; exit 1; }
    command -v npm &>/dev/null || { print_error "npm not installed"; exit 1; }

    check_git_status
    sync_remote
    setup_git_lfs
    build_project
    ensure_real_files
    deploy_to_gh_pages
    restore_stash

    print_success "Deployment complete! Website: https://chenx820.github.io"
    print_warning "GitHub Pages may take a few minutes to update"
}

main "$@"