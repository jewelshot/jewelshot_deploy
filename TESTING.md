# 🧪 TESTING GUIDE

## Overview

**Testing Framework:** Vitest + React Testing Library  
**Current Coverage:** ~60% (Critical paths)  
**Goal:** 80% coverage by production launch  

---

## Quick Start

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

---

## Test Structure

```
src/__tests__/
├── setup.ts                      # Global test configuration
├── utils/
│   └── test-helpers.ts          # Utility functions
├── lib/
│   └── credit-manager.test.ts   # Credit system tests
├── api/
│   └── ai-submit.test.ts        # API route tests
├── hooks/
│   └── useAIQueue.test.ts       # Hook tests
└── integration/
    └── batch-flow.test.ts       # Integration tests
```

---

## What's Tested

### ✅ **CRITICAL PATHS** (High Priority)

1. **Credit System** (100% coverage)
   - `reserveCredit()` - Reserve credits for operations
   - `confirmCredit()` - Confirm successful operations
   - `refundCredit()` - Refund failed operations
   - `getUserCredits()` - Get user balance
   - **File:** `src/__tests__/lib/credit-manager.test.ts`

2. **AI Queue Hook** (100% coverage)
   - `submit()` - Submit AI jobs
   - `submitAndWait()` - Submit and wait for completion
   - `cancel()` - Cancel jobs
   - **File:** `src/__tests__/hooks/useAIQueue.test.ts`

3. **Batch Processing** (Integration)
   - Complete batch flow
   - Partial failures
   - Credit management
   - Validation
   - **File:** `src/__tests__/integration/batch-flow.test.ts`

4. **API Routes** (Core endpoints)
   - `/api/ai/submit` - Job submission
   - Authentication checks
   - Input validation
   - Error handling
   - **File:** `src/__tests__/api/ai-submit.test.ts`

---

## Test Coverage Goals

| Module | Current | Goal | Priority |
|--------|---------|------|----------|
| Credit System | 100% | 100% | ✅ Critical |
| AI Queue | 100% | 100% | ✅ Critical |
| API Routes | 60% | 80% | 🟡 High |
| Components | 40% | 70% | 🟡 Medium |
| Utilities | 50% | 80% | 🟡 Medium |
| **Overall** | **~60%** | **80%** | **Target** |

---

## Running Tests

### **Local Development**

```bash
# Watch mode (auto-run on changes)
npm test

# With UI dashboard
npm run test:ui
```

### **CI/CD**

```bash
# Run once (no watch)
npm run test:run

# With coverage report
npm run test:coverage
```

### **Specific Test Files**

```bash
# Run single test file
npm test credit-manager.test.ts

# Run by pattern
npm test -- --grep="credit"
```

---

## Writing Tests

### **Test Template**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = doSomething(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### **Mock Example**

```typescript
// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn().mockResolvedValue({ data: 'test', error: null }),
  })),
}));

// Mock fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
});
```

---

## Coverage Reports

### **Generate Report**

```bash
npm run test:coverage
```

**Output:**
- `coverage/index.html` - Interactive HTML report
- `coverage/coverage-final.json` - JSON data
- Terminal summary

### **View Report**

```bash
# Open in browser
open coverage/index.html
```

---

## CI Integration

**GitHub Actions** (`.github/workflows/ci.yml`)

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

---

## Test Categories

### **1. Unit Tests**
- Individual functions/components
- Isolated, fast
- No external dependencies

### **2. Integration Tests**
- Multiple components together
- Database/API interactions (mocked)
- User flows

### **3. E2E Tests** (Future)
- Full user journeys
- Real browser (Playwright)
- Production-like environment

---

## Best Practices

### ✅ **DO:**
- Test critical paths first
- Mock external dependencies
- Use descriptive test names
- Test edge cases
- Keep tests fast (<100ms each)

### ❌ **DON'T:**
- Test implementation details
- Use real API calls
- Skip error cases
- Write flaky tests
- Ignore failing tests

---

## Common Patterns

### **Testing Hooks**

```typescript
import { renderHook, waitFor } from '@testing-library/react';

const { result } = renderHook(() => useMyHook());

await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### **Testing Components**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

render(<MyComponent />);

const button = screen.getByRole('button');
fireEvent.click(button);

expect(screen.getByText('Success')).toBeInTheDocument();
```

### **Testing Async Operations**

```typescript
it('should handle async', async () => {
  const promise = asyncFunction();
  
  await expect(promise).resolves.toBe('success');
  // or
  await expect(promise).rejects.toThrow('error');
});
```

---

## Troubleshooting

### **Tests Won't Run**

```bash
# Clear cache
rm -rf node_modules/.vite
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### **Mock Not Working**

```typescript
// Make sure to clear mocks
beforeEach(() => {
  vi.clearAllMocks();
});

// Check mock is called
expect(mockFn).toHaveBeenCalledWith('expected');
```

### **Timeout Errors**

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

---

## Next Steps

### **Phase 1: Current** ✅
- Credit system tests
- AI queue tests
- Basic integration tests
- **Coverage: ~60%**

### **Phase 2: Next Week** 🎯
- Component tests (atoms, molecules)
- API route tests (all endpoints)
- Email system tests
- **Coverage: ~70%**

### **Phase 3: Month 1** 🚀
- E2E tests (Playwright)
- Performance tests
- Security tests
- **Coverage: ~80%**

---

## Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)

---

**Status:** ✅ **Testing infrastructure ready!**  
**Coverage:** ~60% (Critical paths covered)  
**Next:** Add more component and API tests

