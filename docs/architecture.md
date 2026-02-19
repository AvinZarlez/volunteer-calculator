# 🏗️ Architecture & File Structure

[← Back to Documentation Hub](index.md)

## Architecture Overview

The Volunteer Calculator is a client-side single-page application (SPA) built with vanilla JavaScript, HTML5, and CSS3. It requires no backend server or database, making it ideal for GitHub Pages deployment.

### Design Principles

- **Zero Dependencies**: No frameworks or libraries required, reducing complexity and load time
- **Progressive Enhancement**: Works on all modern browsers with graceful degradation
- **Mobile First**: Responsive design that works on any device size
- **Accessibility**: Semantic HTML and ARIA labels for screen readers
- **Performance**: Lightweight with minimal resource usage (< 20KB total)

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              User Interface (HTML)              │
│  ┌─────────────┐  ┌──────────────────────────┐ │
│  │ Input Form  │  │   Results Display        │ │
│  └─────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│          Business Logic (JavaScript)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Validate │→ │Calculate │→ │Display/Export│  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│            Styling (CSS)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Layout   │  │ Colors   │  │ Animations   │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

## File Structure

```
volunteer-calculator/
├── index.html              # Main application page
├── styles.css              # Application styles
├── calculator.js           # Core calculation logic
├── tests.js               # Browser-based unit tests
├── tests.node.js          # Node.js test runner
├── README.md              # User documentation
├── LICENSE                # MIT License
├── .nojekyll              # Disable Jekyll processing on GitHub Pages
├── .gitignore             # Git ignore rules
├── package.json           # Node.js dependencies (dev only)
├── package-lock.json      # Locked dependency versions
├── .eslintrc.json         # ESLint configuration
│
├── docs/                  # Technical documentation
│   ├── README.md           # Documentation hub (this section)
│   ├── architecture.md    # Architecture overview
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

### Input → Processing → Output

```
1. User Input
   ↓
2. Form Validation
   ↓
3. Data Extraction
   ↓
4. Time Conversion
   ↓
5. Calculation
   ↓
6. Results Generation
   ↓
7. Display Rendering
   ↓
8. Optional: Markdown Export
```

### State Management

The application uses minimal state management:

```javascript
// Global state variables
let bagCounter = 1; // Tracks the next bag entry ID
window.calculationResults = null; // Stores the last calculation results
```

**State Flow:**

- `bagCounter` increments when adding new bag entries
- `calculationResults` is set when calculations complete
- `calculationResults` is cleared on form reset
- No persistent storage (intentional - privacy by design)

### Helper Functions

The application uses several helper functions to reduce code duplication and improve maintainability:

**Constants:**
- `STORAGE_KEY`: localStorage key for data persistence
- `DECIMAL_PLACES`: Number of decimal places for formatting (2)
- `UNIT_WEIGHT`: Weight unit label ('lbs')
- `UNIT_RATE`: Rate unit label ('lbs/hour')
- `TSV_HEADER`: Tab-separated header for data export

**Formatting Helpers:**
- `formatNumber(num, places)`: Formats numbers to specified decimal places
- `formatBagTypes(bagResults)`: Formats bag type data for display
- `formatTimestamp(timestamp)`: Formats dates consistently
- `trimGroupName(name)`: Trims whitespace from group names

**UI Helpers:**
- `clearDataViewerUI()`: Resets data viewer table and summary
- `copyToClipboardLegacy(text, elementId, message)`: Unified clipboard operation with fallback

These helpers eliminate ~80+ lines of duplicate code across the application.

## Component Communication

### Event-Driven Architecture

```
Form Submission Event
  └→ handleCalculate()
      ├→ getBagData()
      ├→ convertToHours()
      ├→ calculateResults()
      │   └→ stores in window.calculationResults
      └→ displayResults()

Copy Button Click
  └→ handleCopy()
      ├→ generateMarkdownTable()
      └→ navigator.clipboard.writeText()

Add Bag Button Click
  └→ addBagEntry()
      └→ creates new DOM elements

Remove Bag Button Click
  └→ removeBagEntry(index)
      └→ removes DOM elements
```

## Scalability Considerations

### Current Limitations

- Client-side only (no server or database)
- No data persistence between sessions
- Limited to single calculation at a time

### Designed for Scale

- Dynamic bag entry creation (supports unlimited bag types)
- Efficient DOM manipulation (only updates when needed)
- No memory leaks (proper event cleanup)
- Fast calculations (< 1ms for typical use cases)

### If Scaling is Needed

**For more users:**

- Already scalable via GitHub Pages CDN
- Static files cached by browsers
- No server load (all client-side)

**For more features:**

- Easy to extend with new calculations
- Modular function design
- Clear separation of concerns

## Security Architecture

### Security by Design

1. **No Backend**: No database or server means no server-side vulnerabilities
2. **No Authentication**: No user accounts means no credential theft
3. **Client-Side Only**: All processing in browser means no data transmission
4. **No External APIs**: No third-party data leaks
5. **No Tracking**: No analytics or user tracking
6. **No Storage**: No localStorage or cookies (privacy by default)

### Input Validation

```javascript
// HTML5 form validation
<input type="number" min="1" required>

// JavaScript validation
if (!groupName || groupName.trim() === '') {
    throw new Error('Group name is required');
}
```

### Content Security

- No inline JavaScript (all in external files)
- No eval() or similar unsafe functions
- No dynamic script loading
- XSS protection via text content (not innerHTML)

## Performance Metrics

### Load Performance

- **Initial Load**: ~16KB total (HTML + CSS + JS)
- **Time to Interactive**: < 100ms on modern devices
- **No Render-Blocking**: All resources load efficiently

### Runtime Performance

- **Calculation Speed**: < 1ms for typical inputs
- **DOM Updates**: Only results section (minimal reflow)
- **Memory Usage**: < 2MB total

### Optimization Techniques

1. Minimal DOM manipulation
2. CSS animations (hardware accelerated)
3. Event delegation where possible
4. Lazy loading (results hidden until needed)
5. No external dependencies
6. **Helper functions to reduce code duplication** (reduces parsing time)
7. **Shared formatting logic** (consistent output with less code)

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
- No maintenance
- No costs
- Better privacy
- Faster performance

**Cons:**

- No data persistence
- No history tracking
- No user accounts

**Decision**: Intentional design choice prioritizing simplicity and privacy.

---

[← Back to Documentation Hub](index.md) | [Next: Components →](components.md)
