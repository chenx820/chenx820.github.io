set -e

echo "📦 Building Gatsby site..."
npm run build

echo "🚚 Preparing deployment directory..."
DEPLOY_DIR=.deploy-gh
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR
cp -R public/* $DEPLOY_DIR

# Ensure Git LFS files are properly handled
echo "📦 Copying Git LFS files..."
git lfs ls-files | cut -d' ' -f3 | while read file; do
  if [ -f "$file" ]; then
    mkdir -p "$DEPLOY_DIR/$(dirname "$file")"
    cp "$file" "$DEPLOY_DIR/$file"
  fi
done

cd $DEPLOY_DIR
git init
git checkout -b gh-pages

echo "📄 Creating .nojekyll"
touch .nojekyll

git add .
git commit -m "🚀 Deploy to GitHub Pages"

echo "🌐 Pushing to remote gh-pages branch..."
git remote add origin https://github.com/chenx820/chenx820.github.io.git
git push origin gh-pages --force 

cd ..
rm -rf $DEPLOY_DIR

echo "✅ Deployed successfully: https://chenx820.github.io"
