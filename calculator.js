// Volunteer Calculator JavaScript

// State management
let bagCounter = 1;

// Initialize on page load (only in browser)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
    });
}

// Event Listeners
function initializeEventListeners() {
    document.getElementById('volunteerForm').addEventListener('submit', handleCalculate);
    document.getElementById('addBagBtn').addEventListener('click', addBagEntry);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('copyBtn').addEventListener('click', copyResultsToClipboard);
}

// Add a new bag entry
function addBagEntry() {
    const bagsList = document.getElementById('bagsList');
    const newBagEntry = document.createElement('div');
    newBagEntry.className = 'bag-entry';
    newBagEntry.setAttribute('data-bag-index', bagCounter);
    
    newBagEntry.innerHTML = `
        <div class="bag-fields">
            <div class="form-group">
                <label for="bagCount${bagCounter}">Number of Bags:</label>
                <input type="number" class="bag-count" id="bagCount${bagCounter}" min="1" required>
            </div>
            <div class="form-group">
                <label for="bagWeight${bagCounter}">Pounds per Bag:</label>
                <input type="number" class="bag-weight" id="bagWeight${bagCounter}" min="0.01" step="0.01" required>
            </div>
        </div>
        <button type="button" class="remove-bag-btn" onclick="removeBagEntry(${bagCounter})">×</button>
    `;
    
    bagsList.appendChild(newBagEntry);
    bagCounter++;
}

// Remove a bag entry
// eslint-disable-next-line no-unused-vars
function removeBagEntry(index) {
    const bagEntry = document.querySelector(`[data-bag-index="${index}"]`);
    if (bagEntry) {
        bagEntry.remove();
    }
}

// Validate form inputs with detailed error messages
function validateInputs(groupName, numVolunteers, duration, bags) {
    const errors = [];
    
    // Validate group name
    if (!groupName || groupName.trim() === '') {
        errors.push('Please enter a volunteer group name.');
    }
    
    // Validate number of volunteers
    if (!numVolunteers || isNaN(numVolunteers) || numVolunteers < 1) {
        errors.push('Please enter a valid number of volunteers (at least 1).');
    }
    
    // Validate duration
    if (!duration || isNaN(duration) || duration <= 0) {
        errors.push('Please enter a valid time duration (greater than 0).');
    }
    
    // Validate bags
    if (!bags || bags.length === 0) {
        errors.push('Please enter at least one bag type with valid numbers.');
    } else {
        // Check each bag entry
        const bagEntries = document.querySelectorAll('.bag-entry');
        bagEntries.forEach((entry, index) => {
            const bagIndex = entry.getAttribute('data-bag-index');
            const countInput = document.getElementById(`bagCount${bagIndex}`);
            const weightInput = document.getElementById(`bagWeight${bagIndex}`);
            
            if (countInput && weightInput) {
                const count = countInput.value;
                const weight = weightInput.value;
                
                if (!count || count.trim() === '') {
                    errors.push(`Bag type ${index + 1}: Please enter the number of bags.`);
                }
                if (!weight || weight.trim() === '') {
                    errors.push(`Bag type ${index + 1}: Please enter the pounds per bag.`);
                }
            }
        });
    }
    
    return errors;
}

// Display validation errors to user
function showValidationErrors(errors) {
    const errorMessage = 'Please correct the following:\n\n' + errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n');
    alert(errorMessage);
}

// Convert time to hours
function convertToHours(duration, unit) {
    if (unit === 'minutes') {
        return duration / 60;
    }
    return duration;
}

// Get all bag data from the form
function getBagData() {
    const bagEntries = document.querySelectorAll('.bag-entry');
    const bags = [];
    
    bagEntries.forEach((entry) => {
        const index = entry.getAttribute('data-bag-index');
        const countInput = document.getElementById(`bagCount${index}`);
        const weightInput = document.getElementById(`bagWeight${index}`);
        
        if (countInput && weightInput) {
            const count = parseFloat(countInput.value);
            const weight = parseFloat(weightInput.value);
            
            if (!isNaN(count) && !isNaN(weight) && count > 0 && weight > 0) {
                bags.push({
                    count: count,
                    weight: weight
                });
            }
        }
    });
    
    return bags;
}

// Calculate results
function calculateResults(groupName, numVolunteers, durationHours, bags) {
    const results = {
        groupName: groupName,
        numVolunteers: numVolunteers,
        durationHours: durationHours,
        bagResults: [],
        totalPounds: 0,
        poundsPerVolunteer: 0,
        poundsPerVolunteerPerHour: 0
    };
    
    // Calculate pounds per bag type
    bags.forEach((bag, index) => {
        const totalForBagType = bag.count * bag.weight;
        results.bagResults.push({
            bagType: index + 1,
            count: bag.count,
            weight: bag.weight,
            total: totalForBagType
        });
        results.totalPounds += totalForBagType;
    });
    
    // Calculate per volunteer metrics
    results.poundsPerVolunteer = results.totalPounds / numVolunteers;
    results.poundsPerVolunteerPerHour = results.poundsPerVolunteer / durationHours;
    
    return results;
}

// Display results
function displayResults(results) {
    const resultsContent = document.getElementById('resultsContent');
    
    let html = '<div class="result-group">';
    html += '<h3>Pounds Processed by Bag Type</h3>';
    
    results.bagResults.forEach((bag) => {
        html += `
            <div class="result-item">
                <span class="result-label">Bag Type ${bag.bagType} (${bag.count} bags × ${bag.weight} lbs):</span>
                <span class="result-value">${bag.total.toFixed(2)} lbs</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += '<div class="result-group">';
    html += '<h3>Summary Statistics</h3>';
    html += `
        <div class="result-item">
            <span class="result-label">Total Pet Food Processed:</span>
            <span class="result-value">${results.totalPounds.toFixed(2)} lbs</span>
        </div>
        <div class="result-item">
            <span class="result-label">Amount Processed per Volunteer:</span>
            <span class="result-value">${results.poundsPerVolunteer.toFixed(2)} lbs</span>
        </div>
        <div class="result-item">
            <span class="result-label">Amount Processed per Volunteer per Hour:</span>
            <span class="result-value">${results.poundsPerVolunteerPerHour.toFixed(2)} lbs/hour</span>
        </div>
    `;
    html += '</div>';
    
    resultsContent.innerHTML = html;
    document.getElementById('resultsSection').style.display = 'block';
}

// Generate markdown table
function generateMarkdownTable(results) {
    let markdown = `# ${results.groupName} - Volunteer Results\n\n`;
    markdown += `## Input Data\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Volunteer Group | ${results.groupName} |\n`;
    markdown += `| Number of Volunteers | ${results.numVolunteers} |\n`;
    markdown += `| Time Volunteered | ${results.durationHours.toFixed(2)} hours |\n\n`;
    
    markdown += `## Bags Processed\n\n`;
    markdown += `| Bag Type | Number of Bags | Pounds per Bag | Total Pounds |\n`;
    markdown += `|----------|----------------|----------------|-------------|\n`;
    
    results.bagResults.forEach((bag) => {
        markdown += `| Type ${bag.bagType} | ${bag.count} | ${bag.weight} lbs | ${bag.total.toFixed(2)} lbs |\n`;
    });
    
    markdown += `\n## Summary Results\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Total Pet Food Processed | ${results.totalPounds.toFixed(2)} lbs |\n`;
    markdown += `| Amount per Volunteer | ${results.poundsPerVolunteer.toFixed(2)} lbs |\n`;
    markdown += `| Amount per Volunteer per Hour | ${results.poundsPerVolunteerPerHour.toFixed(2)} lbs/hour |\n`;
    
    return markdown;
}

// Handle form submission
function handleCalculate(event) {
    event.preventDefault();
    
    // Get input values
    const groupName = document.getElementById('groupName').value.trim();
    const numVolunteersInput = document.getElementById('numVolunteers').value;
    const durationInput = document.getElementById('duration').value;
    const timeUnit = document.getElementById('timeUnit').value;
    const bags = getBagData();
    
    const numVolunteers = parseInt(numVolunteersInput);
    const duration = parseFloat(durationInput);
    
    // Validate inputs with detailed error messages
    const errors = validateInputs(groupName, numVolunteers, duration, bags);
    
    if (errors.length > 0) {
        showValidationErrors(errors);
        return;
    }
    
    // Convert duration to hours
    const durationHours = convertToHours(duration, timeUnit);
    
    // Calculate results
    const results = calculateResults(groupName, numVolunteers, durationHours, bags);
    
    // Store results for clipboard
    window.calculationResults = results;
    
    // Display results
    displayResults(results);
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// Copy results to clipboard
async function copyResultsToClipboard() {
    if (!window.calculationResults) {
        alert('Please calculate results first.');
        return;
    }
    
    const markdown = generateMarkdownTable(window.calculationResults);
    
    try {
        await navigator.clipboard.writeText(markdown);
        showCopyFeedback();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = markdown;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback();
        } catch (err) {
            alert('Failed to copy to clipboard. Please try again.');
        }
        
        document.body.removeChild(textArea);
    }
}

// Show copy feedback
function showCopyFeedback() {
    const feedback = document.getElementById('copyFeedback');
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2000);
}

// Reset form
function resetForm() {
    document.getElementById('volunteerForm').reset();
    document.getElementById('resultsSection').style.display = 'none';
    
    // Remove all bag entries except the first one
    const bagsList = document.getElementById('bagsList');
    const bagEntries = bagsList.querySelectorAll('.bag-entry');
    
    bagEntries.forEach((entry, index) => {
        if (index > 0) {
            entry.remove();
        }
    });
    
    // Reset counter
    bagCounter = 1;
    
    // Clear results
    window.calculationResults = null;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToHours,
        calculateResults,
        generateMarkdownTable
    };
}
