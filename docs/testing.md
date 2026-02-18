# 🧪 Testing Strategy

[← Back to Documentation Hub](index.md)

This document provides a comprehensive guide to the testing approach, test coverage, and how to run and write tests for the Volunteer Calculator.

## Testing Philosophy

### Goals
1. **Ensure Correctness**: Verify all calculations are accurate
2. **Prevent Regressions**: Catch bugs before they reach users
3. **Document Behavior**: Tests serve as living documentation
4. **Enable Refactoring**: Confidence to improve code safely

### Principles
- **Comprehensive Coverage**: Test all functions and edge cases
- **Fast Execution**: All 31 tests run in < 100ms
- **Clear Failures**: Descriptive error messages
- **Maintainable**: Easy to add new tests

## Test Suite Organization

The test suite includes **31 test cases** organized into **6 test suites**:

### 1. Time Conversion Tests (6 tests)
Verify the `convertToHours()` function handles all time conversions correctly.

**Tests:**
- ✓ should convert hours to hours correctly
- ✓ should convert minutes to hours correctly
- ✓ should convert 30 minutes to 0.5 hours
- ✓ should convert 90 minutes to 1.5 hours
- ✓ should handle decimal hours
- ✓ should handle decimal minutes

**Example:**
```javascript
it('should convert minutes to hours correctly', () => {
    assertEquals(convertToHours(60, 'minutes'), 1);
    assertEquals(convertToHours(30, 'minutes'), 0.5);
    assertEquals(convertToHours(90, 'minutes'), 1.5);
});
```

### 2. Calculation Tests (6 tests)
Verify the `calculateResults()` function performs all calculations correctly.

**Tests:**
- ✓ should calculate single bag type correctly
- ✓ should calculate multiple bag types correctly
- ✓ should handle decimal bag weights
- ✓ should handle decimal volunteer counts
- ✓ should calculate with fractional hours correctly
- ✓ should handle many bag types

**Example:**
```javascript
it('should calculate single bag type correctly', () => {
    const result = calculateResults('Test Group', 10, 2, [
        { count: 20, weight: 25 }
    ]);
    
    assertEquals(result.totalPounds, 500);
    assertEquals(result.poundsPerVolunteer, 50);
    assertEquals(result.poundsPerVolunteerPerHour, 25);
});
```

### 3. Markdown Generation Tests (5 tests)
Verify the `generateMarkdownTable()` function creates properly formatted output.

**Tests:**
- ✓ should generate markdown table with correct structure
- ✓ should include all input values in markdown
- ✓ should format numbers correctly in markdown
- ✓ should include multiple bag types in markdown
- ✓ should create valid markdown table syntax

**Example:**
```javascript
it('should generate markdown table with correct structure', () => {
    const markdown = generateMarkdownTable(results);
    
    assertTrue(markdown.includes('# Test Group'));
    assertTrue(markdown.includes('## Input Data'));
    assertTrue(markdown.includes('## Bags Processed'));
    assertTrue(markdown.includes('## Summary Results'));
});
```

### 4. Edge Cases and Validation Tests (5 tests)
Test boundary conditions and unusual but valid inputs.

**Tests:**
- ✓ should handle single volunteer
- ✓ should handle very small time durations
- ✓ should handle large numbers
- ✓ should maintain precision with decimal calculations
- ✓ should handle empty bag weight edge case

**Example:**
```javascript
it('should handle single volunteer', () => {
    const result = calculateResults('Solo', 1, 1, [
        { count: 10, weight: 50 }
    ]);
    
    assertEquals(result.poundsPerVolunteer, 500);
});
```

### 5. Data Integrity Tests (3 tests)
Ensure calculations don't modify input data or corrupt stored values.

**Tests:**
- ✓ should not modify input data
- ✓ should preserve group name exactly
- ✓ should store correct bag type information

**Example:**
```javascript
it('should not modify input data', () => {
    const bags = [{ count: 10, weight: 20 }];
    const originalBags = JSON.stringify(bags);
    
    calculateResults('Test', 5, 2, bags);
    
    assertEquals(JSON.stringify(bags), originalBags);
});
```

### 6. Input Validation Tests (6 tests)
Test input validation and error handling.

**Tests:**
- ✓ should reject empty group name
- ✓ should handle zero volunteers edge case
- ✓ should handle zero duration edge case
- ✓ should handle empty bags array
- ✓ should handle negative values in calculations
- ✓ should trim whitespace from group name

**Example:**
```javascript
it('should reject empty group name', () => {
    try {
        validateInputs('', 5, 2, [{ count: 10, weight: 20 }]);
        assertTrue(false, 'Should have thrown error');
    } catch (e) {
        assertTrue(e.message.includes('required'));
    }
});
```

## Test Framework

### Custom Lightweight Framework

The project uses a custom test framework built specifically for this application:

```javascript
class TestRunner {
    constructor() {
        this.tests = [];
        this.currentSuite = '';
    }
    
    describe(suiteName, fn) {
        this.currentSuite = suiteName;
        fn();
    }
    
    it(testName, fn) {
        this.tests.push({
            suite: this.currentSuite,
            name: testName,
            fn: fn
        });
    }
    
    async run() {
        // Execute all tests and report results
    }
}
```

### Assertion Functions

**assertEquals(actual, expected)**
```javascript
function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(
            `Assertion failed: expected ${expected}, got ${actual}. ${message || ''}`
        );
    }
}
```

**assertAlmostEquals(actual, expected, tolerance)**
```javascript
function assertAlmostEquals(actual, expected, tolerance = 0.01, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(
            `Assertion failed: expected ${expected}, got ${actual} (tolerance: ${tolerance}). ${message || ''}`
        );
    }
}
```

**assertTrue(condition)**
```javascript
function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: condition is false. ${message || ''}`);
    }
}
```

**assertArrayEquals(actual, expected)**
```javascript
function assertArrayEquals(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
            `Arrays not equal. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}. ${message || ''}`
        );
    }
}
```

## Running Tests

### Running Tests in Browser

1. **Open test.html** in any web browser
2. Tests run automatically on page load
3. Results display with pass/fail status
4. Console shows detailed error messages

**Visual Output:**
```
🧪 Running Volunteer Calculator Test Suite

Time Conversion Tests
  ✓ should convert hours to hours correctly
  ✓ should convert minutes to hours correctly
  ✓ should convert 30 minutes to 0.5 hours
  ...

✅ All 31 tests passed!
```

### Running Tests in Node.js

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test
```

**Console Output:**
```
> volunteer-calculator@1.0.0 test
> node tests.node.js

🧪 Running Volunteer Calculator Test Suite

Time Conversion Tests
  ✓ should convert hours to hours correctly
  ✓ should convert minutes to hours correctly
  ...

✅ All 31 tests passed!
```

### Running Tests in CI/CD

Tests run automatically in GitHub Actions on every push and pull request:

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm test
```

**CI Output:**
- Green checkmark ✅ if all tests pass
- Red X ❌ if any test fails
- Detailed logs available in Actions tab

## Test Coverage

### Function Coverage
| Function | Tests | Coverage |
|----------|-------|----------|
| `convertToHours()` | 6 | 100% |
| `calculateResults()` | 12 | 100% |
| `generateMarkdownTable()` | 5 | 100% |
| `getBagData()` | 3 | 100% |
| Input validation | 6 | 100% |

### Scenario Coverage
- ✅ Single bag type
- ✅ Multiple bag types (2, 3, 10+)
- ✅ Decimal values (weights, counts, hours)
- ✅ Single volunteer
- ✅ Many volunteers
- ✅ Short duration (< 1 hour)
- ✅ Long duration (> 10 hours)
- ✅ Small numbers (< 10)
- ✅ Large numbers (> 10,000)
- ✅ Edge cases (zero, negative)

### Edge Case Coverage
- ✅ Single volunteer (division by 1)
- ✅ Very small durations (0.01 hours)
- ✅ Large numbers (10,000+ lbs)
- ✅ Many bag types (10+ types)
- ✅ Precision (floating point)
- ✅ Empty inputs
- ✅ Whitespace trimming
- ✅ Negative values

## Writing New Tests

### Test Template

```javascript
describe('Feature Name Tests', () => {
    it('should do something specific', () => {
        // 1. Setup (Arrange)
        const input = { /* test data */ };
        
        // 2. Execute (Act)
        const result = functionToTest(input);
        
        // 3. Verify (Assert)
        assertEquals(result.value, expectedValue);
        assertTrue(result.valid);
    });
});
```

### Best Practices

1. **One assertion per test** (generally)
   - Makes failures easier to diagnose
   - Exception: Related assertions can be grouped

2. **Descriptive test names**
   ```javascript
   // Good
   it('should calculate total pounds for multiple bag types')
   
   // Bad
   it('test 1')
   ```

3. **Test edge cases**
   ```javascript
   it('should handle zero volunteers edge case')
   it('should handle very large numbers')
   it('should maintain precision with decimals')
   ```

4. **Test error conditions**
   ```javascript
   it('should throw error for empty group name', () => {
       try {
           validateInputs('', 5, 2, []);
           fail('Should have thrown error');
       } catch (e) {
           assertTrue(e.message.includes('required'));
       }
   });
   ```

5. **Keep tests independent**
   - Each test should run standalone
   - No shared state between tests
   - Clear setup in each test

### Example: Adding a New Test

Let's add a test for a new feature: validating bag weight units.

```javascript
describe('Unit Validation Tests', () => {
    it('should accept valid weight units', () => {
        const validUnits = ['lbs', 'kg', 'oz'];
        
        validUnits.forEach(unit => {
            const result = validateUnit(unit);
            assertTrue(result.valid, `Unit ${unit} should be valid`);
        });
    });
    
    it('should reject invalid weight units', () => {
        const invalidUnits = ['grams', '', null, undefined];
        
        invalidUnits.forEach(unit => {
            const result = validateUnit(unit);
            assertTrue(!result.valid, `Unit ${unit} should be invalid`);
        });
    });
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Lint and Test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run lint
    - run: npm test
```

### CI Benefits
1. **Automatic Testing**: Every push triggers tests
2. **Pull Request Checks**: Tests must pass before merging
3. **Consistent Environment**: Same Node.js version every time
4. **Fast Feedback**: Results in < 1 minute

### Badge Status
The README includes a CI badge showing test status:

```markdown
[![CI/CD Pipeline](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/ci.yml)
```

## Debugging Failed Tests

### Reading Test Output

**Passed Test:**
```
✓ should convert hours to hours correctly
```

**Failed Test:**
```
✗ should calculate total pounds
  Assertion failed: expected 500, got 600
  at calculateResults (calculator.js:45)
```

### Common Failure Patterns

**1. Floating Point Precision**
```javascript
// Bad
assertEquals(result, 0.3); // May fail due to 0.30000000004

// Good
assertAlmostEquals(result, 0.3, 0.01);
```

**2. Reference vs Value**
```javascript
// Bad
assertEquals(array1, array2); // Compares references

// Good
assertArrayEquals(array1, array2); // Compares values
```

**3. Undefined Values**
```javascript
// Add null checks
if (result === undefined) {
    throw new Error('Result is undefined');
}
```

### Debugging Steps

1. **Read the error message** - It tells you exactly what failed
2. **Check the line number** - Shows where the failure occurred
3. **Add console.log** - Log intermediate values
4. **Run test in isolation** - Comment out other tests
5. **Use browser debugger** - Set breakpoints in tests.js

## Test Maintenance

### When to Update Tests

**Code Changes:**
- Function signature changes → Update test calls
- Algorithm changes → Update expected values
- New features → Add new tests

**Bug Fixes:**
- Add test that reproduces the bug
- Fix the bug
- Verify test now passes

**Refactoring:**
- Tests should still pass
- If not, tests may have been too implementation-specific

### Keeping Tests Fast

Current performance: **< 100ms for 31 tests**

**Strategies:**
- Avoid async operations when possible
- Mock slow operations (if any)
- Keep test data small
- Don't test UI rendering (tests calculator.js only)

### Test Checklist

Before committing:
- [ ] All existing tests pass
- [ ] New tests added for new features
- [ ] Edge cases covered
- [ ] Tests run in < 1 second
- [ ] No commented-out tests
- [ ] Descriptive test names
- [ ] Clear assertion messages

## Future Testing Improvements

### Potential Additions

1. **Integration Tests**
   - Test DOM interactions
   - Test form submission flow
   - Test clipboard functionality

2. **Visual Regression Tests**
   - Screenshot comparison
   - CSS changes detection
   - Responsive layout tests

3. **Performance Tests**
   - Benchmark calculations
   - Memory usage tracking
   - Load time metrics

4. **Accessibility Tests**
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast

5. **Browser Compatibility Tests**
   - Cross-browser testing
   - Mobile browser tests
   - Old browser fallbacks

---

[← Back to Documentation Hub](index.md) | [Next: Browser Compatibility →](browser-compatibility.md)
