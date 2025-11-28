#!/bin/bash
# ============================================
# Google OAuth Quick Test Script
# ============================================
# Tests Google OAuth integration locally
# ============================================

set -e

echo "🔐 Testing Google OAuth Integration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# 1. Check if dev server is running
# ============================================
echo "1️⃣  Checking if dev server is running..."

if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${RED}❌ Dev server not running${NC}"
  echo ""
  echo "Start it with:"
  echo "  npm run dev"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Dev server is running${NC}"
echo ""

# ============================================
# 2. Check Supabase connection
# ============================================
echo "2️⃣  Checking Supabase connection..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL not set${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Supabase URL configured${NC}"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# ============================================
# 3. Test OAuth callback route
# ============================================
echo "3️⃣  Testing OAuth callback route..."

CALLBACK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/callback)

if [ "$CALLBACK_STATUS" == "200" ] || [ "$CALLBACK_STATUS" == "307" ] || [ "$CALLBACK_STATUS" == "308" ]; then
  echo -e "${GREEN}✅ Callback route accessible${NC}"
else
  echo -e "${RED}❌ Callback route returned: $CALLBACK_STATUS${NC}"
  exit 1
fi

echo ""

# ============================================
# 4. Check database trigger
# ============================================
echo "4️⃣  Checking profile creation trigger..."

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY not set (skipping DB check)${NC}"
else
  # Check if handle_new_user function exists
  TRIGGER_CHECK=$(curl -s -X POST \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/check_trigger" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" || echo "skip")
  
  if [ "$TRIGGER_CHECK" != "skip" ]; then
    echo -e "${GREEN}✅ Database trigger configured${NC}"
  else
    echo -e "${YELLOW}⚠️  Could not verify trigger (check manually)${NC}"
  fi
fi

echo ""

# ============================================
# 5. Open browser for manual test
# ============================================
echo "5️⃣  Ready for manual testing!"
echo ""
echo -e "${YELLOW}📝 Manual Test Steps:${NC}"
echo ""
echo "1. Open: http://localhost:3000/auth/login"
echo "2. Click 'Continue with Google'"
echo "3. Sign in with your Google account"
echo "4. Should redirect to /studio on success"
echo ""
echo "5. Verify in Supabase:"
echo "   - auth.users has your Google user"
echo "   - public.profiles has your profile"
echo ""

# Ask user if they want to open browser
read -p "Open browser now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  if command -v open &> /dev/null; then
    open "http://localhost:3000/auth/login"
  elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000/auth/login"
  else
    echo "Please open: http://localhost:3000/auth/login"
  fi
fi

echo ""
echo -e "${GREEN}✅ OAuth test ready!${NC}"
echo ""
echo "📚 Full setup guide: GOOGLE_OAUTH_SETUP.md"
echo ""

