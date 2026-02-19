# 🧮 Calculation Algorithms

[← Back to Documentation Hub](README.md)

This document provides an in-depth explanation of all calculation formulas, algorithms, and data processing used in the Volunteer Calculator.

## Overview

The calculator performs five main calculations:
1. Time conversion (minutes → hours)
2. Bag type totals (count × weight)
3. Total pounds (sum of all bag totals)
4. Pounds per volunteer (total ÷ volunteers)
5. Pounds per volunteer per hour (per volunteer ÷ hours)

## Time Conversion Algorithm

### Purpose
Convert user input from minutes or hours into a standardized hours format for calculations.

### Formula
```
IF unit = "minutes" THEN
    hours = duration / 60
ELSE
    hours = duration
END IF
```

### Implementation
```javascript
function convertToHours(duration, unit) {
    if (unit === 'minutes') {
        return duration / 60;
    }
    return duration;
}
```

### Examples

| Input Duration | Input Unit | Output (Hours) | Calculation |
|----------------|------------|----------------|-------------|
| 30 | minutes | 0.5 | 30 ÷ 60 = 0.5 |
| 90 | minutes | 1.5 | 90 ÷ 60 = 1.5 |
| 2.5 | hours | 2.5 | 2.5 (no conversion) |
| 120 | minutes | 2.0 | 120 ÷ 60 = 2.0 |
| 0.5 | hours | 0.5 | 0.5 (no conversion) |

### Edge Cases
- **Zero duration**: Returns 0 (valid input)
- **Negative duration**: Should be prevented by HTML validation (min="0")
- **Decimal minutes**: Supported (e.g., 30.5 minutes = 0.508333... hours)

## Bag Calculations

### Bag Type Total

Calculates the total pounds for a single bag type.

**Formula:**
```
total = numberOfBags × poundsPerBag
```

**Example:**
```
20 bags × 25 lbs/bag = 500 lbs
```

### Multiple Bag Types

**Process:**
1. For each bag type `i`, calculate: `total_i = count_i × weight_i`
2. Store each result in the `bagResults` array

**Example:**
```javascript
Bag Type 1: 20 × 25 = 500 lbs
Bag Type 2: 15 × 50 = 750 lbs
Bag Type 3: 10 × 40 = 400 lbs
```

## Total Pounds Calculation

Sums all bag type totals to get the overall pounds processed.

### Formula
```
totalPounds = Σ(total_i) for all bag types i
```

### Mathematical Notation
```
totalPounds = total_1 + total_2 + total_3 + ... + total_n
```

### Implementation
```javascript
let totalPounds = 0;
bags.forEach((bag, index) => {
    const bagTotal = bag.count * bag.weight;
    totalPounds += bagTotal;
    bagResults.push({
        bagType: index + 1,
        count: bag.count,
        weight: bag.weight,
        total: bagTotal
    });
});
```

### Example
```
Bag Type 1: 500 lbs
Bag Type 2: 750 lbs
Bag Type 3: 400 lbs
-----------------------
Total: 1,650 lbs
```

## Per Volunteer Calculation

Calculates how many pounds each volunteer processed on average.

### Formula
```
poundsPerVolunteer = totalPounds ÷ numberOfVolunteers
```

### Example
```
Total: 1,650 lbs
Volunteers: 8
-----------------------
Per Volunteer: 1,650 ÷ 8 = 206.25 lbs
```

### Edge Cases
- **Single volunteer**: Works correctly (total ÷ 1 = total)
- **Zero volunteers**: Should be prevented by HTML validation (min="1")

## Per Volunteer Per Hour Calculation

Calculates the productivity rate: pounds processed per volunteer per hour.

### Formula
```
poundsPerVolunteerPerHour = poundsPerVolunteer ÷ durationHours
```

### Expanded Formula
```
poundsPerVolunteerPerHour = (totalPounds ÷ numberOfVolunteers) ÷ durationHours
```

### Example
```
Per Volunteer: 206.25 lbs
Duration: 2.5 hours
-----------------------
Per Volunteer Per Hour: 206.25 ÷ 2.5 = 82.50 lbs/hour
```

### Interpretation
This metric indicates the productivity rate:
- **Higher value**: More efficient packing
- **Lower value**: Slower packing or learning volunteers
- **Use case**: Compare teams, track improvement over time

## Complete Calculation Example

Let's walk through a complete example step-by-step.

### Input Data
```
Group Name: "Team Phoenix"
Number of Volunteers: 10
Time Volunteered: 90 minutes
Bags Processed:
  - 25 bags of 20 lbs each
  - 30 bags of 50 lbs each
  - 15 bags of 35 lbs each
```

### Step 1: Convert Time
```
duration = 90
unit = "minutes"
durationHours = 90 ÷ 60 = 1.5 hours
```

### Step 2: Calculate Each Bag Type
```
Bag Type 1: 25 × 20 = 500 lbs
Bag Type 2: 30 × 50 = 1,500 lbs
Bag Type 3: 15 × 35 = 525 lbs
```

### Step 3: Calculate Total Pounds
```
totalPounds = 500 + 1,500 + 525 = 2,525 lbs
```

### Step 4: Calculate Per Volunteer
```
poundsPerVolunteer = 2,525 ÷ 10 = 252.5 lbs
```

### Step 5: Calculate Per Volunteer Per Hour
```
poundsPerVolunteerPerHour = 252.5 ÷ 1.5 = 168.33 lbs/hour
```

### Final Results Object
```javascript
{
    groupName: "Team Phoenix",
    numVolunteers: 10,
    durationHours: 1.5,
    bagResults: [
        {
            bagType: 1,
            count: 25,
            weight: 20,
            total: 500
        },
        {
            bagType: 2,
            count: 30,
            weight: 50,
            total: 1500
        },
        {
            bagType: 3,
            count: 15,
            weight: 35,
            total: 525
        }
    ],
    totalPounds: 2525,
    poundsPerVolunteer: 252.5,
    poundsPerVolunteerPerHour: 168.33333333333334
}
```

## Precision and Rounding

### During Calculations
- **No rounding**: All intermediate calculations maintain full precision
- **JavaScript Numbers**: Uses IEEE 754 double-precision floating-point
- **Precision**: ~15-17 decimal digits

### During Display
- **Rounding to 2 decimals**: Only for display purposes
- **Method**: `toFixed(2)` for consistent formatting
- **Example**: 168.33333333 displays as "168.33"

### Why Maintain Precision?

**Benefits:**
- Accurate calculations for all use cases
- No accumulation of rounding errors
- Users can export precise data

**Example of precision importance:**
```
Without precision:
  100.00 ÷ 3 = 33.33
  33.33 × 3 = 99.99 (error: 0.01)

With precision:
  100 ÷ 3 = 33.333333...
  33.333333... × 3 = 100.0 (exact)
```

## Data Validation

### Input Validation Rules

| Field | Validation | Reason |
|-------|-----------|---------|
| Group Name | Required, non-empty | Identifies the team |
| Number of Volunteers | Integer ≥ 1 | Must have at least one volunteer |
| Duration | Number ≥ 0 | Can't have negative time |
| Bag Count | Integer ≥ 1 | Must process at least one bag |
| Bag Weight | Number > 0 | Bags must have weight |

### HTML Validation
```html
<input type="number" min="1" required>
<input type="number" min="0.01" step="0.01" required>
```

### JavaScript Validation
```javascript
if (!groupName || groupName.trim() === '') {
    throw new Error('Group name is required');
}

if (numVolunteers < 1) {
    throw new Error('Must have at least one volunteer');
}

if (bags.length === 0) {
    throw new Error('Must have at least one bag type');
}
```

## Error Handling

### Division by Zero
```javascript
// Protected by HTML validation (min="1" for volunteers)
// If somehow zero gets through:
if (numVolunteers <= 0 || durationHours <= 0) {
    throw new Error('Invalid input values');
}
```

### Invalid Numbers
```javascript
// parseFloat returns NaN for invalid input
const count = parseFloat(input.value);
if (isNaN(count) || count <= 0) {
    // Skip this bag entry
    continue;
}
```

### Empty Bags Array
```javascript
if (bags.length === 0) {
    alert('Please add at least one bag type');
    return;
}
```

## Performance Characteristics

### Time Complexity
- **Single bag type**: O(1) - constant time
- **Multiple bag types**: O(n) where n = number of bag types
- **Typical case**: n < 10, so effectively O(1)

### Space Complexity
- **Storage**: O(n) for bag results array
- **Memory usage**: Minimal (< 1KB for typical results)

### Calculation Speed
- **Typical input**: < 1 millisecond
- **Large input** (100 bag types): < 5 milliseconds
- **Bottleneck**: DOM updates, not calculations

## Algorithm Optimizations

### Current Implementation
```javascript
// Simple, readable, fast enough
let total = 0;
bags.forEach(bag => {
    total += bag.count * bag.weight;
});
```

### Alternative (Functional)
```javascript
// More functional, same performance
const total = bags.reduce((sum, bag) => 
    sum + (bag.count * bag.weight), 0
);
```

### Why Simple?
- **Readability**: Easy to understand
- **Maintainability**: Easy to modify
- **Performance**: Already instant for typical use
- **No need**: Premature optimization

## Testing the Algorithms

All calculations are thoroughly tested with 31 test cases covering:

### Test Categories
1. **Time Conversion** (6 tests)
   - Hours to hours
   - Minutes to hours
   - Decimal values
   - Edge cases

2. **Basic Calculations** (6 tests)
   - Single bag type
   - Multiple bag types
   - Decimal weights
   - Fractional hours

3. **Precision Tests** (5 tests)
   - Floating point accuracy
   - Rounding behavior
   - Large numbers
   - Small numbers

4. **Edge Cases** (5 tests)
   - Single volunteer
   - Small durations
   - Large numbers
   - Many bag types

See [testing.md](testing.md) for complete test documentation.

---

[← Back to Documentation Hub](README.md) | [Next: Testing →](testing.md)
