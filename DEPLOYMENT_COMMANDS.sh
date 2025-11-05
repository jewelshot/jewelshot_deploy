#!/bin/bash

# 🚀 Jewelshot Production Deployment Script
# This script handles the final deployment steps

echo "🚀 Jewelshot Deployment Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in jewelshot directory!${NC}"
    echo "Please run: cd /Users/yasin/Desktop/vortex/jewelshot"
    exit 1
fi

echo -e "${BLUE}📍 Current directory: ${NC}$(pwd)"
echo ""

# Step 1: Check git status
echo -e "${BLUE}🔍 Checking git status...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    
    # Show git status
    git status --short
    echo ""
    
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Stage all changes
        echo -e "${BLUE}📦 Staging changes...${NC}"
        git add .
        
        # Commit with production message
        echo -e "${BLUE}💾 Committing changes...${NC}"
        git commit -m "feat: add production monitoring and analytics

- Add Vercel Analytics for traffic tracking
- Add Speed Insights for performance monitoring  
- Add Web Vitals API endpoint
- Add WebVitalsProvider component
- Update layout with monitoring components
- Production ready! 🚀"
        
        echo -e "${GREEN}✅ Changes committed!${NC}"
    else
        echo -e "${RED}❌ Deployment cancelled. Please commit your changes first.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

echo ""

# Step 2: Run build test
echo -e "${BLUE}🔨 Running production build test...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please fix errors before deploying.${NC}"
    echo "Run 'npm run build' to see detailed errors."
    exit 1
fi

echo ""

# Step 3: Check if Sentry DSN is configured
echo -e "${BLUE}🔍 Checking Sentry configuration...${NC}"
echo -e "${YELLOW}⚠️  Make sure you've added NEXT_PUBLIC_SENTRY_DSN to Vercel!${NC}"
echo ""
echo "To add it:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select: jewelshot-final"
echo "3. Settings → Environment Variables"
echo "4. Add: NEXT_PUBLIC_SENTRY_DSN"
echo ""

read -p "Have you added Sentry DSN to Vercel? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please add Sentry DSN before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Sentry configured${NC}"
echo ""

# Step 4: Deploy
echo -e "${BLUE}🚀 Deploying to production...${NC}"
echo ""

read -p "Ready to push to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📤 Pushing to main branch...${NC}"
    
    if git push origin main; then
        echo ""
        echo -e "${GREEN}✅ Successfully pushed to production!${NC}"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo -e "${BLUE}📊 Next steps:${NC}"
        echo ""
        echo "1. Monitor deployment:"
        echo "   → https://vercel.com/dashboard"
        echo ""
        echo "2. Visit your site:"
        echo "   → https://jewelshot-final.vercel.app"
        echo ""
        echo "3. Check monitoring:"
        echo "   → Sentry: https://sentry.io"
        echo "   → Analytics: https://vercel.com/dashboard"
        echo ""
        echo "4. Enable Analytics & Speed Insights:"
        echo "   → Vercel Dashboard → Analytics → Enable"
        echo "   → Vercel Dashboard → Speed Insights → Enable"
        echo ""
        echo -e "${GREEN}🚀 Your app is now LIVE!${NC}"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Push failed!${NC}"
        echo "Check the error message above and try again."
        exit 1
    fi
else
    echo -e "${YELLOW}⏸️  Deployment cancelled.${NC}"
    exit 0
fi







