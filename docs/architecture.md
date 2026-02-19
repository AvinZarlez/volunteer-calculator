# 🏗️ Architecture & File Structure

[← Back to Documentation Hub](README.md)

## Architecture Overview

The Volunteer Calculator is a client-side single-page application (SPA) built with vanilla JavaScript, HTML5, and CSS3. It requires no backend server or database, making it ideal for GitHub Pages deployment.

### Design Principles

- **Zero External Dependencies**: No frameworks or libraries required, reducing complexity and load time
- **Progressive Enhancement**: Works on all modern browsers with graceful degradation
- **Mobile First**: Responsive design that works on any device size
- **Accessibility**: Semantic HTML and ARIA labels for screen readers
- **Performance**: Lightweight with minimal resource usage
- **Data Persistence**: LocalStorage for saving calculation history and managing volunteer data

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│            User Interface (HTML + CSS)                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │ Calculator View  │  │   Data Viewer Tab            │    │
│  │ - Input Forms    │  │   - Group Selection          │    │
│  │ - Results        │  │   - Date Filtering           │    │
│  │ - Export         │  │   - Data Table               │    │
│  └──────────────────┘  │   - Checkbox Selection       │    │
│                        │   - Bulk Operations Banner    │    │
│                        │   - Import/Export Controls    │    │
│                        └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│          Business Logic (JavaScript)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Validate │→ │Calculate │→ │  Display │→ │Export/Save│  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Storage Module (LocalStorage)                        │  │
│  │ - Save/Load data  - Filter by date  - Import/Export │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│         Data Persistence (LocalStorage)                     │
│  - Volunteer group entries with timestamps                  │
│  - Indexed by group name                                    │
│  - Supports CSV import/export                               │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
volunteer-calculator/
├── index.html              # Main application page with Calculator and Data Viewer tabs
├── styles.css              # Application styles (1,051 lines)
├── calculator.js           # Core calculation logic and data management (1,991 lines)
├── tests.js               # Browser-based unit tests (356 tests)
├── tests.node.js          # Node.js test runner
├── README.md              # User documentation and quick start guide
├── LICENSE                # MIT License
├── .nojekyll              # Disable Jekyll processing on GitHub Pages
├── .gitignore             # Git ignore rules
├── package.json           # Node.js dependencies (dev only)
├── package-lock.json      # Locked dependency versions
├── .eslintrc.json         # ESLint configuration
│
├── docs/                  # Technical documentation
│   ├── README.md           # Documentation hub (navigation center)
│   ├── architecture.md    # Architecture overview (this file)
│   ├── components.md      # Component documentation
│   ├── calculations.md    # Algorithm documentation
│   ├── testing.md         # Testing guide
│   ├── github-pages-setup.md # Deployment guide
│   ├── browser-compatibility.md # Browser support
│   └── customization.md   # Customization guide
│
├── .github/               # GitHub-specific files
│   └── workflows/
│       ├── ci.yml         # CI/CD pipeline (lint & test)
│       └── deploy.yml     # GitHub Pages deployment
│
├── .vscode/               # VS Code configuration
│   ├── settings.json      # Editor settings
│   └── tasks.json         # Build tasks
│
└── AGENT_INSTRUCTIONS.md  # AI agent guidance
```

## Technology Stack

### Frontend Technologies

| Technology             | Purpose                       | Why Chosen                                   |
| ---------------------- | ----------------------------- | -------------------------------------------- |
| **HTML5**              | Structure and semantic markup | Standard, accessible, widely supported       |
| **CSS3**               | Styling with modern features  | Grid, Flexbox, animations without frameworks |
| **Vanilla JavaScript** | Core logic and interactivity  | No dependencies, maximum compatibility       |

### Development Tools

| Tool        | Purpose                         | Configuration File |
| ----------- | ------------------------------- | ------------------ |
| **ESLint**  | Code quality and style checking | `.eslintrc.json`   |
| **Node.js** | Test execution environment      | `package.json`     |
| **npm**     | Package management              | `package.json`     |

### Deployment & CI/CD

| Service            | Purpose                          | Configuration                  |
| ------------------ | -------------------------------- | ------------------------------ |
| **GitHub Pages**   | Static site hosting              | `.github/workflows/deploy.yml` |
| **GitHub Actions** | Automated testing and deployment | `.github/workflows/ci.yml`     |

## Data Flow Architecture

### Calculator View Flow
```
1. User Input (Multiple Groups + Multiple Bag Types)
   ↓
2. Form Validation
   ↓
3. Data Extraction (Groups + Bags + Animal Types)
   ↓
4. Time Conversion
   ↓
5. Calculation (Per-group and aggregated)
   ↓
6. Results Generation
   ↓
7. Display Rendering
   ↓
8. Optional: Save to LocalStorage
   ↓
9. Optional: Export (Markdown/TSV)
```

### Data Viewer Flow
```
1. Load Data from LocalStorage
   ↓
2. Apply Filters (Group + Date Range)
   ↓
3. Display Entries in Table
   ↓
4. User Interactions:
   - Select entries (checkboxes)
   - Bulk operations (copy/download/delete)
   - Single entry actions
   ↓
5. Update LocalStorage (on delete)
```

### Import/Export Flow
```
Export:
  LocalStorage → Generate CSV → Download/Copy

Import:
  Upload CSV → Parse Data → Validate →
    ├─ Add Mode: Merge with existing
    └─ Replace Mode: Replace all data
  → Save to LocalStorage → Refresh UI
```

### State Management

The application uses a combination of global state and LocalStorage:

```javascript
// Global state variables
let bagCounter = 1;        // Tracks the next bag entry ID
let groupCounter = 1;      // Tracks the next volunteer group ID
window.calculationResults = null; // Stores the last calculation results

// LocalStorage structure
const STORAGE_KEY = 'volunteerCalculatorData';
// Data format: { "groupName": [ {entry1}, {entry2}, ... ], ... }
```

**State Flow:**

1. **Form State**: 
   - Dynamic bag/group counters manage form field IDs
   - Enables unlimited bag types and volunteer groups
   
2. **Calculation State**:
   - `calculationResults` stores most recent calculation
   - Cleared on form reset
   - Used for exports and display

3. **Persistent State** (LocalStorage):
   - Indexed by volunteer group name
   - Each entry includes: timestamp, groups, bags, animal types, calculations
   - Survives browser refresh and closure
   - Managed by StorageModule functions

4. **UI State**:
   - Active view (Calculator vs Data Viewer)
   - Selected entries (checkbox state)
   - Filter settings (date range, group)
   - Visibility of results/management sections

### Helper Functions

The application uses several helper functions to reduce code duplication and improve maintainability:

**Constants:**
- `STORAGE_KEY`: localStorage key for data persistence (`'volunteerCalculatorData'`)
- `DECIMAL_PLACES`: Number of decimal places for formatting (2)
- `UNIT_WEIGHT`: Weight unit label ('lbs')
- `UNIT_RATE`: Rate unit label ('lbs/hour')

**Formatting Helpers:**
- `formatNumber(num, places)`: Formats numbers to specified decimal places
- `formatBagTypes(bagResults)`: Formats bag type data with animal types for display
- `formatTimestamp(timestamp)`: Formats dates consistently (MM/DD/YYYY HH:MM AM/PM)
- `formatDateForInput(date)`: Formats dates for HTML date inputs (YYYY-MM-DD)
- `trimGroupName(name)`: Trims whitespace and normalizes group names
- `normalizeGroupName(name)`: Case-insensitive group name matching

**UI Helpers:**
- `clearDataViewerUI()`: Resets data viewer table and summary
- `showFeedback(message, type)`: Displays temporary user feedback messages
- `showSaveFeedback(message, success)`: Shows save operation feedback
- `showCopyFeedback()`: Shows clipboard copy confirmation

**Data Management Helpers:**
- `getDateFilterRange()`: Gets selected date filter range
- `filterEntriesByDate(entries)`: Filters entries by date range
- `areEntriesDuplicate(entry1, entry2)`: Detects duplicate entries
- `mergeImportedData(existing, new)`: Merges imported with existing data

**Export/Import Helpers:**
- `getTSVHeader()`: Returns TSV header for spreadsheet export
- `getCSVHeader()`: Returns CSV header for file export
- `generateEntryTSV(entry)`: Converts single entry to TSV format
- `generateAllEntriesTSV(entries)`: Converts multiple entries to TSV
- `entryToCSVLine(entry)`: Converts entry to CSV line
- `parseCSVLine(line)`: Parses CSV line with proper quote handling
- `parseBagTypes(bagTypesStr)`: Parses bag type data from CSV

These helpers eliminate hundreds of lines of duplicate code across the application.

## Component Communication

### Event-Driven Architecture

```
Calculator View Events:
  Form Submission Event
    └→ handleCalculate()
        ├→ getGroupData()      (extracts multiple groups)
        ├→ getBagData()        (extracts multiple bag types)
        ├→ convertToHours()
        ├→ calculateMultipleGroupResults() or calculateResults()
        │   └→ stores in window.calculationResults
        └→ displayResults()

  Save Button Click
    └→ saveCalculationData()
        ├→ get or create unique entry ID
        ├→ add timestamp
        ├→ save to LocalStorage (indexed by group name)
        └→ showSaveFeedback()

  Copy Button Click
    └→ handleCopy()
        ├→ generateMarkdownTable()
        └→ navigator.clipboard.writeText()

  Add Bag Button Click
    └→ addBagEntry()
        ├→ creates new DOM elements with unique IDs
        └→ setupBagTypeListeners()

  Add Group Button Click
    └→ addGroupEntry()
        └→ creates new group input fields

  Remove Bag/Group Button Click
    └→ removeBagEntry(index) / removeGroupEntry(index)
        └→ removes DOM elements

Data Viewer Events:
  View Switch
    └→ switchView('dataViewer')
        ├→ hide Calculator view
        ├→ show Data Viewer
        ├→ refreshGroupList()
        └→ update active tab styling

  Group Selection Change
    └→ loadGroupData()
        ├→ read from LocalStorage
        ├→ filterEntriesByDate()
        └→ displayGroupEntries()

  Date Filter Change
    └→ loadGroupData()  (re-filters and displays)

  Checkbox Selection
    └→ handleCheckboxChange()
        └→ updateSelectionBanner()
            └→ shows/hides bulk operation controls

  Selection Banner Actions:
    - Select All → toggleAllCheckboxes(true)
    - Copy → copySelectedEntries() → TSV to clipboard
    - Download → downloadSelectedEntries() → CSV file
    - Delete → deleteSelectedEntries() → confirm → update LocalStorage
    - Clear → clearSelection()

  Import Actions:
    - Import Add Mode → handleImportAddMode()
        └→ mergeImportedData() → save to LocalStorage
    - Import Replace Mode → handleImportReplaceMode()
        └→ replace all data → save to LocalStorage

  Export Actions:
    - Export All → exportAllDataToCSV()
    - Copy Entry → copyEntryToClipboard()
    - Copy All → copyAllEntriesToClipboard()
```

## Scalability Considerations

### Current Capabilities

- **Multiple Views**: Calculator and Data Viewer tabs
- **Multiple Groups**: Support for tracking multiple volunteer groups simultaneously
- **Multiple Bag Types**: Unlimited dynamic bag entries per calculation
- **Animal Type Tracking**: Dog, Cat, Other (with custom specification)
- **Data Persistence**: LocalStorage-based with no size practical limit for typical use
- **Date Filtering**: All-time, calendar year, last 12 months, custom range
- **Bulk Operations**: Select and manage multiple entries at once
- **Import/Export**: CSV format for data portability

### Designed for Scale

- Dynamic form field creation (supports unlimited bag types and groups)
- Efficient DOM manipulation (only updates changed sections)
- No memory leaks (proper event cleanup)
- Fast calculations (< 1ms for typical use cases)
- LocalStorage indexing by group name (O(1) lookups)
- Checkbox-based selection (handles hundreds of entries efficiently)

### Current Limitations

- Client-side only (no server or cloud backup)
- LocalStorage limit (~5-10MB depending on browser)
- Single-user (no collaboration features)
- No real-time sync across devices

### If Scaling is Needed

**For more data:**

- Already handles hundreds of entries efficiently
- LocalStorage pagination available if needed
- CSV export enables external data management
- Import/export for data migration and backup

**For more users:**

- Already scalable via GitHub Pages CDN
- Static files cached by browsers
- No server load (all client-side)

**For more features:**

- Modular function design allows easy extension
- Clear separation of concerns (Calculator, Storage, Display)
- Helper functions reduce duplication
- Event-driven architecture simplifies adding new interactions

## Security Architecture

### Security by Design

1. **No Backend**: No database or server means no server-side vulnerabilities
2. **No Authentication**: No user accounts means no credential theft
3. **Client-Side Only**: All processing in browser, no data transmitted to external servers
4. **No External APIs**: No third-party data leaks
5. **No Tracking**: No analytics or user tracking
6. **LocalStorage Only**: Data stored locally in user's browser, under user's control
7. **No Cloud Sync**: Privacy-first approach, data never leaves user's device

### Input Validation

```javascript
// HTML5 form validation
<input type="number" min="1" required>
<input type="number" min="0.01" step="0.01" required>

// JavaScript validation
if (!groupName || groupName.trim() === '') {
    throw new Error('Group name is required');
}

// CSV import validation
- Validates required fields
- Sanitizes input data
- Prevents malformed data injection
```

### Content Security

- No inline JavaScript (all in external files)
- No eval() or similar unsafe functions
- No dynamic script loading
- XSS protection via textContent (not innerHTML where possible)
- CSV parsing with proper quote handling

### Data Privacy

- All data stored locally (LocalStorage)
- User controls all data (can export, delete anytime)
- No server transmission
- No cookies or cross-site tracking
- Export/Import for user-controlled backup

## Performance Metrics

### Load Performance

- **Total Size**: ~70KB (HTML + CSS + JS uncompressed)
- **Time to Interactive**: < 200ms on modern devices
- **No Render-Blocking**: All resources load efficiently
- **LocalStorage Operations**: < 10ms for typical data sets

### Runtime Performance

- **Calculation Speed**: < 1ms for typical inputs (multiple groups/bags)
- **DOM Updates**: Targeted updates (minimal reflow)
- **Memory Usage**: < 5MB total with data
- **Table Rendering**: < 50ms for 100 entries
- **Filter Operations**: < 20ms for date filtering

### Optimization Techniques

1. **Minimal DOM manipulation**: Only update changed elements
2. **CSS animations**: Hardware accelerated where possible
3. **Event delegation**: Efficient event handling for dynamic content
4. **Lazy loading**: Results/data viewer hidden until needed
5. **No external dependencies**: Eliminates framework overhead
6. **Helper functions**: Reduce code duplication and parsing time
7. **Shared formatting logic**: Consistent output with less code
8. **Checkbox selection**: Batch operations without individual event listeners
9. **LocalStorage indexing**: Fast data retrieval by group name

## Development Workflow

### Local Development

```bash
# Clone repository
git clone https://github.com/AvinZarlez/volunteer-calculator.git

# Open in browser
# Simply open index.html or use a local server

# With Python
python -m http.server 8000

# With Node.js
npx http-server
```

### Testing Workflow

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test
```

### Deployment Workflow

```bash
# Push to main branch
git push origin main

# GitHub Actions automatically:
# 1. Runs linting (CI)
# 2. Runs tests (CI)
# 3. Deploys to GitHub Pages (if tests pass)
```

## Architecture Decisions

### Why Vanilla JavaScript?

**Pros:**

- No build step required
- No dependency management
- Maximum browser compatibility
- Faster load times
- Easier for contributors to understand

**Cons:**

- More verbose code
- No component framework benefits
- Manual state management

**Decision**: For this small, focused application, the simplicity and zero-dependency approach outweighs framework benefits.

### Why GitHub Pages?

**Pros:**

- Free hosting
- Automatic HTTPS
- CDN distribution
- Easy deployment
- Version control integration

**Cons:**

- Static only (no backend)
- Public repositories only (for free tier)

**Decision**: Perfect fit for a client-side calculator with no backend needs.

### Why No Database?

**Pros:**

- Simpler architecture
- No maintenance or costs
- Better privacy (data never leaves user's device)
- Faster performance (no network latency)
- Works offline after initial load
- User controls their own data

**Cons:**

- No cross-device sync
- No cloud backup (user must export manually)
- No collaboration features
- LocalStorage size limits (~5-10MB)

**Decision**: Intentional design choice prioritizing simplicity, privacy, and user data control. CSV export/import provides data portability.

---

[← Back to Documentation Hub](README.md) | [Next: Components →](components.md)
