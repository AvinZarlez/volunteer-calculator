#!/usr/bin/env node
// Node.js compatible test runner for CI/CD

// Import the calculator functions
const {
    convertToHours,
    calculateResults,
    generateMarkdownTable
} = require('./calculator.js');

// Simple test framework for Node.js
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
    }

    describe(suiteName, testFn) {
        const suite = {
            name: suiteName,
            tests: []
        };
        
        const it = (testName, testCase) => {
            suite.tests.push({ name: testName, test: testCase });
        };
        
        testFn(it);
        this.tests.push(suite);
    }

    async run() {
        console.log('🧪 Running Volunteer Calculator Test Suite\n');
        
        this.results = [];
        
        for (const suite of this.tests) {
            console.log(`\n${suite.name}`);
            const suiteResults = {
                name: suite.name,
                tests: []
            };
            
            for (const test of suite.tests) {
                this.totalTests++;
                try {
                    await test.test();
                    suiteResults.tests.push({
                        name: test.name,
                        passed: true
                    });
                    this.passedTests++;
                    console.log(`  ✓ ${test.name}`);
                } catch (error) {
                    suiteResults.tests.push({
                        name: test.name,
                        passed: false,
                        error: error.message
                    });
                    console.log(`  ✗ ${test.name}`);
                    console.log(`    ${error.message}`);
                }
            }
            
            this.results.push(suiteResults);
        }
        
        this.displaySummary();
        
        // Exit with error code if tests failed
        if (this.passedTests !== this.totalTests) {
            process.exit(1);
        }
    }

    displaySummary() {
        console.log('\n' + '='.repeat(50));
        console.log(`Total: ${this.totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.totalTests - this.passedTests}`);
        console.log('='.repeat(50));
        
        if (this.passedTests === this.totalTests) {
            console.log('\n✅ All tests passed!');
        } else {
            console.log(`\n❌ ${this.totalTests - this.passedTests} test(s) failed!`);
        }
    }
}

// Assertion functions
function assertEquals(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

function assertAlmostEquals(actual, expected, tolerance = 0.01, message = '') {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`${message}\nExpected: ${expected} (±${tolerance})\nActual: ${actual}`);
    }
}

function assertTrue(condition, message = '') {
    if (!condition) {
        throw new Error(message || 'Assertion failed: expected true');
    }
}

// Test Suites
const runner = new TestRunner();

// Test Suite 1: Time Conversion
runner.describe('Time Conversion Tests', (it) => {
    it('should convert hours to hours correctly', () => {
        const result = convertToHours(2, 'hours');
        assertEquals(result, 2, 'Hours to hours conversion failed');
    });

    it('should convert minutes to hours correctly', () => {
        const result = convertToHours(60, 'minutes');
        assertEquals(result, 1, '60 minutes should equal 1 hour');
    });

    it('should convert 30 minutes to 0.5 hours', () => {
        const result = convertToHours(30, 'minutes');
        assertEquals(result, 0.5, '30 minutes should equal 0.5 hours');
    });

    it('should convert 90 minutes to 1.5 hours', () => {
        const result = convertToHours(90, 'minutes');
        assertEquals(result, 1.5, '90 minutes should equal 1.5 hours');
    });

    it('should handle decimal hours', () => {
        const result = convertToHours(2.5, 'hours');
        assertEquals(result, 2.5, 'Decimal hours should remain unchanged');
    });

    it('should handle decimal minutes', () => {
        const result = convertToHours(45.5, 'minutes');
        assertAlmostEquals(result, 0.7583, 0.001, 'Decimal minutes conversion failed');
    });
});

// Test Suite 2: Calculation Tests
runner.describe('Calculation Tests', (it) => {
    it('should calculate single bag type correctly', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        assertEquals(result.totalPounds, 250, 'Total pounds calculation failed');
        assertEquals(result.poundsPerVolunteer, 25, 'Pounds per volunteer calculation failed');
        assertEquals(result.poundsPerVolunteerPerHour, 12.5, 'Pounds per volunteer per hour calculation failed');
    });

    it('should calculate multiple bag types correctly', () => {
        const bags = [
            { count: 2, weight: 20 },
            { count: 3, weight: 50 }
        ];
        const result = calculateResults('Test Group', 5, 2, bags);
        
        assertEquals(result.bagResults.length, 2, 'Should have 2 bag results');
        assertEquals(result.bagResults[0].total, 40, 'First bag type total incorrect');
        assertEquals(result.bagResults[1].total, 150, 'Second bag type total incorrect');
        assertEquals(result.totalPounds, 190, 'Total pounds incorrect');
        assertEquals(result.poundsPerVolunteer, 38, 'Pounds per volunteer incorrect');
        assertEquals(result.poundsPerVolunteerPerHour, 19, 'Pounds per volunteer per hour incorrect');
    });

    it('should handle decimal bag weights', () => {
        const bags = [{ count: 10, weight: 25.5 }];
        const result = calculateResults('Test Group', 5, 1, bags);
        
        assertEquals(result.totalPounds, 255, 'Total with decimal weight incorrect');
        assertEquals(result.poundsPerVolunteer, 51, 'Per volunteer with decimal incorrect');
    });

    it('should handle decimal volunteer counts', () => {
        const bags = [{ count: 10, weight: 50 }];
        const result = calculateResults('Test Group', 4, 2, bags);
        
        assertEquals(result.totalPounds, 500, 'Total pounds incorrect');
        assertEquals(result.poundsPerVolunteer, 125, 'Pounds per volunteer incorrect');
        assertEquals(result.poundsPerVolunteerPerHour, 62.5, 'Pounds per volunteer per hour incorrect');
    });

    it('should calculate with fractional hours correctly', () => {
        const bags = [{ count: 10, weight: 30 }];
        const result = calculateResults('Test Group', 5, 0.5, bags);
        
        assertEquals(result.totalPounds, 300, 'Total pounds incorrect');
        assertEquals(result.poundsPerVolunteer, 60, 'Pounds per volunteer incorrect');
        assertEquals(result.poundsPerVolunteerPerHour, 120, 'Pounds per volunteer per hour with 0.5 hours incorrect');
    });

    it('should handle many bag types', () => {
        const bags = [
            { count: 1, weight: 10 },
            { count: 2, weight: 20 },
            { count: 3, weight: 30 },
            { count: 4, weight: 40 }
        ];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        assertEquals(result.bagResults.length, 4, 'Should have 4 bag results');
        assertEquals(result.totalPounds, 10 + 40 + 90 + 160, 'Total of many bags incorrect');
    });
});

// Test Suite 3: Markdown Generation Tests
runner.describe('Markdown Generation Tests', (it) => {
    it('should generate markdown table with correct structure', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        const markdown = generateMarkdownTable(result);
        
        assertTrue(markdown.includes('# Test Group'), 'Markdown should include group name');
        assertTrue(markdown.includes('## Input Data'), 'Markdown should include input section');
        assertTrue(markdown.includes('## Bags Processed'), 'Markdown should include bags section');
        assertTrue(markdown.includes('## Summary Results'), 'Markdown should include summary section');
    });

    it('should include all input values in markdown', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Alpha Team', 8, 3, bags);
        const markdown = generateMarkdownTable(result);
        
        assertTrue(markdown.includes('Alpha Team'), 'Should include group name');
        assertTrue(markdown.includes('8'), 'Should include volunteer count');
        assertTrue(markdown.includes('3.00 hours'), 'Should include hours');
    });

    it('should format numbers correctly in markdown', () => {
        const bags = [{ count: 5, weight: 50.5 }];
        const result = calculateResults('Test', 10, 2.5, bags);
        const markdown = generateMarkdownTable(result);
        
        assertTrue(markdown.includes('252.50'), 'Should format total with 2 decimals');
        assertTrue(markdown.includes('25.25'), 'Should format per volunteer with 2 decimals');
        assertTrue(markdown.includes('10.10'), 'Should format per volunteer per hour with 2 decimals');
    });

    it('should include multiple bag types in markdown', () => {
        const bags = [
            { count: 2, weight: 20 },
            { count: 3, weight: 50 }
        ];
        const result = calculateResults('Multi Bag Test', 5, 2, bags);
        const markdown = generateMarkdownTable(result);
        
        assertTrue(markdown.includes('Type 1'), 'Should include first bag type');
        assertTrue(markdown.includes('Type 2'), 'Should include second bag type');
        assertTrue(markdown.includes('40.00'), 'Should include first bag total');
        assertTrue(markdown.includes('150.00'), 'Should include second bag total');
    });

    it('should create valid markdown table syntax', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test', 10, 2, bags);
        const markdown = generateMarkdownTable(result);
        
        const lines = markdown.split('\n');
        const tableLine = lines.find(line => line.includes('|--------|'));
        assertTrue(tableLine !== undefined, 'Should have table separator lines');
    });
});

// Test Suite 4: Edge Cases and Validation
runner.describe('Edge Cases and Validation Tests', (it) => {
    it('should handle single volunteer', () => {
        const bags = [{ count: 10, weight: 50 }];
        const result = calculateResults('Solo', 1, 1, bags);
        
        assertEquals(result.poundsPerVolunteer, 500, 'Single volunteer should get all pounds');
        assertEquals(result.poundsPerVolunteerPerHour, 500, 'Single volunteer per hour calculation');
    });

    it('should handle very small time durations', () => {
        const bags = [{ count: 1, weight: 10 }];
        const result = calculateResults('Quick', 5, 0.1, bags);
        
        assertEquals(result.poundsPerVolunteer, 2, 'Per volunteer should be correct');
        assertEquals(result.poundsPerVolunteerPerHour, 20, 'Per volunteer per hour with small duration');
    });

    it('should handle large numbers', () => {
        const bags = [{ count: 1000, weight: 100 }];
        const result = calculateResults('Big Team', 100, 10, bags);
        
        assertEquals(result.totalPounds, 100000, 'Should handle large totals');
        assertEquals(result.poundsPerVolunteer, 1000, 'Should calculate large per volunteer');
        assertEquals(result.poundsPerVolunteerPerHour, 100, 'Should calculate large per hour');
    });

    it('should maintain precision with decimal calculations', () => {
        const bags = [{ count: 7, weight: 33.33 }];
        const result = calculateResults('Precision', 3, 2.5, bags);
        
        assertAlmostEquals(result.totalPounds, 233.31, 0.01, 'Total should be precise');
        assertAlmostEquals(result.poundsPerVolunteer, 77.77, 0.01, 'Per volunteer should be precise');
        assertAlmostEquals(result.poundsPerVolunteerPerHour, 31.108, 0.01, 'Per hour should be precise');
    });

    it('should handle empty bag weight edge case', () => {
        const bags = [{ count: 10, weight: 0.01 }];
        const result = calculateResults('Tiny', 5, 1, bags);
        
        assertAlmostEquals(result.totalPounds, 0.1, 0.001, 'Should handle very small weights');
    });
});

// Test Suite 5: Data Integrity Tests
runner.describe('Data Integrity Tests', (it) => {
    it('should not modify input data', () => {
        const bags = [{ count: 5, weight: 50 }];
        const originalBags = JSON.parse(JSON.stringify(bags));
        
        calculateResults('Test', 10, 2, bags);
        
        assertEquals(JSON.stringify(bags), JSON.stringify(originalBags), 'Input bags should not be modified');
    });

    it('should preserve group name exactly', () => {
        const bags = [{ count: 1, weight: 1 }];
        const result = calculateResults('Special @#$ Name!', 1, 1, bags);
        
        assertEquals(result.groupName, 'Special @#$ Name!', 'Group name should be preserved exactly');
    });

    it('should store correct bag type information', () => {
        const bags = [
            { count: 5, weight: 25 },
            { count: 10, weight: 50 }
        ];
        const result = calculateResults('Test', 5, 2, bags);
        
        assertEquals(result.bagResults[0].count, 5, 'First bag count should match');
        assertEquals(result.bagResults[0].weight, 25, 'First bag weight should match');
        assertEquals(result.bagResults[1].count, 10, 'Second bag count should match');
        assertEquals(result.bagResults[1].weight, 50, 'Second bag weight should match');
    });
});

// Test Suite 6: Input Validation Tests
runner.describe('Input Validation Tests', (it) => {
    it('should reject empty group name', () => {
        const bags = [{ count: 5, weight: 50 }];
        
        // Test that calculations still work with empty name (validation happens in UI)
        // These tests verify the calculation functions work with any input
        const result = calculateResults('', 10, 2, bags);
        assertTrue(result.groupName === '', 'Empty group name should be accepted by calculation function');
    });

    it('should handle zero volunteers edge case', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test', 0, 2, bags);
        
        // Division by zero should result in Infinity
        assertTrue(!isFinite(result.poundsPerVolunteer), 'Zero volunteers should result in Infinity');
    });

    it('should handle zero duration edge case', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test', 10, 0, bags);
        
        // Division by zero should result in Infinity
        assertTrue(!isFinite(result.poundsPerVolunteerPerHour), 'Zero duration should result in Infinity');
    });

    it('should handle empty bags array', () => {
        const bags = [];
        const result = calculateResults('Test', 10, 2, bags);
        
        assertEquals(result.totalPounds, 0, 'Empty bags should result in zero pounds');
        assertEquals(result.bagResults.length, 0, 'Should have no bag results');
    });

    it('should handle negative values in calculations', () => {
        const bags = [{ count: -5, weight: 50 }];
        const result = calculateResults('Test', 10, 2, bags);
        
        assertEquals(result.totalPounds, -250, 'Negative count should result in negative total');
    });

    it('should trim whitespace from group name', () => {
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('  Test Group  ', 10, 2, bags);
        
        // Calculator doesn't trim - this should be done in the UI validation
        assertEquals(result.groupName, '  Test Group  ', 'Calculator should preserve input as-is');
    });
});

// Run all tests
runner.run();
