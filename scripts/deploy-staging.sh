#!/bin/bash

# ============================================
# Staging Deployment Script
# ============================================
# 
# Safely deploy to staging environment
# Runs tests, builds, and deploys to Vercel
#

set -e  # Exit on error

echo "🚀 Jewelshot Staging Deployment"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Confirm current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${BLUE}Current branch: ${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" != "staging" ]; then
  echo -e "${YELLOW}⚠️  Warning: Not on staging branch${NC}"
  echo "Switch to staging? (y/n)"
  read -r response
  if [ "$response" = "y" ]; then
    git checkout staging
  else
    echo "Deployment cancelled"
    exit 1
  fi
fi

echo ""

# Step 2: Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes...${NC}"
git pull origin staging
echo -e "${GREEN}✅ Up to date${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Run linter
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint
echo -e "${GREEN}✅ Linter passed${NC}"
echo ""

# Step 5: Run type check
echo -e "${BLUE}📝 Running type check...${NC}"
npm run type-check
echo -e "${GREEN}✅ Type check passed${NC}"
echo ""

# Step 6: Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm test -- --run
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Step 7: Build
echo -e "${BLUE}🏗️  Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Step 8: Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"

if command -v vercel &> /dev/null; then
  # Vercel CLI installed
  vercel --prod
  echo -e "${GREEN}✅ Deployed to staging!${NC}"
else
  # No Vercel CLI - push to trigger auto-deploy
  echo -e "${YELLOW}⚠️  Vercel CLI not found. Pushing to GitHub to trigger auto-deploy...${NC}"
  git push origin staging
  echo -e "${GREEN}✅ Pushed to GitHub. Vercel will auto-deploy.${NC}"
  echo ""
  echo "Monitor deployment at: https://vercel.com/dashboard"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 Staging deployment complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Visit staging URL"
echo "2. Run smoke tests"
echo "3. Test feature flags"
echo "4. Monitor Sentry for errors"
echo ""

