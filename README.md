# 🐾 Volunteer Calculator

A simple, intuitive web application for calculating volunteer pet food packing effort and productivity metrics.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://avinzarlez.github.io/volunteer-calculator/)
[![CI/CD Pipeline](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/deploy.yml/badge.svg)](https://github.com/AvinZarlez/volunteer-calculator/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Overview

The Volunteer Calculator helps volunteer coordinators and team leaders track and measure the productivity of pet food packing efforts. Simply enter your team's information and bag processing data, and get instant calculations of total output and per-volunteer metrics.

## ✨ Features

- **Easy Input Form**: Enter volunteer group name, number of volunteers, and time spent
- **Flexible Time Units**: Input time in either hours or minutes
- **Animal Type Selection**: Choose Dog, Cat, or Other (with custom type option) for each bag type
- **Dynamic Bag Types**: Add any number of bag types with different weights
- **Instant Calculations**: Get immediate results with detailed breakdowns
- **Persistent Storage**: Save calculation results to local browser storage
- **Data Viewer**: View, manage, and delete saved entries by volunteer group
- **Manual Save Option**: Choose when to save data with a dedicated Save Data button
- **Markdown Export**: Copy results as a formatted markdown table for reports
- **Spreadsheet Export**: Copy data in tab-separated format for Excel/Google Sheets
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **No Installation Required**: Runs entirely in your web browser

## 🚀 Quick Start

### Using the Live Version

Visit [https://avinzarlez.github.io/volunteer-calculator/](https://avinzarlez.github.io/volunteer-calculator/) and start calculating immediately!

### Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/AvinZarlez/volunteer-calculator.git
   cd volunteer-calculator
   ```

2. Open `index.html` in your web browser, or use a local server:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (with http-server package)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## 📖 How to Use

### Step 1: Enter Volunteer Information

1. **Group Name**: Enter the name of your volunteer group or team
2. **Number of Volunteers**: Enter how many volunteers participated
3. **Time Volunteered**: Enter the duration and select hours or minutes

### Step 2: Enter Bag Data

1. Start with the first bag type (pre-filled)
2. Select the **Bag Type**: Choose Dog, Cat, or Other
   - If you select "Other", you can specify a custom type (e.g., "Bird")
   - Leaving the custom field blank will save as "Other"
3. Enter the **Number of Bags** processed
4. Enter the **Pounds per Bag** weight
5. Click **"+ Add Another Bag Type"** to add more bag types if needed
6. Repeat for each different bag size your team processed

### Step 3: Calculate and Save Results

1. Click the **"Calculate"** button
2. View your results including:
   - Pounds processed for each bag type (with animal type)
   - Total pet food processed
   - Amount per volunteer
   - Amount per volunteer per hour
3. Click the **"💾 Save Data"** button to save results to local storage (optional)
   - Results are indexed by volunteer group name
   - Saved results persist across browser sessions

### Step 4: View Saved Data

1. Click the **"Data Viewer"** tab at the top
2. Select a volunteer group from the dropdown
3. View all saved entries with timestamps and bag type details
4. Copy individual entries or all entries to clipboard for spreadsheet use
5. Delete unwanted entries (requires two confirmations for safety)

### Step 5: Export Results (Optional)

Click **"📋 Copy Results as Markdown Table"** to copy a formatted table to your clipboard. Paste it into:

- GitHub issues or pull requests
- Markdown documents
- Team reports
- Email messages

From the Data Viewer, you can also:

- Copy individual entries in tab-separated format for spreadsheets
- Copy all entries for a group at once

## 📊 Example Usage

**Scenario**: A team of 8 volunteers worked for 2.5 hours and processed:

- 20 bags of 25 lbs each
- 15 bags of 50 lbs each

**Results**:

- Bag Type 1: 500 lbs
- Bag Type 2: 750 lbs
- Total: 1,250 lbs
- Per Volunteer: 156.25 lbs
- Per Volunteer Per Hour: 62.50 lbs/hour

## 🧪 Testing

The project includes comprehensive unit tests with 31 test cases covering all functionality.

### Running Tests Locally

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run linting
npm run lint
```

### Continuous Integration

All tests and linting run automatically via GitHub Actions on every push and pull request. The CI pipeline ensures code quality and test coverage before merging.

**Test Coverage:**

- Time conversion (6 tests)
- Calculations (6 tests)
- Markdown generation (5 tests)
- Edge cases (5 tests)
- Data integrity (3 tests)
- Input validation (6 tests)

## 📚 Documentation

- **User Guide**: This README (you are here)
- **Technical Documentation**: For developers and contributors, see the [Documentation Hub](docs/README.md) which provides comprehensive technical documentation including:
  - Architecture & File Structure
  - Core Components
  - Calculation Algorithms
  - Testing Strategy
  - GitHub Pages Setup
  - Browser Compatibility
  - Customization Guide
- **AI Agent Instructions**: See [AGENT_INSTRUCTIONS.md](AGENT_INSTRUCTIONS.md) for AI agent guidance

## 🛠️ Technology Stack

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern features (Grid, Flexbox, animations)
- **Vanilla JavaScript**: No frameworks, pure JS for maximum compatibility
- **GitHub Pages**: Free hosting with automatic deployment
- **GitHub Actions**: CI/CD pipeline for automated testing and linting
- **ESLint**: Code quality and style checking
- **Node.js**: Test execution environment

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting locally:
   ```bash
   npm install    # Install dependencies
   npm run lint   # Check code quality
   npm test       # Run all tests
   ```
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Note:** All pull requests must pass the automated CI checks (linting and tests) before they can be merged.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for volunteer coordinators tracking pet food packing efforts
- Designed with simplicity and ease-of-use in mind
- Inspired by the need for quick, accurate volunteer productivity metrics

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AvinZarlez/volunteer-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AvinZarlez/volunteer-calculator/discussions)

---

Made with ❤️ for volunteers making a difference in pet welfare
