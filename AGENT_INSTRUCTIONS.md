# Agent Instructions - Volunteer Calculator

## Project Overview

This is a GitHub Pages-based web application called "Volunteer Calculator" designed to help volunteer coordinators track and calculate pet food packing productivity metrics.

## Purpose

The Volunteer Calculator helps teams measure their volunteer effort by:
1. Recording volunteer group information (multiple groups, count, duration, animal types)
2. Tracking bags processed (number and weight of different bag types with animal classification)
3. Calculating productivity metrics (total pounds, per volunteer, per volunteer per hour)
4. **Saving calculation history to browser LocalStorage**
5. **Managing saved data with filtering, import/export, and bulk operations**
6. Exporting results in multiple formats (markdown, TSV, CSV)

## Core Functionality

### Calculator View

The primary interface for entering data and calculating results.

#### Inputs Required

1. **Time volunteered** (numeric with unit selector)
   - Can be entered in minutes or hours
   - Must be converted to hours for calculations
   - Shared across all volunteer groups

2. **Volunteer Groups** (dynamic list, NEW)
   - **Name of volunteer group** (text field)
   - **Number of volunteers** (numeric, minimum 1)
   - Can add multiple groups with "+ Add Another Volunteer Group" button
   - Remove button (×) for each group except the first
   - Each group gets individual calculations

3. **Bag data entries** (dynamic list)
   - **Number of bags** (numeric, minimum 1)
   - **Pounds per bag** (numeric, minimum 0.01)
   - **Animal Type** (radio buttons): Dog, Cat, or Other
     - If "Other" is selected, a text field appears for custom type (e.g., "Bird")
     - Leaving custom field blank defaults to "Other"
   - Can add unlimited bag types with "+ Add Another Bag Type" button
   - Remove button (×) for each entry except the first

### Calculations Performed

For **single group**:
1. **Pounds per bag type** = Number of bags × Pounds per bag (for each type)
2. **Total pounds processed** = Sum of all bag type totals
3. **Amount per volunteer** = Total pounds ÷ Number of volunteers
4. **Amount per volunteer per hour** = Amount per volunteer ÷ Hours worked

For **multiple groups**:
1. Individual calculations for each group (as above)
2. **Aggregate totals** across all groups
3. **Combined metrics** (total volunteers, total pounds, etc.)

**Important**: Time must be converted to hours (not rounded) before the per-hour calculation to ensure accuracy.

### Output Display

Results are shown in expandable sections:
1. **Individual Group Results** (one section per group with animal type breakdown)
   - Group name and metrics
   - Bag types with animal classifications (Dog, Cat, Other, or custom)
   - Per-volunteer statistics
2. **Aggregate Results** (when multiple groups entered)
   - Combined totals across all groups
3. **Action Buttons**:
   - **💾 Save Data**: Saves to LocalStorage (new)
   - **📋 Copy Results as Markdown Table**: Clipboard copy
   - **📋 Copy to Spreadsheet**: TSV format for Excel/Sheets (new)

### Data Persistence (NEW)

A "💾 Save Data" button stores calculation results to browser LocalStorage:
- Indexed by volunteer group name
- Includes timestamp and unique ID
- Persists across browser sessions
- Accessible via Data Viewer tab

### Data Viewer Tab (NEW)

A complete second view for managing saved calculation history:

#### Features:
1. **Group Selection Dropdown**
   - Select specific volunteer group
   - "All Groups" option to see everything
   - Auto-populated from saved data

2. **Date Filtering**
   - All Time (default)
   - Calendar Year (current year only)
   - Last 12 Months (rolling window)
   - Custom Range (user-specified start/end dates with "Today" quick buttons)

3. **Data Table**
   - Displays all matching entries
   - Columns: Date, Group, Volunteers, Hours, Bag Types, Total Pounds, Per Volunteer, Per Vol/Hour
   - **Checkbox selection** (individual and "Select All")
   - Shows animal types in bag type details

4. **Selection Banner** (appears when entries selected)
   - Shows count of selected entries
   - **Bulk Operations**:
     - ✓ Select All
     - 📋 Copy (TSV to clipboard)
     - 💾 Download as CSV
     - 🗑️ Delete (with double confirmation)
     - ✕ Cancel/Clear selection

5. **Data Management Section** (collapsible)
   - **Export All Data to CSV**: Downloads complete database
   - **Copy All Entries**: TSV format to clipboard
   - **Import from CSV**:
     - ➕ Add Mode: Merges with existing data (skips duplicates)
     - 🔄 Replace Mode: Replaces all data (requires confirmation)

6. **Summary Statistics**
   - Total entries shown
   - Total pounds across displayed entries
   - Date range of displayed data

### Export Features

Multiple export formats available:

1. **Markdown Table** (Calculator view)
   - Formatted table for GitHub/reports
   - Includes all input data and results
   - With animal type information

2. **TSV (Tab-Separated Values)** (Data Viewer)
   - For pasting into Excel/Google Sheets
   - Single or multiple entries
   - Includes headers

3. **CSV (Comma-Separated Values)** (Data Viewer)
   - Complete data export
   - Proper quote handling
   - For backup and migration

## Technical Architecture

### Technology Stack
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **GitHub Pages**: Static hosting

### File Structure
- `index.html`: Main application page (449 lines) with Calculator and Data Viewer tabs
- `styles.css`: All styling (1,051 lines) with responsive design
- `calculator.js`: Core logic, calculations, and data management (1,991 lines)
- `tests.js`: Comprehensive unit test suite (356 lines)
- `tests.node.js`: Node.js test runner for CI/CD
- `README.md`: User documentation and quick start guide
- `docs/README.md`: Technical documentation hub
- `AGENT_INSTRUCTIONS.md`: This file
- `.github/workflows/`: CI/CD pipelines (ci.yml, deploy.yml)
- `.vscode/`: VS Code configuration for local development

### Key JavaScript Functions

**Calculator Functions:**
1. `convertToHours(duration, unit)`: Converts minutes to hours
2. `getBagData()`: Extracts all bag data with animal types from form
3. `getGroupData()`: Extracts all volunteer group data from form (NEW)
4. `calculateResults(groupName, numVolunteers, durationHours, bags)`: Single group calculation
5. `calculateMultipleGroupResults(groups, durationHours, bags)`: Multiple groups calculation (NEW)
6. `displayResults(results)`: Renders results to DOM with animal type info
7. `generateMarkdownTable(results)`: Creates markdown output with animal types
8. `addBagEntry()`: Adds new bag type form fields with animal type options
9. `removeBagEntry(index)`: Removes a bag type
10. `addGroupEntry()`: Adds new volunteer group form fields (NEW)
11. `removeGroupEntry(index)`: Removes a volunteer group (NEW)
12. `setupBagTypeListeners(bagIndex)`: Sets up event listeners for bag type radio buttons (NEW)
13. `resetForm()`: Clears all inputs and results

**Storage Functions (NEW):**
14. `saveCalculationData()`: Saves results to LocalStorage with timestamp
15. `StorageModule.save(groupName, entry)`: Persists entry to LocalStorage
16. `StorageModule.load(groupName)`: Loads entries for a group
17. `StorageModule.loadAll()`: Loads all saved data
18. `StorageModule.delete(groupName, entryId)`: Removes specific entry

**Data Viewer Functions (NEW):**
19. `switchView(view)`: Switches between Calculator and Data Viewer tabs
20. `refreshGroupList()`: Populates group selection dropdown
21. `loadGroupData()`: Loads and displays filtered entries
22. `displayGroupEntries(groupName, entries, isAllGroups)`: Renders data table
23. `filterEntriesByDate(entries)`: Filters by date range
24. `getDateFilterRange()`: Gets selected date filter parameters
25. `formatDateForInput(date)`: Formats date for HTML date inputs
26. `setToday(inputId)`: Sets a date input to today's date

**Selection and Bulk Operations (NEW):**
27. `handleCheckboxChange()`: Updates selection state
28. `updateSelectionBanner()`: Shows/hides selection banner
29. `toggleAllCheckboxes(checked)`: Selects/deselects all entries
30. `selectAllEntries()`: Selects all visible entries
31. `clearSelection()`: Clears all selections
32. `getSelectedEntriesData()`: Gets data for selected entries
33. `copySelectedEntries()`: Copies to clipboard (TSV)
34. `downloadSelectedEntries()`: Downloads as CSV file
35. `deleteSelectedEntries()`: Deletes with confirmation

**Import/Export Functions (NEW):**
36. `exportAllDataToCSV()`: Exports complete database to CSV file
37. `copyAllEntriesToClipboard()`: Copies all entries as TSV
38. `copyEntryToClipboard(groupName, entryId)`: Copies single entry
39. `generateEntryTSV(entry)`: Generates TSV for one entry
40. `generateAllEntriesTSV(entries)`: Generates TSV for multiple entries
41. `entryToCSVLine(entry)`: Converts entry to CSV format
42. `parseCSVLine(line)`: Parses CSV with proper quote handling
43. `parseBagTypes(bagTypesStr)`: Parses bag type data from CSV
44. `importDataFromCSV(csvContent)`: Validates and imports CSV data
45. `handleImportAddMode()`: Import with merge (skips duplicates)
46. `handleImportReplaceMode()`: Import with replace (full replacement)
47. `mergeImportedData(existing, new)`: Merges data intelligently
48. `areEntriesDuplicate(entry1, entry2)`: Detects duplicate entries

**UI Helper Functions:**
49. `formatNumber(num, places)`: Formats numbers consistently
50. `formatBagTypes(bagResults)`: Formats bag type display with animal types
51. `formatTimestamp(timestamp)`: Formats dates for display
52. `trimGroupName(name)`: Normalizes group names
53. `normalizeGroupName(name)`: Case-insensitive matching
54. `showFeedback(message, type)`: Shows user feedback messages
55. `showSaveFeedback(message, success)`: Shows save operation feedback
56. `clearDataViewerUI()`: Resets data viewer display
57. `toggleDataManagement()`: Toggles data management section

### Data Flow

```
Calculator View:
  User Input (Groups + Bags + Animal Types) → 
  Form Validation → 
  Time Conversion → 
  Calculations (Single or Multiple Groups) → 
  Results Display →
  Optional: Save to LocalStorage →
  Optional: Export (Markdown/TSV)

Data Viewer:
  LocalStorage → 
  Filter by Group → 
  Filter by Date Range →
  Display in Table → 
  Select Entries (Checkboxes) →
  Bulk Operations (Copy/Download/Delete)

Import/Export:
  Export: LocalStorage → Generate CSV → Download
  Import: Upload CSV → Parse & Validate → 
          Merge or Replace → LocalStorage → Refresh UI
```

## Testing

### Test Coverage
- Time conversion (hours/minutes) - 6 tests
- Calculation accuracy (single/multiple bag types) - 6 tests
- Markdown generation and formatting - 5 tests
- Edge cases (single volunteer, small durations, large numbers) - 5 tests
- Data integrity (no input mutation) - 3 tests
- Input validation - 6 tests
- **Total: 31+ test cases**

### Running Tests
```bash
# Install dependencies (first time)
npm install

# Run tests
npm test

# Run linting
npm run lint
```

Tests run automatically via GitHub Actions CI/CD on every push and pull request.

## Development Guidelines

### When Making Changes

1. **Maintain Simplicity**: No frameworks or build steps required
2. **Test All Changes**: Update or add tests for new functionality
3. **Update Documentation**: Keep README.md, docs files, and AGENT_INSTRUCTIONS.md in sync
4. **Preserve Responsiveness**: Test on mobile and desktop
5. **Browser Compatibility**: Support modern browsers (Chrome 60+, Firefox 55+, Safari 11+)
6. **Data Integrity**: Ensure LocalStorage operations are atomic and validated
7. **User Feedback**: Provide clear feedback for all user actions (save, delete, copy, etc.)

### Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing patterns in the codebase
- Keep functions focused and single-purpose
- Use semantic HTML elements

### Adding New Features

1. Update calculation logic in `calculator.js`
2. Add corresponding tests in `tests.js`
3. Update UI in `index.html` if needed
4. Update styles in `styles.css` if needed
5. Document in `docs/README.md`
6. Update user guide in `README.md`

### Common Modifications

**Adding a new input field:**
1. Add HTML input in `index.html` (in appropriate view/section)
2. Extract value in relevant handler (`handleCalculate()` or viewer functions)
3. Pass to calculation or storage functions
4. Update results/entry object structure
5. Update display functions
6. Update export functions (markdown, TSV, CSV if applicable)
7. Add tests for new field
8. Update documentation

**Adding a new data viewer feature:**
1. Add UI elements in Data Viewer section of `index.html`
2. Implement logic in `calculator.js`
3. Update `displayGroupEntries()` if changing table structure
4. Test with various data sets
5. Update export/import if data structure changes

**Modifying calculations:**
1. Update `calculateResults()` or `calculateMultipleGroupResults()` function
2. Update corresponding tests in `tests.js`
3. Update `docs/calculations.md`
4. Verify all 31+ tests pass
5. Test with edge cases

**Adding animal type or bag type options:**
1. Update bag entry HTML template in `addBagEntry()`
2. Update `getBagData()` to extract new data
3. Update display and export functions to show new data
4. Update CSV import/export to handle new fields
5. Test import/export round-trip

**Changing styling:**
1. Modify `styles.css`
2. Test responsive behavior (mobile, tablet, desktop)
3. Check browser compatibility
4. Verify tab navigation and selection banner still work

**Working with LocalStorage:**
1. Use `StorageModule` functions for all storage operations
2. Always validate data before saving
3. Handle storage quota errors gracefully
4. Preserve data structure compatibility when adding fields
5. Test with large datasets (100+ entries)
6. Test import/export for data migration

## Deployment

### GitHub Pages

The site deploys automatically when changes are pushed to the main branch.

**Setup:**
1. Repository Settings → Pages
2. Source: main branch, / (root) folder
3. Save

**URL:** `https://[username].github.io/volunteer-calculator/`

### Local Testing

Multiple options:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

## Troubleshooting

### Common Issues

**Calculations seem wrong:**
- Check time unit conversion (minutes to hours)
- Verify no rounding before final calculation
- Check for integer division issues
- Verify multiple groups are calculated correctly

**Bag or group entries not working:**
- Ensure unique IDs for each entry
- Check bagCounter and groupCounter increment
- Verify remove buttons exclude first entry
- Check animal type radio button event listeners

**Data Viewer not showing data:**
- Check LocalStorage has data (browser DevTools → Application → LocalStorage)
- Verify group names match exactly (case-sensitive)
- Check date filter range is appropriate
- Try "All Groups" and "All Time" to see everything

**Selection and bulk operations not working:**
- Verify checkboxes are rendering
- Check selection banner z-index and positioning
- Test with different numbers of entries
- Clear selection and try again

**Clipboard copy fails:**
- Check browser permissions (some browsers require user interaction)
- Verify HTTPS for clipboard API (or localhost)
- Test fallback code for older browsers
- Check for malformed data in TSV/CSV generation

**Import not working:**
- Verify CSV format matches export format
- Check for proper quote handling
- Ensure required fields are present
- Look for error messages in browser console

**LocalStorage issues:**
- Check storage quota (5-10MB limit)
- Clear LocalStorage if corrupted: `localStorage.clear()`
- Export data before clearing for backup
- Verify data structure matches expected format

**Tests failing:**
- Check for floating-point precision issues
- Use `assertAlmostEquals()` for decimal comparisons
- Verify test data matches expected structure
- Run `npm run lint` to check for code issues

## Best Practices

### For AI Agents

1. **Read existing code first**: Understand patterns before making changes
2. **Run tests after changes**: Verify nothing breaks (`npm test`)
3. **Test in browser**: Don't rely solely on unit tests, verify UI functionality
4. **Update docs**: Keep README.md, docs/, and AGENT_INSTRUCTIONS.md current
5. **Small commits**: Make incremental, focused changes
6. **Preserve simplicity**: Don't add unnecessary complexity or dependencies
7. **Test data persistence**: Verify LocalStorage operations work correctly
8. **Test both views**: Check Calculator and Data Viewer after changes
9. **Verify exports**: Test markdown, TSV, and CSV export formats
10. **Check responsiveness**: Test mobile, tablet, and desktop layouts

### For Human Developers

1. **Test locally**: Use local server (`npm http-server` or `python -m http.server`)
2. **Check responsive design**: Test on different screen sizes
3. **Validate inputs**: Ensure form validation works for all fields
4. **Review calculations**: Manually verify a few examples
5. **Check browser console**: Look for errors or warnings
6. **Test data flow**: Enter data → Save → View in Data Viewer → Export
7. **Test import/export**: Export data, clear, re-import, verify integrity
8. **Cross-browser testing**: Check Chrome, Firefox, Safari, Edge

## Project Goals

### Primary Goals
- Simple, intuitive user interface with tab navigation
- Accurate calculations for single and multiple groups
- Data persistence with LocalStorage
- Comprehensive data management (save, view, filter, import, export)
- Easy result sharing (multiple export formats)
- Mobile-friendly responsive design
- No external dependencies or frameworks
- Privacy-first (all data stored locally)

### Secondary Goals
- Comprehensive test coverage (31+ tests)
- Clear, up-to-date documentation
- Easy local development
- Accessible to all users (semantic HTML, ARIA labels)
- Fast load times and performance
- Cross-browser compatibility

## Feature Evolution

The application has evolved significantly from its initial version:

**Version 1 (Initial):**
- Single volunteer group input
- Basic bag type tracking
- Simple calculation display
- Markdown export only
- No data persistence

**Current Version:**
- **Multiple volunteer groups** support
- **Animal type classification** (Dog, Cat, Other, custom)
- **Two-view interface** (Calculator and Data Viewer tabs)
- **LocalStorage persistence** with timestamps and IDs
- **Data Viewer** with filtering, selection, and bulk operations
- **Multiple export formats** (Markdown, TSV, CSV)
- **Import capability** with merge and replace modes
- **Selection banner** for bulk operations
- **Date filtering** (all-time, year, 12 months, custom range)
- **Checkbox selection** for individual and bulk operations
- Enhanced UI with responsive design and user feedback

## Important Data Structures

### Entry Object (in LocalStorage)
```javascript
{
  id: "1708356789123",                    // Unique identifier (timestamp)
  timestamp: "2026-02-19T12:34:56.789Z",  // ISO timestamp
  groupName: "Team Alpha",                // Group name
  numVolunteers: 10,                      // Volunteer count
  durationHours: 2.5,                     // Duration in hours
  groups: [...],                           // Array if multiple groups
  bags: [                                  // Bag data with animal types
    {
      count: 20,
      weight: 25,
      animalType: "Dog",                   // NEW: Animal classification
      total: 500
    }
  ],
  totalPounds: 1250,                       // Total pounds processed
  poundsPerVolunteer: 125,                 // Per-volunteer metric
  poundsPerVolunteerPerHour: 50            // Productivity rate
}
```

### LocalStorage Structure
```javascript
{
  "Team Alpha": [entry1, entry2, ...],
  "Team Beta": [entry3, entry4, ...],
  ...
}
```

Key: `volunteerCalculatorData`

## Security and Privacy

- **No server**: All data stored client-side
- **No external requests**: No analytics, no tracking
- **User control**: Users can export and delete their data anytime
- **LocalStorage only**: Data never leaves user's browser
- **CSV import/export**: For backup and migration
- **No authentication**: No accounts, no passwords
- **Privacy-first**: Design principle throughout

## Future Considerations

Potential enhancements to consider (not currently implemented):

- **Charts and Visualizations**: Graphical representation of data over time
- **Advanced Filtering**: Filter by animal type, volunteer count ranges, etc.
- **Data Analytics**: Trends, averages, comparisons over time
- **Print View**: Optimized layout for printing reports
- **Offline PWA**: Progressive Web App for offline functionality
- **Cloud Sync** (optional): Optional backup to cloud storage (user-controlled)
- **Multi-user Collaboration**: Share data across team members
- **Custom Fields**: User-defined fields for specific organizational needs
- **Automated Reports**: Schedule and generate periodic reports
- **Mobile App**: Native mobile application

**Note**: Any future enhancements must maintain:
- Simplicity and ease of use
- No required external dependencies
- User privacy and data control
- Fast performance
- Accessibility standards

## Contact and Support

- **Issues**: Report bugs via GitHub Issues
- **Contributions**: Submit pull requests
- **Questions**: Use GitHub Discussions

---

This file helps AI agents understand the project structure, requirements, and how to make appropriate modifications while maintaining code quality and project goals.