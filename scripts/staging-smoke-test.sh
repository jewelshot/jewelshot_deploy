#!/bin/bash

# ============================================
# Staging Smoke Tests
# ============================================
# 
# Quick health checks for staging environment
# Run after each deployment
#

set -e

STAGING_URL="${STAGING_URL:-https://staging.jewelshot.ai}"

echo "🧪 Staging Smoke Tests"
echo "======================"
echo "Testing: $STAGING_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# Helper function
test_endpoint() {
  local name=$1
  local url=$2
  local expected_status=$3
  
  echo -n "Testing $name... "
  
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $status)"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} (HTTP $status, expected $expected_status)"
    ((FAILED++))
  fi
}

# Test 1: Homepage redirects to studio
test_endpoint "Homepage" "$STAGING_URL" 308

# Test 2: Studio page loads
test_endpoint "Studio page" "$STAGING_URL/studio" 200

# Test 3: Gallery page loads
test_endpoint "Gallery page" "$STAGING_URL/gallery" 200

# Test 4: Health endpoint
test_endpoint "Health endpoint" "$STAGING_URL/api/health" 200

# Test 5: Credits API (should require auth)
test_endpoint "Credits API (auth required)" "$STAGING_URL/api/credits" 401

# Test 6: Queue endpoint
test_endpoint "Queue status" "$STAGING_URL/api/queue/status" 200

# Test 7: Static assets
test_endpoint "Favicon" "$STAGING_URL/favicon.ico" 200

echo ""
echo "================================"
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "================================"

if [ $FAILED -gt 0 ]; then
  echo -e "${RED}⚠️  Some tests failed. Check staging deployment.${NC}"
  exit 1
else
  echo -e "${GREEN}🎉 All smoke tests passed!${NC}"
  exit 0
fi


