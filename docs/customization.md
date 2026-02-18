# 🎨 Customization Guide

[← Back to Documentation Hub](index.md)

This guide helps you customize the Volunteer Calculator for your specific needs, organization branding, or unique requirements.

## Quick Customization Checklist

- [ ] Change colors and branding
- [ ] Modify text and labels
- [ ] Add organization logo
- [ ] Customize units of measurement
- [ ] Add additional fields
- [ ] Modify calculations
- [ ] Change export format

## Changing Colors and Branding

### Color Scheme

The main colors are defined in `styles.css`. Search for these hex values and replace them:

| Element | Current Color | CSS Location |
|---------|--------------|--------------|
| Primary purple-blue | `#667eea` | Multiple locations |
| Secondary purple | `#764ba2` | Multiple locations |
| Success green | `#28a745` | Button backgrounds |
| Danger red | `#dc3545` | Remove buttons |

**Example: Change to blue theme**
```css
/* Find and replace in styles.css */
/* Old */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* New (blue theme) */
background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
```

**Recommended changes for consistency:**
1. Background gradient (body)
2. Button backgrounds (.btn-primary)
3. Hover effects
4. Form section backgrounds

### Adding a Logo

Add your organization logo to the header:

**In `index.html`:**
```html
<header>
    <img src="your-logo.png" alt="Your Organization" style="height: 50px; margin-bottom: 1rem;">
    <h1>🐾 Volunteer Calculator</h1>
    <p class="subtitle">Calculate pet food packing volunteer effort</p>
</header>
```

**Best practices:**
- Use PNG or SVG for transparency
- Keep file size < 50KB
- Optimize for retina displays (2x resolution)
- Use appropriate alt text

## Changing Text and Labels

### Page Title and Subtitle

**In `index.html`:**
```html
<!-- Change page title -->
<title>Your Organization - Volunteer Calculator</title>

<!-- Change header -->
<h1>Your Organization Volunteer Tracker</h1>
<p class="subtitle">Your custom subtitle here</p>
```

### Form Labels

**In `index.html`, find and modify labels:**
```html
<!-- Original -->
<label for="groupName">Name of Volunteer Group:</label>

<!-- Customized -->
<label for="groupName">Team Name:</label>
<label for="numVolunteers">Number of Packers:</label>
<label for="duration">Shift Duration:</label>
```

### Button Text

```html
<!-- Original -->
<button type="submit" id="calculateBtn" class="btn-primary">Calculate</button>

<!-- Customized -->
<button type="submit" id="calculateBtn" class="btn-primary">Calculate Results</button>
<button type="button" id="copyBtn" class="btn-primary">📊 Export Data</button>
```

## Adding Custom Fields

### Example: Add "Event Date" Field

**1. Add to HTML (`index.html`):**
```html
<div class="form-group">
    <label for="eventDate">Event Date:</label>
    <input type="date" id="eventDate" name="eventDate" required>
</div>
```

**2. Capture in calculation (`calculator.js`):**
```javascript
// In handleCalculate() function, add:
const eventDate = document.getElementById('eventDate').value;

// Pass to calculateResults:
const results = calculateResults(groupName, numVolunteers, durationHours, bags, eventDate);
```

**3. Store in results object:**
```javascript
// In calculateResults() function, add:
return {
    eventDate: eventDate,
    groupName: groupName,
    // ... rest of results
};
```

**4. Display in results:**
```javascript
// In displayResults() function, add:
resultsHTML += `
    <div class="result-item">
        <span class="result-label">Event Date:</span>
        <span class="result-value">${results.eventDate}</span>
    </div>
`;
```

**5. Include in markdown export:**
```javascript
// In generateMarkdownTable() function, add:
markdown += `| Event Date | ${results.eventDate} |\n`;
```

## Changing Units of Measurement

### Example: Add Kilogram Support

**1. Add unit selector (`index.html`):**
```html
<div class="form-group">
    <label for="bagWeight0">Weight per Bag:</label>
    <div class="duration-input">
        <input type="number" class="bag-weight" id="bagWeight0" min="0.01" step="0.01" required>
        <select id="weightUnit0" class="weight-unit">
            <option value="lbs">Pounds</option>
            <option value="kg">Kilograms</option>
        </select>
    </div>
</div>
```

**2. Add conversion function (`calculator.js`):**
```javascript
function convertToPounds(weight, unit) {
    if (unit === 'kg') {
        return weight * 2.20462; // kg to lbs conversion
    }
    return weight;
}
```

**3. Use in calculations:**
```javascript
const weightUnit = document.getElementById(`weightUnit${index}`).value;
const weightInPounds = convertToPounds(weight, weightUnit);
```

## Customizing Calculations

### Example: Add "Bags Per Volunteer" Metric

**In `calculator.js`, modify `calculateResults()`:**
```javascript
// Calculate total bags
let totalBags = 0;
bags.forEach(bag => {
    totalBags += bag.count;
});

// Add to results object
return {
    // ... existing results
    totalBags: totalBags,
    bagsPerVolunteer: totalBags / numVolunteers,
    bagsPerVolunteerPerHour: (totalBags / numVolunteers) / durationHours
};
```

**Display the new metrics:**
```javascript
resultsHTML += `
    <div class="result-item">
        <span class="result-label">Total Bags:</span>
        <span class="result-value">${results.totalBags.toFixed(0)}</span>
    </div>
    <div class="result-item">
        <span class="result-label">Bags Per Volunteer:</span>
        <span class="result-value">${results.bagsPerVolunteer.toFixed(2)}</span>
    </div>
`;
```

## Modifying the Export Format

### Example: Add CSV Export

**Add button (`index.html`):**
```html
<button type="button" id="csvBtn" class="btn-secondary">📊 Download as CSV</button>
```

**Add function (`calculator.js`):**
```javascript
function generateCSV(results) {
    let csv = 'Metric,Value\n';
    csv += `Group Name,${results.groupName}\n`;
    csv += `Number of Volunteers,${results.numVolunteers}\n`;
    csv += `Duration (hours),${results.durationHours.toFixed(2)}\n`;
    csv += `\nBag Type,Count,Weight,Total\n`;
    
    results.bagResults.forEach(bag => {
        csv += `${bag.bagType},${bag.count},${bag.weight},${bag.total}\n`;
    });
    
    csv += `\nTotal Pounds,${results.totalPounds.toFixed(2)}\n`;
    csv += `Per Volunteer,${results.poundsPerVolunteer.toFixed(2)}\n`;
    csv += `Per Volunteer Per Hour,${results.poundsPerVolunteerPerHour.toFixed(2)}\n`;
    
    return csv;
}

function downloadCSV() {
    const csv = generateCSV(window.calculationResults);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer-results-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Add event listener
document.getElementById('csvBtn').addEventListener('click', downloadCSV);
```

## Advanced Customizations

### Add Data Persistence with LocalStorage

**Save calculations:**
```javascript
function saveCalculation(results) {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    history.push({
        timestamp: new Date().toISOString(),
        results: results
    });
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}
```

**Load history:**
```javascript
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    return history;
}
```

### Add Print Functionality

**Add print button:**
```html
<button type="button" id="printBtn" class="btn-secondary">🖨️ Print Results</button>
```

**Add print styles (`styles.css`):**
```css
@media print {
    header, footer, .form-section, #calculateBtn, #resetBtn, #copyBtn {
        display: none;
    }
    
    .results-section {
        display: block !important;
        page-break-inside: avoid;
    }
    
    body {
        background: white;
    }
}
```

**Add print handler:**
```javascript
document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});
```

### Create Custom Themes

**Define CSS custom properties:**
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --background-start: #667eea;
    --background-end: #764ba2;
}

/* Use throughout CSS */
.btn-primary {
    background: linear-gradient(135deg, var(--background-start), var(--background-end));
}
```

**Add theme switcher:**
```javascript
function applyTheme(theme) {
    const themes = {
        purple: {
            '--primary-color': '#667eea',
            '--secondary-color': '#764ba2'
        },
        blue: {
            '--primary-color': '#3498db',
            '--secondary-color': '#2980b9'
        },
        green: {
            '--primary-color': '#27ae60',
            '--secondary-color': '#229954'
        }
    };
    
    const root = document.documentElement;
    Object.entries(themes[theme]).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
    });
}
```

## Testing Your Customizations

### Checklist
- [ ] All form inputs still work
- [ ] Calculations are still accurate
- [ ] Results display correctly
- [ ] Export/copy functionality works
- [ ] Responsive design maintained
- [ ] No JavaScript errors in console
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Verify with actual users

### Run Tests
```bash
npm test
```

Ensure all tests still pass after customizations.

## Common Pitfalls

### 1. Breaking Calculations
**Problem:** Modified calculation logic incorrectly
**Solution:** Keep existing calculation tests passing

### 2. ID Conflicts
**Problem:** Duplicate element IDs after adding fields
**Solution:** Use unique IDs with consistent naming pattern

### 3. Responsive Layout Breaks
**Problem:** Custom CSS breaks mobile layout
**Solution:** Test at multiple screen sizes, use media queries

### 4. Accessibility Issues
**Problem:** Removed labels or semantic HTML
**Solution:** Maintain proper labels and ARIA attributes

## Getting Help

If you need help with customizations:

1. **Check Examples**: Review the examples in this guide
2. **Browser DevTools**: Inspect elements to understand structure
3. **Test Incrementally**: Make small changes and test each
4. **Ask Questions**: Open a discussion on GitHub
5. **Share Back**: If you create a useful customization, consider contributing it

---

[← Back to Documentation Hub](index.md) | [Next: Future Enhancements →](future-enhancements.md)
