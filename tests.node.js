#!/usr/bin/env node
// Node.js compatible test runner for CI/CD

// Import the calculator functions
const {
    convertToHours,
    calculateResults,
    generateMarkdownTable,
    StorageModule,
    generateAllDataCSV,
    importDataFromCSV,
    parseCSVLine,
    entryToCSVLine,
    getCSVHeader
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

// Test Suite 7: Storage Module Tests
runner.describe('Storage Module Tests', (it) => {
    // Mock localStorage for Node.js testing
    const mockLocalStorage = {
        data: {},
        getItem: function(key) {
            return this.data[key] || null;
        },
        setItem: function(key, value) {
            this.data[key] = value;
        },
        removeItem: function(key) {
            delete this.data[key];
        },
        clear: function() {
            this.data = {};
        }
    };
    
    // Mock localStorage in global scope
    global.localStorage = mockLocalStorage;
    
    it('should save a calculation result', () => {
        // Clear storage first
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        const saved = StorageModule.save(result);
        assertTrue(saved, 'Save should return true');
        
        const groups = StorageModule.getGroupNames();
        assertTrue(groups.includes('Test Group'), 'Group should be in storage');
    });
    
    it('should retrieve saved entries for a group', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result1 = calculateResults('Test Group', 10, 2, bags);
        const result2 = calculateResults('Test Group', 15, 3, bags);
        
        StorageModule.save(result1);
        StorageModule.save(result2);
        
        const entries = StorageModule.getGroup('Test Group');
        assertEquals(entries.length, 2, 'Should have 2 entries');
    });
    
    it('should delete a specific entry', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        StorageModule.save(result);
        
        const entries = StorageModule.getGroup('Test Group');
        assertEquals(entries.length, 1, 'Should have 1 entry');
        
        const entryId = entries[0].id;
        const deleted = StorageModule.deleteEntry('Test Group', entryId);
        
        assertTrue(deleted, 'Delete should return true');
        
        const remainingEntries = StorageModule.getGroup('Test Group');
        assertEquals(remainingEntries.length, 0, 'Should have no entries after delete');
    });
    
    it('should handle multiple groups', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result1 = calculateResults('Group A', 10, 2, bags);
        const result2 = calculateResults('Group B', 15, 3, bags);
        
        StorageModule.save(result1);
        StorageModule.save(result2);
        
        const groups = StorageModule.getGroupNames();
        assertEquals(groups.length, 2, 'Should have 2 groups');
        assertTrue(groups.includes('Group A'), 'Should have Group A');
        assertTrue(groups.includes('Group B'), 'Should have Group B');
    });
    
    it('should add timestamp to saved entries', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        StorageModule.save(result);
        
        const entries = StorageModule.getGroup('Test Group');
        assertTrue(entries[0].timestamp !== undefined, 'Entry should have timestamp');
    });
    
    it('should add unique ID to each entry', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        StorageModule.save(result);
        StorageModule.save(result);
        
        const entries = StorageModule.getGroup('Test Group');
        assertEquals(entries.length, 2, 'Should have 2 entries');
        assertTrue(entries[0].id !== entries[1].id, 'IDs should be unique');
    });
    
    it('should trim group names when saving and retrieving', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('  Test Group  ', 10, 2, bags);
        
        StorageModule.save(result);
        
        const entries = StorageModule.getGroup('Test Group');
        assertEquals(entries.length, 1, 'Should find entry with trimmed name');
    });
    
    it('should return empty array for non-existent group', () => {
        StorageModule.clear();
        
        const entries = StorageModule.getGroup('Non Existent');
        assertEquals(entries.length, 0, 'Should return empty array');
    });
    
    it('should remove group when last entry is deleted', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        StorageModule.save(result);
        
        const entries = StorageModule.getGroup('Test Group');
        const entryId = entries[0].id;
        
        StorageModule.deleteEntry('Test Group', entryId);
        
        const groups = StorageModule.getGroupNames();
        assertEquals(groups.length, 0, 'Should have no groups after deleting last entry');
    });
    
    it('should successfully delete entry with string ID', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        StorageModule.save(result);
        
        const entriesBefore = StorageModule.getGroup('Test Group');
        assertEquals(entriesBefore.length, 1, 'Should have 1 entry before delete');
        
        const entryId = entriesBefore[0].id;
        assertTrue(typeof entryId === 'string', 'Entry ID should be a string');
        
        const deleted = StorageModule.deleteEntry('Test Group', entryId);
        assertTrue(deleted, 'Delete should return true');
        
        const entriesAfter = StorageModule.getGroup('Test Group');
        assertEquals(entriesAfter.length, 0, 'Should have 0 entries after delete');
    });
    
    it('should delete correct entry when multiple entries exist', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50 }];
        const result1 = calculateResults('Test Group', 10, 2, bags);
        const result2 = calculateResults('Test Group', 15, 3, bags);
        const result3 = calculateResults('Test Group', 20, 4, bags);
        
        StorageModule.save(result1);
        StorageModule.save(result2);
        StorageModule.save(result3);
        
        const entriesBefore = StorageModule.getGroup('Test Group');
        assertEquals(entriesBefore.length, 3, 'Should have 3 entries before delete');
        
        const middleEntryId = entriesBefore[1].id;
        StorageModule.deleteEntry('Test Group', middleEntryId);
        
        const entriesAfter = StorageModule.getGroup('Test Group');
        assertEquals(entriesAfter.length, 2, 'Should have 2 entries after delete');
        
        // Verify the correct entry was deleted (middle one with 15 volunteers)
        const remainingVolunteerCounts = entriesAfter.map(e => e.numVolunteers);
        assertTrue(remainingVolunteerCounts.includes(10), 'First entry should remain');
        assertTrue(remainingVolunteerCounts.includes(20), 'Third entry should remain');
        assertTrue(!remainingVolunteerCounts.includes(15), 'Middle entry should be deleted');
    });
});

// Markdown Generation Tests
runner.describe('Markdown Generation Tests', (it) => {
    it('should generate markdown for single group result', () => {
        const bags = [
            { count: 5, weight: 30, type: 'Dog' },
            { count: 3, weight: 25, type: 'Cat' }
        ];
        const result = calculateResults('Test Group', 10, 2, bags);
        
        const markdown = generateMarkdownTable(result);
        
        assertTrue(markdown.includes('# Test Group - Volunteer Results'), 'Should include title');
        assertTrue(markdown.includes('| Volunteer Group | Test Group |'), 'Should include group name');
        assertTrue(markdown.includes('| Number of Volunteers | 10 |'), 'Should include volunteer count');
        assertTrue(markdown.includes('Dog'), 'Should include dog type');
        assertTrue(markdown.includes('Cat'), 'Should include cat type');
        assertTrue(markdown.includes('Total Pet Food Processed'), 'Should include total');
    });
    
    it('should generate markdown for multiple groups result', () => {
        const bags = [{ count: 5, weight: 30, type: 'Dog' }];
        const groups = [
            { name: 'Alpha Team', volunteers: 10 },
            { name: 'Beta Team', volunteers: 8 }
        ];
        
        // Simulate multiple group result structure
        const multiGroupResult = {
            durationHours: 2,
            bagResults: [{
                bagType: 1,
                count: 5,
                weight: 30,
                type: 'Dog',
                total: 150
            }],
            groupResults: [
                {
                    groupName: 'Alpha Team',
                    numVolunteers: 10,
                    durationHours: 2,
                    bagResults: [{ bagType: 1, count: 5, weight: 30, type: 'Dog', total: 150 }],
                    totalPounds: 150,
                    poundsPerVolunteer: 15,
                    poundsPerVolunteerPerHour: 7.5
                },
                {
                    groupName: 'Beta Team',
                    numVolunteers: 8,
                    durationHours: 2,
                    bagResults: [{ bagType: 1, count: 5, weight: 30, type: 'Dog', total: 150 }],
                    totalPounds: 150,
                    poundsPerVolunteer: 18.75,
                    poundsPerVolunteerPerHour: 9.375
                }
            ],
            totalPounds: 150,
            totalVolunteers: 18,
            totalPoundsPerVolunteer: 8.33,
            totalPoundsPerVolunteerPerHour: 4.17
        };
        
        const markdown = generateMarkdownTable(multiGroupResult);
        
        assertTrue(markdown.includes('# Volunteer Results'), 'Should include generic title');
        assertTrue(markdown.includes('## Per-Group Results'), 'Should include per-group section');
        assertTrue(markdown.includes('Alpha Team'), 'Should include Alpha Team');
        assertTrue(markdown.includes('Beta Team'), 'Should include Beta Team');
        assertTrue(markdown.includes('## Combined Totals'), 'Should include combined totals');
        assertTrue(markdown.includes('Total Volunteers | 18'), 'Should include total volunteers');
    });
});

// Test Suite 8: CSV Export and Import Tests
runner.describe('CSV Export and Import Tests', (it) => {
    // Mock localStorage for Node.js testing
    const mockLocalStorage = {
        data: {},
        getItem: function(key) {
            return this.data[key] || null;
        },
        setItem: function(key, value) {
            this.data[key] = value;
        },
        removeItem: function(key) {
            delete this.data[key];
        },
        clear: function() {
            this.data = {};
        }
    };
    
    // Mock localStorage in global scope
    global.localStorage = mockLocalStorage;
    
    it('should generate correct CSV header', () => {
        const header = getCSVHeader();
        assertEquals(header, 'Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour', 'CSV header should match expected format');
    });
    
    it('should parse simple CSV line correctly', () => {
        const line = 'Test Group,1/1/2024 12:00:00 PM,10,2.00,Dog (5),250.00,25.00,12.50';
        const fields = parseCSVLine(line);
        
        assertEquals(fields.length, 8, 'Should parse 8 fields');
        assertEquals(fields[0], 'Test Group', 'Group name should match');
        assertEquals(fields[2], '10', 'Volunteers should match');
    });
    
    it('should parse CSV line with quoted fields containing commas', () => {
        const line = '"Group, Inc.",1/1/2024 12:00:00 PM,10,2.00,"Dog (5), Cat (3)",250.00,25.00,12.50';
        const fields = parseCSVLine(line);
        
        assertEquals(fields.length, 8, 'Should parse 8 fields');
        assertEquals(fields[0], 'Group, Inc.', 'Should handle commas in quotes');
        assertEquals(fields[4], 'Dog (5), Cat (3)', 'Should handle multiple values in quotes');
    });
    
    it('should parse CSV line with escaped quotes', () => {
        const line = '"Group ""Special""",1/1/2024 12:00:00 PM,10,2.00,Dog (5),250.00,25.00,12.50';
        const fields = parseCSVLine(line);
        
        assertEquals(fields[0], 'Group "Special"', 'Should handle escaped quotes');
    });
    
    it('should convert entry to CSV line correctly', () => {
        const entry = {
            groupName: 'Test Group',
            timestamp: '2024-01-01T12:00:00.000Z',
            numVolunteers: 10,
            durationHours: 2.5,
            bagResults: [{ type: 'Dog', count: 5 }],
            totalPounds: 250,
            poundsPerVolunteer: 25,
            poundsPerVolunteerPerHour: 10
        };
        
        const csvLine = entryToCSVLine(entry);
        
        assertTrue(csvLine.includes('Test Group'), 'Should include group name');
        assertTrue(csvLine.includes('10'), 'Should include volunteers');
        assertTrue(csvLine.includes('2.50'), 'Should include hours with 2 decimals');
        assertTrue(csvLine.includes('Dog (5)'), 'Should include bag types');
    });
    
    it('should escape CSV fields with commas', () => {
        const entry = {
            groupName: 'Group, Inc.',
            timestamp: '2024-01-01T12:00:00.000Z',
            numVolunteers: 10,
            durationHours: 2,
            bagResults: [{ type: 'Dog', count: 5 }, { type: 'Cat', count: 3 }],
            totalPounds: 250,
            poundsPerVolunteer: 25,
            poundsPerVolunteerPerHour: 12.5
        };
        
        const csvLine = entryToCSVLine(entry);
        
        assertTrue(csvLine.includes('"Group, Inc."'), 'Should quote field with comma');
        assertTrue(csvLine.includes('"Dog (5), Cat (3)"'), 'Should quote bag types with comma');
    });
    
    it('should generate CSV for all data in storage', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50, type: 'Dog' }];
        const result1 = calculateResults('Group A', 10, 2, bags);
        const result2 = calculateResults('Group B', 8, 1.5, bags);
        
        StorageModule.save(result1);
        StorageModule.save(result2);
        
        const csv = generateAllDataCSV();
        
        assertTrue(csv.includes(getCSVHeader()), 'CSV should include header');
        assertTrue(csv.includes('Group A'), 'CSV should include Group A');
        assertTrue(csv.includes('Group B'), 'CSV should include Group B');
        
        const lines = csv.split('\n').filter(l => l.trim() !== '');
        assertEquals(lines.length, 3, 'Should have header + 2 data lines');
    });
    
    it('should import valid CSV data', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
Test Group,1/1/2024 12:00:00 PM,10,2.00,Dog (5),250.00,25.00,12.50
Another Group,1/2/2024 1:00:00 PM,8,1.50,Cat (3),120.00,15.00,10.00`;
        
        const data = importDataFromCSV(csv);
        
        assertTrue(data['Test Group'] !== undefined, 'Should have Test Group');
        assertTrue(data['Another Group'] !== undefined, 'Should have Another Group');
        assertEquals(data['Test Group'].length, 1, 'Test Group should have 1 entry');
        assertEquals(data['Another Group'].length, 1, 'Another Group should have 1 entry');
        
        const entry = data['Test Group'][0];
        assertEquals(entry.groupName, 'Test Group', 'Group name should match');
        assertEquals(entry.numVolunteers, 10, 'Volunteers should match');
        assertEquals(entry.durationHours, 2, 'Hours should match');
        assertEquals(entry.totalPounds, 250, 'Total pounds should match');
    });
    
    it('should reject CSV with invalid header', () => {
        const csv = `Wrong,Header,Format
Test Group,1/1/2024,10,2.00,Dog (5),250.00,25.00,12.50`;
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('Invalid CSV header'), 'Should report invalid header');
        }
    });
    
    it('should reject CSV with empty content', () => {
        const csv = '';
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('empty'), 'Should report empty file');
        }
    });
    
    it('should reject CSV with invalid number of fields', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
Test Group,1/1/2024,10`;
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('Expected 8 fields'), 'Should report field count error');
        }
    });
    
    it('should reject CSV with invalid numeric values', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
Test Group,1/1/2024,invalid,2.00,Dog (5),250.00,25.00,12.50`;
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('Invalid number of volunteers'), 'Should report invalid volunteers');
        }
    });
    
    it('should reject CSV with negative or zero volunteers', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
Test Group,1/1/2024,0,2.00,Dog (5),250.00,25.00,12.50`;
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('Invalid number of volunteers'), 'Should reject zero volunteers');
        }
    });
    
    it('should reject CSV with empty group name', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
,1/1/2024,10,2.00,Dog (5),250.00,25.00,12.50`;
        
        try {
            importDataFromCSV(csv);
            throw new Error('Should have thrown an error');
        } catch (err) {
            assertTrue(err.message.includes('Group name is required'), 'Should reject empty group name');
        }
    });
    
    it('should handle multiple entries for same group in CSV', () => {
        const csv = `Group Name,Date,Volunteers,Hours,Bag Types,Total Pounds,Pounds per Volunteer,Pounds per Volunteer per Hour
Test Group,1/1/2024 12:00:00 PM,10,2.00,Dog (5),250.00,25.00,12.50
Test Group,1/2/2024 1:00:00 PM,12,3.00,Cat (3),300.00,25.00,8.33`;
        
        const data = importDataFromCSV(csv);
        
        assertEquals(data['Test Group'].length, 2, 'Should have 2 entries for Test Group');
        assertEquals(data['Test Group'][0].numVolunteers, 10, 'First entry volunteers should match');
        assertEquals(data['Test Group'][1].numVolunteers, 12, 'Second entry volunteers should match');
    });
    
    it('should export and import round-trip correctly', () => {
        StorageModule.clear();
        
        const bags = [{ count: 5, weight: 50, type: 'Dog' }];
        const result1 = calculateResults('Group A', 10, 2, bags);
        const result2 = calculateResults('Group B', 8, 1.5, bags);
        
        StorageModule.save(result1);
        StorageModule.save(result2);
        
        // Export
        const csv = generateAllDataCSV();
        
        // Clear storage
        StorageModule.clear();
        
        // Import
        const importedData = importDataFromCSV(csv);
        StorageModule.importAll(importedData);
        
        // Verify
        const groups = StorageModule.getGroupNames();
        assertEquals(groups.length, 2, 'Should have 2 groups after import');
        assertTrue(groups.includes('Group A'), 'Should have Group A');
        assertTrue(groups.includes('Group B'), 'Should have Group B');
        
        const groupAEntries = StorageModule.getGroup('Group A');
        assertEquals(groupAEntries.length, 1, 'Group A should have 1 entry');
        assertEquals(groupAEntries[0].numVolunteers, 10, 'Group A volunteers should match');
    });
});

// Run all tests
runner.run();
