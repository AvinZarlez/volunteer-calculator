# 💻 Core Components

[← Back to Documentation Hub](README.md)

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
        <nav class="tab-navigation">
            <!-- Calculator and Data Viewer tabs -->
        </nav>
        <main>
            <!-- Calculator View -->
            <div id="calculatorView">
                <form>...</form>
                <section id="resultsSection">...</section>
            </div>
            <!-- Data Viewer -->
            <div id="dataViewerView" style="display: none;">
                ...
            </div>
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

#### Navigation Tabs
```html
<nav class="tab-navigation">
    <button class="tab-button active" data-view="calculator">Calculator</button>
    <button class="tab-button" data-view="dataViewer">Data Viewer</button>
</nav>
```

**Purpose**: Switch between Calculator and Data Viewer views. Active tab is highlighted.

#### Calculator View Container
Contains all calculator-related forms and results (shown by default).

#### Form Section - Volunteer Information
```html
<section class="form-section">
    <h2>Volunteer Information</h2>
    <div class="form-group">
        <label for="duration">Time Volunteered:</label>
        <div class="duration-input">
            <input type="number" id="duration" min="0" step="0.01" required>
            <select id="timeUnit">
                <option value="hours">Hours</option>
                <option value="minutes">Minutes</option>
            </select>
        </div>
    </div>
</section>
```

**Form Inputs:**

| Input ID | Type | Validation | Purpose |
|----------|------|------------|---------|
| `duration` | number | min="0", step="0.01", required | Time duration value |
| `timeUnit` | select | - | Hours or Minutes selector |

**Special Features:**
- Combined input with unit selector
- HTML5 validation attributes
- Accessible labels
- Semantic grouping with `<section>`

#### Form Section - Volunteer Groups
```html
<section class="form-section">
    <h2>Volunteer Groups</h2>
    <div id="groupsList">
        <div class="group-entry" data-group-index="0">
            <div class="form-group">
                <label for="groupName0">Name of Volunteer Group:</label>
                <input type="text" id="groupName0" required>
            </div>
            <div class="form-group">
                <label for="numVolunteers0">Number of Volunteers:</label>
                <input type="number" id="numVolunteers0" min="1" required>
            </div>
        </div>
    </div>
    <button type="button" id="addGroupBtn">+ Add Another Volunteer Group</button>
</section>
```

**Dynamic Group Entries:**

Each group entry has:
- `data-group-index`: Unique identifier for the group entry
- `groupName[n]`: Text input for group name
- `numVolunteers[n]`: Number input for volunteer count
- Remove button (× symbol) for entries after the first

**Why Dynamic?**
- Track multiple volunteer groups in one session
- Each group gets separate calculations
- Aggregate totals across all groups
- Easy to add/remove without page refresh

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
- Save Data button (saves to LocalStorage)
- Copy-to-clipboard buttons (Markdown and TSV formats)
- Visual feedback when saved/copied

#### Data Viewer Section

The Data Viewer is a complete separate view for managing saved calculations.

**Main Container:**
```html
<div id="dataViewerView" class="data-viewer" style="display: none;">
    <!-- Controls Section -->
    <!-- Selection Banner (shown when entries selected) -->
    <!-- Data Table -->
    <!-- Data Management (collapsible) -->
</div>
```

**Controls Section:**
```html
<div class="viewer-controls">
    <div class="form-group">
        <label for="groupSelect">Select Volunteer Group:</label>
        <select id="groupSelect">
            <option value="">-- Select a Group --</option>
            <option value="_all_groups_">All Groups</option>
            <!-- Dynamically populated -->
        </select>
    </div>
    
    <div class="form-group">
        <label for="dateFilterType">Filter by Date:</label>
        <select id="dateFilterType">
            <option value="all">All Time</option>
            <option value="year">Calendar Year</option>
            <option value="year12">Last 12 Months</option>
            <option value="custom">Custom Range</option>
        </select>
    </div>
    
    <!-- Custom date range fields (shown when Custom Range selected) -->
    <div id="customDateRange" class="custom-date-range" style="display: none;">
        <div class="form-group">
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate">
            <button type="button" class="btn-link" onclick="setToday('startDate')">Today</button>
        </div>
        <div class="form-group">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate">
            <button type="button" class="btn-link" onclick="setToday('endDate')">Today</button>
        </div>
    </div>
</div>
```

**Selection Banner:**
```html
<div id="selectionBanner" class="selection-banner" style="display: none;">
    <div class="selection-info">
        <span id="selectionCount">0</span> entries selected
    </div>
    <div class="selection-actions">
        <button type="button" class="btn-banner" onclick="selectAllEntries()">
            ✓ Select All
        </button>
        <button type="button" class="btn-banner" onclick="copySelectedEntries()">
            📋 Copy
        </button>
        <button type="button" class="btn-banner" onclick="downloadSelectedEntries()">
            💾 Download as CSV
        </button>
        <button type="button" class="btn-banner btn-danger" onclick="deleteSelectedEntries()">
            🗑️ Delete
        </button>
        <button type="button" class="btn-banner" onclick="clearSelection()">
            ✕ Cancel
        </button>
    </div>
</div>
```

**Data Table:**
```html
<div class="data-table-container">
    <table class="data-table">
        <thead>
            <tr>
                <th>
                    <input type="checkbox" id="selectAll" 
                           onchange="toggleAllCheckboxes(this.checked)">
                </th>
                <th>Date</th>
                <th>Group Name</th>
                <th>Volunteers</th>
                <th>Hours</th>
                <th>Bag Types</th>
                <th>Total Pounds</th>
                <th>Per Volunteer</th>
                <th>Per Vol/Hour</th>
            </tr>
        </thead>
        <tbody id="dataTableBody">
            <!-- Dynamically populated with entries -->
        </tbody>
    </table>
    
    <!-- Summary section -->
    <div id="dataViewerSummary" class="data-summary">
        <!-- Shows total entries, total pounds, etc. -->
    </div>
</div>
```

**Data Management Section (Collapsible):**
```html
<div class="data-management">
    <button type="button" class="btn-collapsible" onclick="toggleDataManagement()">
        Data Management ▼
    </button>
    
    <div id="dataManagementContent" style="display: none;">
        <div class="management-section">
            <h3>Export Data</h3>
            <button type="button" onclick="exportAllDataToCSV()">
                📥 Export All Data to CSV
            </button>
            <button type="button" onclick="copyAllEntriesToClipboard()">
                📋 Copy All Entries to Spreadsheet
            </button>
        </div>
        
        <div class="management-section">
            <h3>Import Data</h3>
            <input type="file" id="csvImportFile" accept=".csv">
            <button type="button" onclick="handleImportAddMode()">
                ➕ Add to Existing
            </button>
            <button type="button" onclick="handleImportReplaceMode()">
                🔄 Replace All
            </button>
        </div>
    </div>
</div>
```

**Data Viewer Features:**
- **Group Selection**: View data for specific groups or all groups
- **Date Filtering**: Filter by time period (all-time, year, last 12 months, custom range)
- **Checkbox Selection**: Select individual or all entries
- **Bulk Operations**: Copy, download, or delete multiple entries at once
- **Import/Export**: CSV format for data backup and migration
- **Summary Statistics**: Shows aggregate data for filtered entries
- **Responsive Table**: Scrolls horizontally on mobile devices

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
- Add bag/group buttons
- Non-primary actions
- Export/import actions

#### `.tab-button` - Navigation Tabs
```css
.tab-button {
    padding: 1rem 2rem;
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
}

.tab-button.active {
    border-bottom-color: white;
    font-weight: bold;
}

.tab-button:hover {
    background: rgba(255, 255, 255, 0.1);
}
```

**Features:**
- Transparent background with bottom border for active state
- Smooth transitions
- Hover effect for interactivity
- Active state clearly indicates current view

#### `.selection-banner` - Bulk Operations Control
```css
.selection-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(102, 126, 234, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

**Features:**
- Fixed to bottom of viewport (always visible when entries selected)
- Semi-transparent with backdrop blur for modern look
- High z-index to stay above content
- Flexbox layout for responsive button arrangement

#### `.data-table` - Data Viewer Table
```css
.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.data-table th {
    background: #f8f9fa;
    padding: 0.75rem;
    text-align: left;
    border-bottom: 2px solid #dee2e6;
}

.data-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #dee2e6;
}

.data-table tbody tr:hover {
    background: #f8f9fa;
}
```

**Features:**
- Clean, professional table design
- Sticky header (optional enhancement)
- Row hover for better readability
- Responsive (scrolls horizontally on mobile)

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

Core JavaScript logic for calculations, data management, and interactions. Over 1,991 lines providing comprehensive functionality.

### State Management

```javascript
// Global state variables
let bagCounter = 1;     // Tracks bag entry IDs
let groupCounter = 1;   // Tracks volunteer group IDs
window.calculationResults = null;  // Stores last calculation

// LocalStorage key
const STORAGE_KEY = 'volunteerCalculatorData';
```

**Why global?**
- Simple state for essential counters
- Easy to access from event handlers
- No framework overhead
- LocalStorage provides persistence

### Core Calculation Functions

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

#### `getGroupData()`

Extracts volunteer group data from all group entry forms (similar to getBagData).

**Returns:** Array of group objects `[{name: string, volunteers: number}, ...]`

**Features:**
- Supports multiple volunteer groups
- Validates group names and volunteer counts
- Normalizes group names (trims whitespace)

#### `calculateMultipleGroupResults(groups, durationHours, bags)`

Calculates results when multiple volunteer groups are entered.

**Parameters:**
- `groups` (array): Array of group objects from getGroupData()
- `durationHours` (number): Shared duration for all groups
- `bags` (array): Shared bag data for all groups

**Returns:** Combined results object with per-group breakdown and totals

**Features:**
- Individual calculations for each group
- Aggregated totals across all groups
- Maintains group-specific metrics

#### `saveCalculationData()`

Saves calculation results to LocalStorage.

**Implementation:**
- Generates unique entry ID (timestamp-based)
- Adds timestamp to entry
- Indexes data by volunteer group name
- Handles multiple groups (saves under each group name)
- Persists across browser sessions

**Storage Structure:**
```javascript
{
  "Team Alpha": [
    {
      id: "1234567890123",
      timestamp: "2026-02-19T12:34:56.789Z",
      groupName: "Team Alpha",
      numVolunteers: 10,
      durationHours: 2.5,
      bags: [...],
      totalPounds: 1250,
      // ... other metrics
    },
    // ... more entries
  ],
  "Team Beta": [...]
}
```

### Data Viewer Functions

#### `switchView(view)`

Switches between Calculator and Data Viewer tabs.

**Parameters:**
- `view` (string): 'calculator' or 'dataViewer'

**Actions:**
- Hides current view, shows selected view
- Updates tab button active states
- Refreshes data if switching to Data Viewer

#### `refreshGroupList()`

Populates the group selection dropdown with saved groups from LocalStorage.

**Features:**
- Loads all unique group names
- Adds "All Groups" option
- Sorts alphabetically
- Updates dropdown options

#### `loadGroupData()`

Loads and displays entries for the selected group and date filter.

**Process:**
1. Get selected group from dropdown
2. Get date filter range
3. Load entries from LocalStorage
4. Filter by date range
5. Display in table
6. Update summary statistics

#### `displayGroupEntries(groupName, entries, isAllGroups)`

Renders entries in the data viewer table.

**Parameters:**
- `groupName` (string): Name of group being displayed
- `entries` (array): Array of entry objects to display
- `isAllGroups` (boolean): Whether displaying all groups or just one

**Features:**
- Creates table rows with all entry data
- Adds checkboxes for selection
- Formats dates, numbers consistently
- Shows bag type details with animal types
- Generates summary statistics

#### `filterEntriesByDate(entries)`

Filters entries based on selected date range.

**Returns:** Filtered array of entries

**Supported Filters:**
- All Time (no filtering)
- Calendar Year (current year only)
- Last 12 Months (rolling 12 months)
- Custom Range (user-specified start/end dates)

### Selection and Bulk Operations

#### `handleCheckboxChange()`

Updates selection banner when checkboxes change.

**Actions:**
- Counts selected entries
- Shows/hides selection banner
- Updates selection count display

#### `updateSelectionBanner()`

Shows or hides the selection banner based on selection state.

**Display Logic:**
- Show if any entries selected
- Hide if no entries selected
- Update count display

#### `copySelectedEntries()`

Copies selected entries to clipboard in TSV format.

**Process:**
1. Get data for selected entries
2. Generate TSV format (with headers)
3. Copy to clipboard
4. Show success feedback

#### `downloadSelectedEntries()`

Downloads selected entries as a CSV file.

**Process:**
1. Get data for selected entries
2. Generate CSV format
3. Create blob and download link
4. Trigger download with timestamp filename

#### `deleteSelectedEntries()`

Deletes selected entries after confirmation.

**Safety Features:**
- Requires double confirmation
- Shows count of entries to be deleted
- Updates LocalStorage
- Refreshes display
- Cannot be undone (warns user)

### Import/Export Functions

#### `exportAllDataToCSV()`

Exports all saved data to a CSV file.

**Format:**
- Complete CSV with all fields
- Includes headers
- One row per entry
- Downloadable file with timestamp

#### `importDataFromCSV(csvContent)`

Parses and validates imported CSV data.

**Validation:**
- Checks for required fields
- Validates data types
- Handles malformed CSV
- Returns array of valid entries

**Handles:**
- Quoted fields
- Commas in data
- Multiple bag types
- Animal type information

#### `handleImportAddMode()`

Imports CSV and merges with existing data.

**Features:**
- Detects duplicates
- Skips duplicate entries
- Adds new entries
- Preserves existing data
- Shows import summary

#### `handleImportReplaceMode()`

Imports CSV and replaces all existing data.

**Safety:**
- Requires confirmation
- Warns about data loss
- Replaces entire LocalStorage
- Shows import summary

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
2. Extract form values (groups and bags)
3. Validate inputs
4. Perform calculations (single or multiple groups)
5. Display results
6. Make Save Data button available
7. Scroll to results

#### Save Data Button
```javascript
document.getElementById('saveDataBtn').addEventListener('click', () => {
    saveCalculationData();
    showSaveFeedback('Data saved successfully!', true);
});
```

**Actions:**
- Saves current calculation results to LocalStorage
- Indexes by volunteer group name(s)
- Adds timestamp and unique ID
- Shows success feedback
- Data persists across browser sessions

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
- Clears all form fields (groups and bags)
- Hides results section  
- Clears stored calculation results
- Does NOT clear saved data in LocalStorage (that's preserved)
- Resets to initial single group and single bag entry

---

[← Back to Documentation Hub](README.md) | [Next: Calculations →](calculations.md)
