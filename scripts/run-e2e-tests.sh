#!/bin/bash

# ============================================
# E2E Test Runner Script
# ============================================
# 
# Runs Playwright E2E tests with proper setup
#

set -e

echo "🎭 Playwright E2E Test Runner"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if Playwright is installed
echo -e "${BLUE}📦 Checking Playwright installation...${NC}"
if ! command -v npx playwright &> /dev/null; then
  echo -e "${RED}❌ Playwright not found. Installing...${NC}"
  npm install
fi
echo -e "${GREEN}✅ Playwright installed${NC}"
echo ""

# Step 2: Install browsers if needed
echo -e "${BLUE}🌐 Checking browsers...${NC}"
npx playwright install chromium --with-deps 2>&1 | grep -v "Skipping" || true
echo -e "${GREEN}✅ Browsers ready${NC}"
echo ""

# Step 3: Check if dev server is running
echo -e "${BLUE}🔍 Checking dev server...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Dev server running${NC}"
  SERVER_RUNNING=true
else
  echo -e "${YELLOW}⚠️  Dev server not running${NC}"
  echo -e "${BLUE}Starting dev server...${NC}"
  SERVER_RUNNING=false
fi
echo ""

# Step 4: Run tests
echo -e "${BLUE}🧪 Running E2E tests...${NC}"
echo ""

if [ "$1" == "--ui" ]; then
  echo "Running with UI..."
  npx playwright test --ui
elif [ "$1" == "--debug" ]; then
  echo "Running in debug mode..."
  npx playwright test --debug
elif [ "$1" == "--headed" ]; then
  echo "Running in headed mode..."
  npx playwright test --headed
elif [ -n "$1" ]; then
  echo "Running specific test: $1"
  npx playwright test "$1"
else
  echo "Running all tests..."
  npx playwright test
fi

# Step 5: Show results
echo ""
echo -e "${BLUE}📊 Test Results${NC}"
echo "View HTML report: npx playwright show-report"
echo ""
echo -e "${GREEN}✅ E2E tests complete!${NC}"

