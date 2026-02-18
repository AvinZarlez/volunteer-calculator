# Agent Instructions - Volunteer Calculator

## Project Overview

This is a GitHub Pages-based web application called "Volunteer Calculator" designed to help volunteer coordinators track and calculate pet food packing productivity metrics.

## Purpose

The Volunteer Calculator helps teams measure their volunteer effort by:
1. Recording volunteer group information (name, count, duration)
2. Tracking bags processed (number and weight of different bag types)
3. Calculating productivity metrics (total pounds, per volunteer, per volunteer per hour)
4. Exporting results as markdown tables for reporting

## Core Functionality

### Inputs Required

1. **Name of volunteer group** (text field)
2. **Number of volunteers** (numeric, minimum 1)
3. **Time volunteered** (numeric with unit selector)
   - Can be entered in minutes or hours
   - Must be converted to hours for calculations
4. **Bag data pairs** (dynamic list)
   - Number of bags (numeric, minimum 1)
   - Pounds per bag (numeric, minimum 0.01)
   - At least one pair required
   - "Add Another Bag Type" button to add more pairs
   - Remove button (×) for each pair except the first

### Calculations Performed

1. **Pounds per bag type** = Number of bags × Pounds per bag (for each type)
2. **Total pounds processed** = Sum of all bag type totals
3. **Amount per volunteer** = Total pounds ÷ Number of volunteers
4. **Amount per volunteer per hour** = Amount per volunteer ÷ Hours worked

**Important**: Time must be converted to hours (not rounded) before the per-hour calculation to ensure accuracy.

### Output Display

Results are shown in two sections:
1. **Pounds Processed by Bag Type**: Shows each bag type with its total
2. **Summary Statistics**: Shows the three summary metrics

### Export Feature

A "Copy Results as Markdown Table" button generates a markdown-formatted table containing:
- Input data section (group name, volunteers, time)
- Bags processed section (each bag type with details)
- Summary results section (all calculated metrics)

The markdown is copied to the clipboard for easy pasting into reports.

## Technical Architecture

### Technology Stack
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **GitHub Pages**: Static hosting

### File Structure
- `index.html`: Main application page
- `styles.css`: All styling
- `calculator.js`: Core logic and calculations
- `test.html`: Test runner interface
- `tests.js`: Comprehensive unit test suite
- `README.md`: User documentation
- `docs/README.md`: Technical documentation
- `.vscode/`: VS Code configuration for local development

### Key JavaScript Functions

1. `convertToHours(duration, unit)`: Converts minutes to hours
2. `getBagData()`: Extracts all bag data from form
3. `calculateResults(groupName, numVolunteers, durationHours, bags)`: Main calculation function
4. `displayResults(results)`: Renders results to DOM
5. `generateMarkdownTable(results)`: Creates markdown output
6. `addBagEntry()`: Adds new bag type form fields
7. `removeBagEntry(index)`: Removes a bag type
8. `resetForm()`: Clears all inputs and results

### Data Flow

```
User Input → Form Validation → Time Conversion → Calculations → Results Display
                                                              ↓
                                                    Markdown Generation → Clipboard
```

## Testing

### Test Coverage
- Time conversion (hours/minutes)
- Calculation accuracy (single/multiple bag types)
- Markdown generation and formatting
- Edge cases (single volunteer, small durations, large numbers)
- Data integrity (no input mutation)

### Running Tests
Open `test.html` in a browser. Tests run automatically and display pass/fail results.

## VS Code Integration

The `.vscode` folder contains:
- `settings.json`: Project-specific settings
- `tasks.json`: Tasks for starting a local development server

To test locally:
1. Open VS Code in project directory
2. Run task: "Start Local Server" (Terminal → Run Task)
3. Open browser to `http://localhost:8000`

## Development Guidelines

### When Making Changes

1. **Maintain Simplicity**: No frameworks or build steps required
2. **Test All Changes**: Update or add tests for new functionality
3. **Update Documentation**: Keep README.md and docs/README.md in sync
4. **Preserve Responsiveness**: Test on mobile and desktop
5. **Browser Compatibility**: Support modern browsers (last 2 versions)

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
1. Add HTML input in `index.html`
2. Extract value in `handleCalculate()` function
3. Pass to `calculateResults()` function
4. Update results object structure
5. Update display in `displayResults()`
6. Update markdown in `generateMarkdownTable()`
7. Add tests for new field

**Modifying calculations:**
1. Update `calculateResults()` function
2. Update corresponding tests
3. Update technical documentation
4. Verify all tests pass

**Changing styling:**
1. Modify `styles.css`
2. Test responsive behavior
3. Check browser compatibility

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

**Bag entries not working:**
- Ensure unique IDs for each entry
- Check bagCounter increment
- Verify remove button excludes first entry

**Clipboard copy fails:**
- Check browser permissions
- Verify fallback code for older browsers
- Test HTTPS requirement for clipboard API

**Tests failing:**
- Check for floating-point precision issues
- Use `assertAlmostEquals()` for decimal comparisons
- Verify test data matches expected structure

## Best Practices

### For AI Agents

1. **Read existing code first**: Understand patterns before making changes
2. **Run tests after changes**: Verify nothing breaks
3. **Test in browser**: Don't rely solely on unit tests
4. **Update docs**: Keep documentation current
5. **Small commits**: Make incremental, focused changes
6. **Preserve simplicity**: Don't add unnecessary complexity

### For Human Developers

1. **Test locally**: Use VS Code tasks or local server
2. **Check responsive design**: Test on different screen sizes
3. **Validate inputs**: Ensure form validation works
4. **Review calculations**: Manually verify a few examples
5. **Check browser console**: Look for errors or warnings

## Project Goals

### Primary Goals
- Simple, intuitive user interface
- Accurate calculations
- Easy result sharing (markdown export)
- Mobile-friendly design
- No external dependencies

### Secondary Goals
- Comprehensive test coverage
- Clear documentation
- Easy local development
- Accessible to all users
- Fast load times

## Future Considerations

Potential enhancements documented in `docs/README.md` under "Future Enhancements" section. Consider:
- Data persistence (localStorage)
- Result history
- Comparison features
- Visualization/charts
- Print-friendly view
- Offline support (PWA)

## Contact and Support

- **Issues**: Report bugs via GitHub Issues
- **Contributions**: Submit pull requests
- **Questions**: Use GitHub Discussions

---

This file helps AI agents understand the project structure, requirements, and how to make appropriate modifications while maintaining code quality and project goals.