#!/bin/bash

set -e

echo "📦 Building Gatsby site..."
npm run build

echo "🚚 Preparing deployment directory..."
DEPLOY_DIR=.deploy-gh
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR
cp -R public/* $DEPLOY_DIR

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
