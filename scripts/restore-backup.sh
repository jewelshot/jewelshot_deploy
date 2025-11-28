#!/bin/bash

###############################################################################
# JEWELSHOT - DATABASE RESTORE SCRIPT
###############################################################################
#
# Purpose: Restore Supabase database from backup
# Usage: ./scripts/restore-backup.sh [OPTIONS]
# Author: Jewelshot DevOps Team
# Date: 2024-11-28
#
# ⚠️  CRITICAL: Test on staging before running on production!
# ⚠️  DANGER: This will overwrite current database data!
#
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_REF="${SUPABASE_PROJECT_REF:-}"
BACKUP_TIMESTAMP="${1:-}"
DRY_RUN="${DRY_RUN:-false}"

###############################################################################
# FUNCTIONS
###############################################################################

print_header() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║       JEWELSHOT - DATABASE RESTORE SCRIPT                  ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

print_error() {
  echo -e "${RED}❌ ERROR: $1${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
  print_info "Checking prerequisites..."
  
  # Check if Supabase CLI installed
  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not installed!"
    print_info "Install: npm install -g supabase"
    exit 1
  fi
  
  # Check if logged in
  if ! supabase projects list &> /dev/null; then
    print_error "Not logged in to Supabase!"
    print_info "Run: supabase login"
    exit 1
  fi
  
  # Check project ref
  if [ -z "$PROJECT_REF" ]; then
    print_error "SUPABASE_PROJECT_REF not set!"
    print_info "Set environment variable or edit this script"
    exit 1
  fi
  
  print_success "Prerequisites OK"
}

confirm_restore() {
  print_warning "THIS WILL OVERWRITE YOUR DATABASE!"
  print_warning "Project: $PROJECT_REF"
  print_warning "Backup: ${BACKUP_TIMESTAMP:-Latest}"
  echo ""
  read -p "Are you ABSOLUTELY SURE? Type 'YES' to continue: " confirmation
  
  if [ "$confirmation" != "YES" ]; then
    print_info "Restore cancelled by user"
    exit 0
  fi
}

backup_current_state() {
  print_info "Creating safety backup of current state..."
  
  # Create emergency backup before restore
  EMERGENCY_BACKUP="emergency_backup_$(date +%Y%m%d_%H%M%S).sql"
  
  if supabase db dump -f "$EMERGENCY_BACKUP" --project-ref "$PROJECT_REF"; then
    print_success "Emergency backup saved: $EMERGENCY_BACKUP"
  else
    print_error "Failed to create emergency backup!"
    print_warning "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
}

perform_restore() {
  print_info "Starting restore process..."
  
  if [ -n "$BACKUP_TIMESTAMP" ]; then
    print_info "Restoring to timestamp: $BACKUP_TIMESTAMP"
    
    # Point-in-time recovery
    if [ "$DRY_RUN" = "true" ]; then
      print_warning "DRY RUN - Would restore to: $BACKUP_TIMESTAMP"
    else
      # Use Supabase CLI to restore
      supabase db restore "$BACKUP_TIMESTAMP" --project-ref "$PROJECT_REF"
    fi
  else
    print_info "Restoring from latest backup..."
    
    # Restore from latest
    if [ "$DRY_RUN" = "true" ]; then
      print_warning "DRY RUN - Would restore from latest backup"
    else
      supabase db restore --project-ref "$PROJECT_REF"
    fi
  fi
  
  print_success "Restore completed!"
}

verify_restore() {
  print_info "Verifying restore..."
  
  # Run health check
  HEALTH_URL="https://${PROJECT_REF}.supabase.co/rest/v1/"
  
  if curl -s -f "$HEALTH_URL" > /dev/null 2>&1; then
    print_success "Database is responding"
  else
    print_error "Database health check failed!"
  fi
  
  # TODO: Add specific data integrity checks
  print_warning "Manual verification recommended:"
  print_info "1. Check user count"
  print_info "2. Check image count"
  print_info "3. Check credit totals"
  print_info "4. Test critical user flows"
}

###############################################################################
# MAIN EXECUTION
###############################################################################

print_header

# Dry run mode
if [ "$DRY_RUN" = "true" ]; then
  print_warning "RUNNING IN DRY RUN MODE - No changes will be made"
fi

# 1. Prerequisites
check_prerequisites

# 2. Confirmation
if [ "$DRY_RUN" != "true" ]; then
  confirm_restore
fi

# 3. Safety backup
if [ "$DRY_RUN" != "true" ]; then
  backup_current_state
fi

# 4. Restore
perform_restore

# 5. Verify
if [ "$DRY_RUN" != "true" ]; then
  verify_restore
fi

print_success "Restore script completed!"
print_info "Next steps:"
echo "  1. Test critical user flows"
echo "  2. Check data integrity"
echo "  3. Monitor error logs"
echo "  4. Notify team"

exit 0

