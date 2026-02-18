# 💻 Core Components

[← Back to Documentation Hub](index.md)

This document provides detailed documentation of the main application components: HTML structure, CSS styling, and JavaScript logic.

## index.html - Application Structure

The main HTML file provides the structure of the application with semantic markup and accessibility features.

### Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags, title, and stylesheet -->
</head>
<body>
    <div class="container">
        <header>...</header>
        <main>
            <form>...</form>
            <section id="resultsSection">...</section>
        </main>
        <footer>...</footer>
    </div>
    <script src="calculator.js"></script>
</body>
</html>
```

### Key Sections

#### Header Section
```html
<header>
    <h1>🐾 Volunteer Calculator</h1>
    <p class="subtitle">Calculate pet food packing volunteer effort</p>
</header>
```

**Purpose**: Branding and application title with emoji for visual appeal.

#### Form Section - Volunteer Information
```html
<section class="form-section">
    <h2>Volunteer Information</h2>
    <div class="form-group">
        <label for="groupName">Name of Volunteer Group:</label>
        <input type="text" id="groupName" name="groupName" required>
    </div>
    <!-- Additional form fields -->
</section>
```

**Form Inputs:**

| Input ID | Type | Validation | Purpose |
|----------|------|------------|---------|
| `groupName` | text | required | Name of the volunteer group |
| `numVolunteers` | number | min="1", required | Number of volunteers |
| `duration` | number | min="0", step="0.01", required | Time duration |
| `timeUnit` | select | - | Hours or Minutes |

**Special Features:**
- HTML5 validation attributes
- Accessible labels
- Semantic grouping with `<section>` and `<fieldset>`

#### Form Section - Bags Processed
```html
<section class="form-section">
    <h2>Bags Processed</h2>
    <div id="bagsList">
        <div class="bag-entry" data-bag-index="0">
            <!-- Bag fields -->
        </div>
    </div>
    <button type="button" id="addBagBtn">+ Add Another Bag Type</button>
</section>
```

**Dynamic Bag Entries:**

Each bag entry has:
- `data-bag-index`: Unique identifier for the bag entry
- `bagCount[n]`: Number of bags input
- `bagWeight[n]`: Pounds per bag input
- `bagType[n]`: Radio buttons for animal type (Dog/Cat/Other)
- `bagTypeOther[n]`: Optional text field for custom animal type (shown when "Other" is selected)
- Remove button (× symbol) for entries after the first

**Bag Type Selection:**
- Dog (default)
- Cat
- Other (shows custom text input field)
- Custom field placeholder: "Specify type (e.g., Bird)"
- If Other is selected with empty custom field, defaults to "Other"

**Why Dynamic?**
- Users can process any number of different bag sizes
- Each entry is independent
- Easy to add/remove without page refresh

#### Results Section
```html
<section id="resultsSection" class="results-section" style="display: none;">
    <h2>Results</h2>
    <div id="resultsContent"></div>
    <button type="button" id="copyBtn">📋 Copy Results as Markdown Table</button>
    <div id="copyFeedback" style="display: none;">Copied to clipboard!</div>
</section>
```

**Features:**
- Initially hidden (`display: none`)
- Dynamically populated with results
- Copy-to-clipboard button
- Visual feedback when copied

#### Footer Section
```html
<footer>
    <p>
        <a href="https://github.com/AvinZarlez/volunteer-calculator">View on GitHub</a> | 
        <a href="https://github.com/AvinZarlez/volunteer-calculator/tree/main/docs">Technical Documentation</a>
    </p>
</footer>
```

**Links:**
- GitHub repository link
- Technical documentation link

## styles.css - Styling and Design

Modern CSS3 with responsive design principles and smooth animations.

### Color Scheme

```css
/* Primary colors */
--primary: #667eea;
--secondary: #764ba2;
--success: #28a745;
--danger: #dc3545;

/* Gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Color Psychology:**
- Purple gradient: Professional, creative, trustworthy
- Green buttons: Positive action, success
- Red remove buttons: Caution, removal action

### Layout System

#### Container Layout
```css
.container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
}
```

**Responsive:**
- Max width for readability
- Centered on page
- Padding for mobile devices

#### Grid System for Bag Entries
```css
.bag-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

@media (max-width: 600px) {
    .bag-fields {
        grid-template-columns: 1fr;
    }
}
```

**Why Grid?**
- Two columns on desktop for compact layout
- Single column on mobile for readability
- Automatic responsive behavior

#### Flexbox for Buttons
```css
.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 600px) {
    .form-actions {
        flex-direction: column;
    }
}
```

### Key CSS Classes

#### `.btn-primary` - Primary Action Button
```css
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

**Features:**
- Gradient background matching theme
- Hover animation (lifts up)
- Shadow on hover for depth
- Smooth transitions

#### `.btn-secondary` - Secondary Actions
```css
.btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
}
```

**Use cases:**
- Reset button
- Add bag button
- Non-primary actions

#### `.form-group` - Input Grouping
```css
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}
```

**Purpose:**
- Consistent spacing
- Label above input (mobile-friendly)
- Clear visual hierarchy

#### `.result-item` - Result Display
```css
.result-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
}
```

**Features:**
- Flexbox for label/value alignment
- Subtle background for separation
- Padding for touch targets

### Animations

#### Button Hover Animation
```css
transition: transform 0.2s ease, box-shadow 0.2s ease;
transform: translateY(-2px);
```

**Effect**: Buttons lift up on hover, creating depth

#### Copy Feedback Animation
```css
@keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

.copy-feedback {
    animation: fadeInOut 2s;
}
```

**Effect**: "Copied!" message fades in and out smoothly

### Responsive Design

#### Breakpoints

| Breakpoint | Screen Size | Changes |
|------------|-------------|---------|
| Mobile | < 600px | Single column layout, stacked buttons |
| Tablet | 600-900px | Two column forms, side-by-side buttons |
| Desktop | > 900px | Full layout with max-width constraint |

#### Mobile-First Approach
```css
/* Mobile styles first */
.container {
    padding: 1rem;
}

/* Then enhance for larger screens */
@media (min-width: 600px) {
    .container {
        padding: 2rem;
    }
}
```

## calculator.js - Business Logic

Core JavaScript logic for calculations and interactions.

### State Management

```javascript
// Global state variables
let bagCounter = 1;  // Tracks bag entry IDs
window.calculationResults = null;  // Stores last calculation
```

**Why global?**
- Simple state for a simple app
- Easy to access from event handlers
- No framework overhead

### Key Functions

#### `convertToHours(duration, unit)`

Converts time input to hours for consistent calculations.

**Parameters:**
- `duration` (number): Time value
- `unit` (string): 'hours' or 'minutes'

**Returns:** (number) Time in hours

**Implementation:**
```javascript
function convertToHours(duration, unit) {
    if (unit === 'minutes') {
        return duration / 60;
    }
    return duration;
}
```

**Example:**
```javascript
convertToHours(30, 'minutes')  // → 0.5
convertToHours(2.5, 'hours')   // → 2.5
```

#### `getBagData()`

Extracts bag data from all bag entry forms.

**Returns:** Array of objects `[{count: number, weight: number}, ...]`

**Implementation:**
```javascript
function getBagData() {
    const bagEntries = document.querySelectorAll('.bag-entry');
    const bags = [];
    
    bagEntries.forEach(entry => {
        const index = entry.dataset.bagIndex;
        const count = parseFloat(document.getElementById(`bagCount${index}`).value);
        const weight = parseFloat(document.getElementById(`bagWeight${index}`).value);
        
        if (count > 0 && weight > 0) {
            bags.push({ count, weight });
        }
    });
    
    return bags;
}
```

**Validation:**
- Only includes entries with positive values
- Uses `parseFloat` for decimal support
- Returns empty array if no valid entries

#### `calculateResults(groupName, numVolunteers, durationHours, bags)`

Performs all calculations based on inputs.

**Parameters:**
- `groupName` (string): Name of volunteer group
- `numVolunteers` (number): Number of volunteers
- `durationHours` (number): Duration in hours
- `bags` (array): Array of bag objects

**Returns:** Results object

**Results Object Structure:**
```javascript
{
    groupName: "Team Alpha",
    numVolunteers: 8,
    durationHours: 2.5,
    bagResults: [
        {
            bagType: 1,
            count: 20,
            weight: 25,
            total: 500
        },
        {
            bagType: 2,
            count: 15,
            weight: 50,
            total: 750
        }
    ],
    totalPounds: 1250,
    poundsPerVolunteer: 156.25,
    poundsPerVolunteerPerHour: 62.5
}
```

**Calculation Steps:**
1. Calculate each bag type total: `count × weight`
2. Sum all bag totals: `totalPounds`
3. Calculate per volunteer: `totalPounds ÷ numVolunteers`
4. Calculate per volunteer per hour: `poundsPerVolunteer ÷ durationHours`

**Precision:**
- No rounding during calculations
- Only display formatting rounds to 2 decimal places
- Maintains accuracy for all intermediate calculations

#### `generateMarkdownTable(results)`

Generates a markdown-formatted table with all data.

**Parameters:**
- `results` (object): Calculation results object

**Returns:** (string) Markdown text

**Output Example:**
```markdown
# Team Alpha - Volunteer Results

## Input Data
| Metric | Value |
|--------|-------|
| Number of Volunteers | 8 |
| Time Volunteered | 2.50 hours |

## Bags Processed
| Bag Type | Number of Bags | Pounds per Bag | Total Pounds |
|----------|----------------|----------------|--------------|
| Bag Type 1 | 20 | 25.00 | 500.00 |
| Bag Type 2 | 15 | 50.00 | 750.00 |

## Summary Results
| Metric | Value |
|--------|-------|
| Total Pet Food Processed | 1,250.00 lbs |
| Per Volunteer | 156.25 lbs |
| Per Volunteer Per Hour | 62.50 lbs/hour |
```

#### `addBagEntry()`

Dynamically adds a new bag type entry to the form.

**Implementation:**
```javascript
function addBagEntry() {
    const bagsList = document.getElementById('bagsList');
    const newIndex = bagCounter;
    
    const bagEntry = document.createElement('div');
    bagEntry.className = 'bag-entry';
    bagEntry.setAttribute('data-bag-index', newIndex);
    bagEntry.innerHTML = `
        <div class="bag-fields">
            <div class="form-group">
                <label for="bagCount${newIndex}">Number of Bags:</label>
                <input type="number" class="bag-count" id="bagCount${newIndex}" min="1" required>
            </div>
            <div class="form-group">
                <label for="bagWeight${newIndex}">Pounds per Bag:</label>
                <input type="number" class="bag-weight" id="bagWeight${newIndex}" min="0.01" step="0.01" required>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeBagEntry(${newIndex})">× Remove</button>
    `;
    
    bagsList.appendChild(bagEntry);
    bagCounter++;
}
```

**Features:**
- Unique IDs for each input
- Remove button for each entry (except first)
- Increments counter for next entry
- Maintains consistency with existing entries

#### `removeBagEntry(index)`

Removes a specific bag entry from the form.

**Parameters:**
- `index` (number): The bag index to remove

**Implementation:**
```javascript
function removeBagEntry(index) {
    const entry = document.querySelector(`[data-bag-index="${index}"]`);
    if (entry) {
        entry.remove();
    }
}
```

**Note:** The first bag entry (index 0) has no remove button and cannot be removed.

### Event Handlers

#### Form Submission
```javascript
document.getElementById('volunteerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleCalculate();
});
```

**Process:**
1. Prevent default form submission
2. Extract form values
3. Validate inputs
4. Perform calculations
5. Display results
6. Scroll to results

#### Copy Button
```javascript
document.getElementById('copyBtn').addEventListener('click', async () => {
    const markdown = generateMarkdownTable(window.calculationResults);
    
    try {
        await navigator.clipboard.writeText(markdown);
        showCopyFeedback();
    } catch (err) {
        // Fallback for older browsers
        fallbackCopy(markdown);
    }
});
```

**Features:**
- Modern Clipboard API
- Fallback for older browsers
- Visual feedback on success
- Error handling

#### Reset Button
```javascript
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('volunteerForm').reset();
    document.getElementById('resultsSection').style.display = 'none';
    window.calculationResults = null;
});
```

**Actions:**
- Clears all form fields
- Hides results section
- Clears stored calculation results

---

[← Back to Documentation Hub](index.md) | [Next: Calculations →](calculations.md)
