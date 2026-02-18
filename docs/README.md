# Technical Documentation - Volunteer Calculator

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Detailed Component Documentation](#detailed-component-documentation)
4. [Calculation Algorithms](#calculation-algorithms)
5. [Data Flow](#data-flow)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)
8. [Browser Compatibility](#browser-compatibility)
9. [Performance Considerations](#performance-considerations)
10. [Future Enhancements](#future-enhancements)

## Architecture Overview

The Volunteer Calculator is a client-side single-page application (SPA) built with vanilla JavaScript, HTML5, and CSS3. It requires no backend server or database, making it ideal for GitHub Pages deployment.

### Design Principles

- **Zero Dependencies**: No frameworks or libraries required
- **Progressive Enhancement**: Works on all modern browsers
- **Mobile First**: Responsive design that works on any device
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Lightweight with minimal resource usage

## File Structure

```
volunteer-calculator/
├── index.html          # Main application page
├── styles.css          # Application styles
├── calculator.js       # Core calculation logic
├── test.html          # Test runner page
├── tests.js           # Unit test suite
├── README.md          # User documentation
├── docs/
│   └── README.md      # This technical documentation
├── .vscode/
│   ├── settings.json  # VS Code configuration
│   └── tasks.json     # VS Code tasks for local testing
├── AGENT_INSTRUCTIONS.md  # AI agent guidance
└── .gitignore         # Git ignore rules
```

## Detailed Component Documentation

### index.html

The main HTML file provides the structure of the application.

**Key Sections:**

1. **Header**: Branding and title
2. **Form Section**: Input fields for volunteer data
3. **Bags List**: Dynamic bag entry area
4. **Results Section**: Output display (hidden until calculation)
5. **Footer**: Links to documentation

**Form Inputs:**

- `groupName` (text): Name of the volunteer group
- `numVolunteers` (number): Count of volunteers (min: 1)
- `duration` (number): Time duration (min: 0, step: 0.01)
- `timeUnit` (select): Hours or Minutes
- `bagCount[n]` (number): Number of bags for type n (min: 1)
- `bagWeight[n]` (number): Weight per bag for type n (min: 0.01, step: 0.01)

**Dynamic Elements:**

The bags list uses a data attribute `data-bag-index` to track each bag entry. New entries are created dynamically with unique IDs and can be removed individually (except the first one).

### styles.css

Modern CSS3 with responsive design principles.

**Color Scheme:**

- Primary: `#667eea` (purple-blue gradient)
- Secondary: `#764ba2` (purple)
- Success: `#28a745` (green)
- Danger: `#dc3545` (red)
- Background: Linear gradient

**Layout Techniques:**

- CSS Grid for bag entry fields (2 columns on desktop, 1 on mobile)
- Flexbox for form actions and result items
- CSS transitions for smooth interactions
- Media queries for responsive breakpoints

**Key Classes:**

- `.container`: Main wrapper with max-width and centering
- `.form-section`: Input grouping with background
- `.bag-entry`: Individual bag type container
- `.result-item`: Flex container for label/value pairs
- `.btn-primary`, `.btn-secondary`: Button styles

### calculator.js

Core JavaScript logic for calculations and interactions.

**State Management:**

```javascript
let bagCounter = 1;  // Tracks bag entry IDs
window.calculationResults = null;  // Stores last calculation
```

**Key Functions:**

#### `convertToHours(duration, unit)`
Converts time input to hours for consistent calculations.

**Parameters:**
- `duration` (number): Time value
- `unit` (string): 'hours' or 'minutes'

**Returns:** (number) Time in hours

**Algorithm:**
```
if unit == 'minutes':
    return duration / 60
else:
    return duration
```

#### `getBagData()`
Extracts bag data from all bag entry forms.

**Returns:** Array of objects with `count` and `weight` properties

**Process:**
1. Query all `.bag-entry` elements
2. For each entry, get the bag index
3. Retrieve count and weight inputs by ID
4. Validate values are positive numbers
5. Add valid entries to results array

#### `calculateResults(groupName, numVolunteers, durationHours, bags)`
Performs all calculations based on inputs.

**Parameters:**
- `groupName` (string): Name of volunteer group
- `numVolunteers` (number): Number of volunteers
- `durationHours` (number): Duration in hours
- `bags` (array): Array of bag objects

**Returns:** Object containing:
```javascript
{
    groupName: string,
    numVolunteers: number,
    durationHours: number,
    bagResults: [
        {
            bagType: number,
            count: number,
            weight: number,
            total: number
        }
    ],
    totalPounds: number,
    poundsPerVolunteer: number,
    poundsPerVolunteerPerHour: number
}
```

**Calculation Steps:**
1. Initialize results object
2. For each bag type:
   - Calculate total: `count × weight`
   - Add to bagResults array
   - Accumulate to totalPounds
3. Calculate per-volunteer: `totalPounds ÷ numVolunteers`
4. Calculate per-volunteer-per-hour: `poundsPerVolunteer ÷ durationHours`

#### `generateMarkdownTable(results)`
Generates a markdown-formatted table with all data.

**Parameters:**
- `results` (object): Calculation results object

**Returns:** (string) Markdown text

**Output Format:**
```markdown
# [Group Name] - Volunteer Results

## Input Data
| Metric | Value |
|--------|-------|
| ... | ... |

## Bags Processed
| Bag Type | Number of Bags | Pounds per Bag | Total Pounds |
|----------|----------------|----------------|--------------|
| ... | ... | ... | ... |

## Summary Results
| Metric | Value |
|--------|-------|
| ... | ... |
```

#### `addBagEntry()`
Dynamically adds a new bag type entry to the form.

**Process:**
1. Create new div with class `bag-entry`
2. Set `data-bag-index` to current counter
3. Generate HTML with unique input IDs
4. Add remove button (× symbol)
5. Append to bags list
6. Increment counter

#### `removeBagEntry(index)`
Removes a specific bag entry from the form.

**Parameters:**
- `index` (number): The bag index to remove

**Note:** The first bag entry (index 0) has no remove button.

## Calculation Algorithms

### Time Conversion

```
Input: duration (D), unit (U)
Output: hours (H)

IF U = "minutes" THEN
    H = D / 60
ELSE
    H = D
END IF
```

### Bag Type Totals

```
For each bag type i:
    total_i = count_i × weight_i
```

### Total Pounds

```
total_pounds = Σ(total_i) for all i
```

### Per Volunteer

```
pounds_per_volunteer = total_pounds ÷ num_volunteers
```

### Per Volunteer Per Hour

```
pounds_per_volunteer_per_hour = pounds_per_volunteer ÷ duration_hours
```

**Important:** No rounding is applied during calculations to maintain precision. Only display formatting rounds to 2 decimal places.

## Data Flow

### Input Flow

```
User Input → Form Fields → Event Handler → Validation → Extraction → Calculation → Results
```

1. User fills form fields
2. User clicks "Calculate" button
3. `handleCalculate()` prevents form submission
4. Extracts values from form inputs
5. Validates all required fields are filled
6. Calls `getBagData()` to extract bag information
7. Calls `convertToHours()` for time conversion
8. Calls `calculateResults()` for computation
9. Stores results in `window.calculationResults`
10. Calls `displayResults()` to render output
11. Scrolls to results section

### Output Flow

```
Results Object → HTML Generation → DOM Update → Display
```

### Copy-to-Clipboard Flow

```
Results → Markdown Generation → Clipboard API → Feedback Display
```

## Testing Strategy

### Test Coverage

The test suite (`tests.js`) includes 5 test suites with 25 test cases:

1. **Time Conversion Tests**: Verify hour/minute conversion
2. **Calculation Tests**: Verify all calculation formulas
3. **Markdown Generation Tests**: Verify output formatting
4. **Edge Cases Tests**: Verify boundary conditions
5. **Data Integrity Tests**: Verify data is not corrupted

### Test Framework

Custom lightweight test framework built with:
- `TestRunner` class: Manages test execution
- `describe()`: Groups related tests
- `it()`: Individual test cases
- Assertion functions: `assertEquals()`, `assertAlmostEquals()`, `assertTrue()`, `assertArrayEquals()`

### Running Tests

1. Open `test.html` in any browser
2. Tests run automatically on page load
3. Results display with pass/fail status
4. Console shows detailed error messages for failures

### Continuous Testing

While developing:
```bash
# Watch for file changes and refresh browser
# (Manual refresh or use live-server extension)
```

## Deployment

### GitHub Pages Setup

1. Repository Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` (or `master`)
4. Folder: `/ (root)`
5. Save

### Automatic Deployment

Every push to the main branch triggers automatic deployment.

### Custom Domain (Optional)

Add a `CNAME` file with your domain name:
```
calculator.yourdomain.com
```

Configure DNS:
```
Type: CNAME
Name: calculator
Value: yourusername.github.io
```

## Browser Compatibility

### Minimum Requirements

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari 11+, Chrome Android 60+)

### Features Used

- ES6 JavaScript (arrow functions, const/let, template literals)
- CSS Grid and Flexbox
- CSS Custom Properties (could be added for theming)
- Clipboard API with fallback
- Async/await for clipboard operations

### Fallback Strategies

**Clipboard API:**
If `navigator.clipboard` is unavailable:
1. Create temporary textarea
2. Set value to markdown text
3. Use deprecated `document.execCommand('copy')`
4. Remove temporary element

## Performance Considerations

### Optimization Strategies

1. **No External Dependencies**: Eliminates network requests
2. **Minimal DOM Manipulation**: Only updates results section
3. **Event Delegation**: Could be added for bag entries
4. **CSS Animations**: Hardware-accelerated transforms
5. **Lazy Loading**: Results hidden until calculated

### Load Time

- Initial page load: < 1KB HTML + 5KB CSS + 10KB JS = ~16KB total
- Renders in < 100ms on modern devices
- No render-blocking resources

### Memory Usage

- Minimal memory footprint
- No memory leaks (no event listener accumulation)
- Results object cleared on reset

## Future Enhancements

### Potential Features

1. **Data Persistence**
   - LocalStorage for saving recent calculations
   - Export to CSV/PDF
   - Import previous results

2. **Advanced Metrics**
   - Compare multiple teams
   - Track trends over time
   - Goal setting and progress

3. **Visualization**
   - Charts for bag type distribution
   - Team comparison graphs
   - Progress bars

4. **Collaboration**
   - Share results via URL
   - QR code generation
   - Print-friendly view

5. **Accessibility**
   - Screen reader optimization
   - Keyboard navigation improvements
   - High contrast theme

6. **Internationalization**
   - Multiple language support
   - Different unit systems (kg/lbs)
   - Localized number formatting

### Technical Improvements

1. Service Worker for offline support
2. Progressive Web App (PWA) features
3. TypeScript for type safety
4. Build process for minification
5. End-to-end testing with Cypress/Playwright

## Maintenance

### Code Style

- 4-space indentation
- camelCase for variables and functions
- PascalCase for classes
- Descriptive variable names
- Comments for complex logic

### Version Control

- Semantic versioning (MAJOR.MINOR.PATCH)
- Conventional commits
- Feature branches
- Pull request reviews

### Documentation Updates

Keep documentation in sync with code changes:
- Update README.md for user-facing changes
- Update docs/README.md for technical changes
- Update AGENT_INSTRUCTIONS.md for AI guidance

---

**Last Updated**: 2026-02-18

For questions or contributions, please open an issue on GitHub.