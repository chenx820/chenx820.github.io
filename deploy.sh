#!/bin/bash
set -e

# Only restore changes stashed by this invocation.
DEPLOY_STASH=""

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
        echo "1) Commit all changes, sync main, and publish website"
        echo "2) Temporarily stash changes and publish the committed version"
        echo "3) Cancel"
        read -p "Please enter your choice (1-3): " choice
        
        case $choice in
            1)
                git add -A
                git commit -m "Auto commit before deployment"
                print_success "All changes committed"
                ;;
            2)
                git stash push --include-untracked -m "Temporary stash for deploy.sh"
                DEPLOY_STASH=$(git rev-parse refs/stash)
                print_success "Changes stashed"
                ;;
            3)
                print_status "Deployment cancelled"
                exit 0
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

# setup git lfs
setup_git_lfs() {
    print_status "Checking Git LFS setup..."
    if ! command -v git-lfs &> /dev/null; then
        print_error "Git LFS is not installed. Please install it: https://git-lfs.github.com/"
        exit 1
    fi

    git lfs install --skip-repo >/dev/null 2>&1 || true
    git lfs install

    if [ ! -f ".gitattributes" ] || ! grep -q "*.pdf" .gitattributes 2>/dev/null; then
        print_status "Tracking PDF files with Git LFS..."
        git lfs track "*.pdf"
        git add .gitattributes
        git commit -m "Setup Git LFS for PDFs" || true
        print_success "Git LFS configured for PDFs"
    else
        print_success "Git LFS already tracking PDFs"
    fi
}

# sync remote branches
sync_remote() {
    print_status "Syncing remote branches..."
    git fetch origin

    local counts ahead behind
    counts=$(git rev-list --left-right --count HEAD...origin/main)
    read -r ahead behind <<< "$counts"

    if [ "$behind" -eq 0 ]; then
        if [ "$ahead" -gt 0 ]; then
            print_status "Local branch is ahead of origin/main by $ahead commit(s); no remote changes to merge"
        else
            print_success "Local branch is up to date"
        fi
        return
    fi

    if [ "$ahead" -eq 0 ]; then
        print_status "Local branch is behind origin/main by $behind commit(s); fast-forwarding..."
        git merge --ff-only origin/main
    else
        print_warning "Branches have diverged ($ahead local, $behind remote commits); merging origin/main..."
        if ! git merge --no-ff --no-edit origin/main; then
            print_error "Merge failed. Resolve any conflicts and commit, or run 'git merge --abort' if a merge is in progress, then retry deployment."
            return 1
        fi
    fi
    print_success "Remote changes synced"
}

# Keep source and workflow configuration on GitHub in sync before publishing.
push_source() {
    if [ -n "$(git status --porcelain)" ]; then
        print_error "Files changed during the build. Commit or stash them and rerun ./deploy.sh."
        return 1
    fi
    print_status "Pushing source and workflow configuration to origin/main..."
    if ! git push origin HEAD:refs/heads/main; then
        print_error "Source push failed; website publication was not started. Resolve the reported error and rerun ./deploy.sh."
        return 1
    fi
    print_success "Source synced to origin/main"
}

# build project
build_project() {
    print_status "Building Gatsby project..."

    print_status "Pulling Git LFS source images and static assets..."
    git lfs pull --include="content/**,src/**,static/**" --exclude=""
    
    if [ -d "public" ]; then
        rm -rf public
    fi
    
    # A failed install can leave node_modules present but incomplete.
    # Reinstall from the lockfile before each deployment, including retries.
    print_status "Installing locked dependencies..."
    npm ci --no-audit --no-fund
    
    npm run build
    
    if [ ! -f "public/index.html" ]; then
        print_error "Build failed: index.html not found"
        exit 1
    fi
    
    print_success "Project built successfully"
}

# deploy to GitHub Pages 
deploy_to_gh_pages() {
    print_status "Preparing to deploy to GitHub Pages (incremental)..."

    REPO_URL="https://github.com/chenx820/chenx820.github.io.git"
    BRANCH="gh-pages"
    DEPLOY_DIR=".deploy-gh"

    # Ensure deploy dir exists and sync with remote branch
    if [ -d "$DEPLOY_DIR/.git" ]; then
        print_status "Using existing $DEPLOY_DIR repository..."
        git -C "$DEPLOY_DIR" remote set-url origin "$REPO_URL" 2>/dev/null || true
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

    # Sync build output
    print_status "Syncing files with rsync..."
    rsync -av --delete --exclude ".git" public/ "$DEPLOY_DIR"/

    # Ensure Pages doesn't run Jekyll
    touch "$DEPLOY_DIR/.nojekyll"

    # Configure git user locally if not set
    if ! git -C "$DEPLOY_DIR" config user.name >/dev/null; then
        git -C "$DEPLOY_DIR" config user.name "deploy-bot"
    fi
    if ! git -C "$DEPLOY_DIR" config user.email >/dev/null; then
        git -C "$DEPLOY_DIR" config user.email "deploy-bot@local"
    fi

    # Commit only when there are changes
    git -C "$DEPLOY_DIR" add -A
    if ! git -C "$DEPLOY_DIR" diff --cached --quiet; then
        git -C "$DEPLOY_DIR" commit -m "Auto deploy - $(date '+%Y-%m-%d %H:%M:%S')"
        print_status "Pushing incremental changes to GitHub Pages..."
        git -C "$DEPLOY_DIR" push origin "$BRANCH" --set-upstream
    else
        print_status "No changes to deploy. Skipping push."
    fi

    print_success "Deployment step finished"
}
 
# restore stashed changes
restore_stash() {
    if [ -z "$DEPLOY_STASH" ]; then
        return
    fi
    # Preserve the stash if a merge needs attention or another process stashed.
    if git rev-parse -q --verify MERGE_HEAD >/dev/null ||
        [ -n "$(git diff --name-only --diff-filter=U)" ] ||
        [ "$(git rev-parse -q --verify refs/stash)" != "$DEPLOY_STASH" ]; then
        print_warning "Changes remain in stash $DEPLOY_STASH; restore them after resolving the Git state."
        return 1
    fi
    print_status "Restoring changes stashed by this deployment..."
    if ! git stash pop --index; then
        return 1
    fi
    DEPLOY_STASH=""
    print_success "Stashed changes restored"
}

finish() {
    local result=$?
    trap - EXIT
    if ! restore_stash; then
        print_warning "Could not restore all stashed changes. The stash has been kept for recovery."
        result=1
    fi
    exit "$result"
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
    echo ""
    echo "Default: Commit/stash changes, sync main, build, push source, and publish gh-pages"
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
    
    if [ "$(git branch --show-current)" != "main" ]; then
        print_error "Run ./deploy.sh from the main branch."
        exit 1
    fi

    trap finish EXIT
    check_git_status
    setup_git_lfs
    sync_remote
    build_project
    push_source
    deploy_to_gh_pages
    restore_stash
    
    print_success "Source synced and website files pushed! 🎉"
    print_success "Website address: https://chenx820.github.io"
    print_warning "Note: GitHub Pages may take a few minutes to update"
}

main "$@"
