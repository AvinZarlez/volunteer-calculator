// Volunteer Calculator JavaScript

// State management
let bagCounter = 1;
let groupCounter = 1;
let currentView = 'calculator'; // 'calculator' or 'dataViewer' // eslint-disable-line no-unused-vars
let selectedEntries = new Map(); // Track selected entry IDs mapped to their group names
let currentGroupName = ''; // Track current group being viewed
let currentEntries = []; // Track current entries being displayed

// Constants
const DEFAULT_BAG_TYPE = 'Dog';
const STORAGE_KEY = 'volunteerCalculatorData';
const DECIMAL_PLACES = 2;
const UNIT_WEIGHT = 'lbs';
const UNIT_RATE = 'lbs/hour';

// Unified header fields for CSV and TSV export
const HEADER_FIELDS = [
    'Group Name',
    'Date',
    'Volunteers',
    'Hours',
    'Bag Types',
    'Total Pounds',
    'Pounds per Volunteer',
    'Pounds per Volunteer per Hour'
];

// Get TSV header
function getTSVHeader() {
    return HEADER_FIELDS.join('\t') + '\n';
}

// Get CSV header
function getCSVHeader() {
    return HEADER_FIELDS.join(',');
}

// Local Storage Module
const StorageModule = {
    // Save a calculation result
    save: function(result) {
        const timestamp = new Date().toISOString();
        const entry = {
            ...result,
            timestamp: timestamp,
            id: Date.now() + '-' + Math.random() // Unique ID for each entry
        };
        
        const allData = this.getAll();
        const groupName = trimGroupName(result.groupName);
        
        if (!allData[groupName]) {
            allData[groupName] = [];
        }
        
        allData[groupName].push(entry);
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    // Get all data
    getAll: function() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
            return {};
        }
    },
    
    // Get entries for a specific group
    getGroup: function(groupName) {
        const allData = this.getAll();
        return allData[trimGroupName(groupName)] || [];
    },
    
    // Get all group names
    getGroupNames: function() {
        const allData = this.getAll();
        return Object.keys(allData).sort();
    },
    
    // Delete a specific entry
    deleteEntry: function(groupName, entryId) {
        const allData = this.getAll();
        const groupData = allData[trimGroupName(groupName)];
        
        if (!groupData) return false;
        
        const index = groupData.findIndex(entry => entry.id === entryId);
        if (index === -1) return false;
        
        groupData.splice(index, 1);
        
        // Remove group if empty
        if (groupData.length === 0) {
            delete allData[trimGroupName(groupName)];
        }
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            return true;
        } catch (e) {
            console.error('Failed to delete from localStorage:', e);
            return false;
        }
    },
    
    // Clear all data (for testing)
    clear: function() {
        localStorage.removeItem(STORAGE_KEY);
    },
    
    // Import all data (replaces existing data)
    importAll: function(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to import data to localStorage:', e);
            return false;
        }
    }
};

// Helper Functions
// Format a number to specified decimal places
function formatNumber(num, places = DECIMAL_PLACES) {
    return num.toFixed(places);
}

// Format bag types for display
function formatBagTypes(bagResults) {
    if (!bagResults || bagResults.length === 0) {
        return 'N/A';
    }
    return bagResults.map(bag => `${bag.type || DEFAULT_BAG_TYPE} (${bag.count})`).join(', ');
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Trim group name
function trimGroupName(name) {
    return name.trim();
}

// Clear data viewer UI
function clearDataViewerUI() {
    document.getElementById('dataTableBody').innerHTML = '';
    document.getElementById('dataViewerActions').style.display = 'none';
    const summaryDiv = document.getElementById('groupSummary');
    if (summaryDiv) {
        summaryDiv.style.display = 'none';
    }
}

// Date Filter Functions
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// eslint-disable-next-line no-unused-vars
function setToday(inputId) {
    const dateInput = document.getElementById(inputId);
    if (dateInput) {
        dateInput.value = formatDateForInput(new Date());
        
        // Trigger change event to reload data
        loadGroupData();
    }
}

function getDateFilterRange() {
    const filterType = document.getElementById('dateFilterType').value;
    const now = new Date();
    
    let startDate = null;
    let endDate = null;
    
    switch (filterType) {
    case 'all':
        // No filtering
        return { startDate: null, endDate: null };
        
    case 'calendar-year': {
        // From January 1st of current year to now
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
    }
        
    case 'last-12-months': {
        // From 12 months ago to now
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 12);
        endDate = now;
        break;
    }
        
    case 'custom': {
        // Use custom date inputs
        const startInput = document.getElementById('startDate').value;
        const endInput = document.getElementById('endDate').value;
        
        if (startInput) {
            startDate = new Date(startInput + 'T00:00:00');
        }
        
        if (endInput) {
            endDate = new Date(endInput + 'T23:59:59.999');
        }
        break;
    }
    }
    
    return { startDate, endDate };
}

function filterEntriesByDate(entries) {
    const { startDate, endDate } = getDateFilterRange();
    
    // If no date filter is applied, return all entries
    if (!startDate && !endDate) {
        return entries;
    }
    
    return entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        
        // Check if entry is within date range
        if (startDate && entryDate < startDate) {
            return false;
        }
        if (endDate && entryDate > endDate) {
            return false;
        }
        
        return true;
    });
}

// Initialize on page load (only in browser)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
        initializeViewSwitching();
    });
}

// Event Listeners
function initializeEventListeners() {
    document.getElementById('volunteerForm').addEventListener('submit', handleCalculate);
    document.getElementById('addBagBtn').addEventListener('click', addBagEntry);
    document.getElementById('addGroupBtn').addEventListener('click', addGroupEntry);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('copyBtn').addEventListener('click', copyResultsToClipboard);
    document.getElementById('copyEntriesBtn').addEventListener('click', copyEntriesToSpreadsheet);
    
    // Setup bag type listeners for initial bag (index 0)
    setupBagTypeListeners(0);
}

// Setup bag type radio button listeners
function setupBagTypeListeners(bagIndex) {
    const radios = document.querySelectorAll(`input[name="bagType${bagIndex}"]`);
    const otherInput = document.getElementById(`bagTypeOther${bagIndex}`);
    
    if (!otherInput) return;
    
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Other') {
                otherInput.style.display = 'block';
            } else {
                otherInput.style.display = 'none';
                otherInput.value = '';
            }
        });
    });
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
            <div class="form-group bag-type-group">
                <label>Bag Type:</label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="bagType${bagCounter}" value="Dog" class="bag-type-radio" checked>
                        <span>Dog</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="bagType${bagCounter}" value="Cat" class="bag-type-radio">
                        <span>Cat</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="bagType${bagCounter}" value="Other" class="bag-type-radio">
                        <span>Other</span>
                    </label>
                </div>
                <input type="text" class="bag-type-other" id="bagTypeOther${bagCounter}" placeholder="Specify type (e.g., Bird)" style="display: none;">
            </div>
        </div>
        <button type="button" class="remove-bag-btn" onclick="removeBagEntry(${bagCounter})">×</button>
    `;
    
    bagsList.appendChild(newBagEntry);
    
    // Add event listeners for the new bag type radio buttons
    setupBagTypeListeners(bagCounter);
    
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

// Add a new group entry
function addGroupEntry() {
    const groupsList = document.getElementById('groupsList');
    const newGroupEntry = document.createElement('div');
    newGroupEntry.className = 'group-entry';
    newGroupEntry.setAttribute('data-group-index', groupCounter);
    
    newGroupEntry.innerHTML = `
        <div class="group-fields">
            <div class="form-group">
                <label for="groupName${groupCounter}">Name of Volunteer Group:</label>
                <input type="text" class="group-name" id="groupName${groupCounter}" required>
            </div>
            <div class="form-group">
                <label for="numVolunteers${groupCounter}">Number of Volunteers:</label>
                <input type="number" class="num-volunteers" id="numVolunteers${groupCounter}" min="1" required>
            </div>
        </div>
        <button type="button" class="remove-group-btn" onclick="removeGroupEntry(${groupCounter})">×</button>
    `;
    
    groupsList.appendChild(newGroupEntry);
    groupCounter++;
}

// Remove a group entry
// eslint-disable-next-line no-unused-vars
function removeGroupEntry(index) {
    // Prevent removing the last group
    const groupEntries = document.querySelectorAll('.group-entry');
    if (groupEntries.length <= 1) {
        alert('At least one volunteer group is required.');
        return;
    }
    
    const groupEntry = document.querySelector(`[data-group-index="${index}"]`);
    if (groupEntry) {
        groupEntry.remove();
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
        const typeRadios = document.querySelectorAll(`input[name="bagType${index}"]:checked`);
        const otherInput = document.getElementById(`bagTypeOther${index}`);
        
        if (countInput && weightInput && typeRadios.length > 0) {
            const count = parseFloat(countInput.value);
            const weight = parseFloat(weightInput.value);
            let bagType = typeRadios[0].value;
            
            // If "Other" is selected, use custom value or default to "Other"
            if (bagType === 'Other') {
                const customType = otherInput ? otherInput.value.trim() : '';
                bagType = customType || 'Other';
            }
            
            if (!isNaN(count) && !isNaN(weight) && count > 0 && weight > 0) {
                bags.push({
                    count: count,
                    weight: weight,
                    type: bagType
                });
            }
        }
    });
    
    return bags;
}

// Normalize group name to Title Case
function normalizeGroupName(name) {
    return name.trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Get all group data from the form
function getGroupData() {
    const groupEntries = document.querySelectorAll('.group-entry');
    const groups = [];
    const seenNames = new Set();
    
    groupEntries.forEach((entry) => {
        const index = entry.getAttribute('data-group-index');
        const nameInput = document.getElementById(`groupName${index}`);
        const volunteersInput = document.getElementById(`numVolunteers${index}`);
        
        if (nameInput && volunteersInput) {
            const name = nameInput.value.trim();
            const volunteers = parseInt(volunteersInput.value);
            
            if (name && !isNaN(volunteers) && volunteers > 0) {
                // Normalize the name to Title Case
                const normalizedName = normalizeGroupName(name);
                
                // Check for duplicate names
                if (seenNames.has(normalizedName.toLowerCase())) {
                    alert(`Duplicate group name detected: "${normalizedName}"\n\nEach volunteer group must have a unique name.`);
                    throw new Error('Duplicate group name');
                }
                
                seenNames.add(normalizedName.toLowerCase());
                
                groups.push({
                    name: normalizedName,
                    volunteers: volunteers
                });
            }
        }
    });
    
    return groups;
}

// Calculate results for multiple groups
function calculateMultipleGroupResults(groups, durationHours, bags) {
    const results = {
        durationHours: durationHours,
        bagResults: [],
        groupResults: [],
        totalPounds: 0,
        totalVolunteers: 0,
        totalPoundsPerVolunteer: 0,
        totalPoundsPerVolunteerPerHour: 0
    };
    
    // Calculate pounds per bag type (shared across all groups)
    bags.forEach((bag, index) => {
        const totalForBagType = bag.count * bag.weight;
        results.bagResults.push({
            bagType: index + 1,
            count: bag.count,
            weight: bag.weight,
            type: bag.type || DEFAULT_BAG_TYPE,
            total: totalForBagType
        });
        results.totalPounds += totalForBagType;
    });
    
    // Calculate per group metrics
    groups.forEach((group) => {
        // Guard against division by zero
        if (group.volunteers <= 0) {
            return; // Skip invalid groups
        }
        
        const poundsPerVolunteer = results.totalPounds / group.volunteers;
        const poundsPerVolunteerPerHour = poundsPerVolunteer / durationHours;
        
        results.groupResults.push({
            groupName: group.name,
            numVolunteers: group.volunteers,
            durationHours: durationHours,
            bagResults: [...results.bagResults], // Clone bag results for each group
            totalPounds: results.totalPounds, // Each group processed all bags
            poundsPerVolunteer: poundsPerVolunteer,
            poundsPerVolunteerPerHour: poundsPerVolunteerPerHour
        });
        
        results.totalVolunteers += group.volunteers;
    });
    
    // Calculate overall totals - guard against division by zero
    if (results.totalVolunteers > 0) {
        results.totalPoundsPerVolunteer = results.totalPounds / results.totalVolunteers;
        results.totalPoundsPerVolunteerPerHour = results.totalPoundsPerVolunteer / durationHours;
    }
    
    return results;
}

// Calculate results (legacy single group)
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
            type: bag.type || DEFAULT_BAG_TYPE,
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
    
    let html = '';
    
    // Show save banner at the top
    html += '<div class="save-banner">';
    html += '<button type="button" id="saveDataBtn" class="btn-save">💾 Save Data</button>';
    html += '<div id="saveFeedback" class="save-feedback" style="display: none;"></div>';
    html += '</div>';
    
    html += '<div class="result-group">';
    html += '<h3>Pounds Processed by Bag Type</h3>';
    
    results.bagResults.forEach((bag) => {
        html += `
            <div class="result-item">
                <span class="result-label">${bag.type} - Bag Type ${bag.bagType} (${bag.count} bags × ${bag.weight} lbs):</span>
                <span class="result-value">${formatNumber(bag.total)} lbs</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Check if this is a multiple group result
    if (results.groupResults && results.groupResults.length >= 1) {
        // Display per-group statistics
        results.groupResults.forEach((groupResult, index) => {
            html += '<div class="result-group">';
            html += `<h3>Group ${index + 1}: ${groupResult.groupName}</h3>`;
            html += `
                <div class="result-item">
                    <span class="result-label">Number of Volunteers:</span>
                    <span class="result-value">${groupResult.numVolunteers}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Amount Processed per Volunteer:</span>
                    <span class="result-value">${formatNumber(groupResult.poundsPerVolunteer)} lbs</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Amount Processed per Volunteer per Hour:</span>
                    <span class="result-value">${formatNumber(groupResult.poundsPerVolunteerPerHour)} lbs/hour</span>
                </div>
            `;
            html += '</div>';
        });
        
        // Display combined totals only if multiple groups
        if (results.groupResults.length > 1) {
            html += '<div class="result-group total-results">';
            html += '<h3>Combined Total</h3>';
            html += `
                <div class="result-item">
                    <span class="result-label">Total Pet Food Processed:</span>
                    <span class="result-value">${formatNumber(results.totalPounds)} lbs</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Volunteers (All Groups):</span>
                    <span class="result-value">${results.totalVolunteers}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Average per Volunteer (All Groups):</span>
                    <span class="result-value">${formatNumber(results.totalPoundsPerVolunteer)} lbs</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Average per Volunteer per Hour (All Groups):</span>
                    <span class="result-value">${formatNumber(results.totalPoundsPerVolunteerPerHour)} lbs/hour</span>
                </div>
            `;
            html += '</div>';
        }
    } else {
        // Single group - display as before
        html += '<div class="result-group">';
        html += '<h3>Summary Statistics</h3>';
        html += `
            <div class="result-item">
                <span class="result-label">Total Pet Food Processed:</span>
                <span class="result-value">${formatNumber(results.totalPounds)} lbs</span>
            </div>
            <div class="result-item">
                <span class="result-label">Amount Processed per Volunteer:</span>
                <span class="result-value">${formatNumber(results.poundsPerVolunteer)} lbs</span>
            </div>
            <div class="result-item">
                <span class="result-label">Amount Processed per Volunteer per Hour:</span>
                <span class="result-value">${formatNumber(results.poundsPerVolunteerPerHour)} lbs/hour</span>
            </div>
        `;
        html += '</div>';
    }
    
    resultsContent.innerHTML = html;
    document.getElementById('resultsSection').style.display = 'block';
    
    // Remove existing listener if any to prevent duplicates
    const saveBtn = document.getElementById('saveDataBtn');
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    // Attach save button event listener
    newSaveBtn.addEventListener('click', saveCalculationData);
}

// Save calculation data to localStorage
function saveCalculationData() {
    if (!window.calculationResults) {
        showSaveFeedback('No calculation data to save', false);
        return;
    }
    
    const results = window.calculationResults;
    
    // Check if this is multiple groups
    if (results.groupResults && results.groupResults.length > 0) {
        // Save each group separately (don't save totals)
        let allSaved = true;
        results.groupResults.forEach(groupResult => {
            const saved = StorageModule.save(groupResult);
            if (!saved) {
                allSaved = false;
            }
        });
        
        if (allSaved) {
            showSaveFeedback(`✓ Data saved successfully for ${results.groupResults.length} group(s)!`, true);
            // Disable the save button after successful save
            const saveBtn = document.getElementById('saveDataBtn');
            saveBtn.disabled = true;
            saveBtn.textContent = '✓ Saved';
            if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
        } else {
            showSaveFeedback('⚠ Failed to save some group data', false);
        }
    } else {
        // Single group - save as before
        const saved = StorageModule.save(results);
        
        if (saved) {
            showSaveFeedback('✓ Data saved successfully!', true);
            // Disable the save button after successful save
            const saveBtn = document.getElementById('saveDataBtn');
            saveBtn.disabled = true;
            saveBtn.textContent = '✓ Saved';
            if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
        } else {
            showSaveFeedback('⚠ Failed to save data', false);
        }
    }
}

// Show save feedback message
function showSaveFeedback(message, success) {
    const feedback = document.getElementById('saveFeedback');
    feedback.textContent = message;
    feedback.className = `save-feedback ${success ? 'success' : 'error'}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Generate markdown table
function generateMarkdownTable(results) {
    // Handle multiple groups result structure
    if (results.groupResults && results.groupResults.length > 0) {
        let markdown = `# Volunteer Results\n\n`;
        markdown += `## Input Data\n\n`;
        markdown += `| Metric | Value |\n`;
        markdown += `|--------|-------|\n`;
        markdown += `| Time Volunteered | ${formatNumber(results.durationHours)} hours |\n\n`;
        
        markdown += `## Bags Processed\n\n`;
        markdown += `| Animal Type | Bag Number | Number of Bags | Pounds per Bag | Total Pounds |\n`;
        markdown += `|-------------|------------|----------------|----------------|-------------|\n`;
        
        results.bagResults.forEach((bag) => {
            markdown += `| ${bag.type} | Type ${bag.bagType} | ${bag.count} | ${bag.weight} lbs | ${formatNumber(bag.total)} lbs |\n`;
        });
        
        // Per-group results
        markdown += `\n## Per-Group Results\n\n`;
        markdown += `| Group Name | Volunteers | Pounds/Volunteer | Pounds/Vol/Hour |\n`;
        markdown += `|------------|------------|------------------|------------------|\n`;
        
        results.groupResults.forEach((groupResult) => {
            markdown += `| ${groupResult.groupName} | ${groupResult.numVolunteers} | ${formatNumber(groupResult.poundsPerVolunteer)} lbs | ${formatNumber(groupResult.poundsPerVolunteerPerHour)} lbs/hour |\n`;
        });
        
        // Combined totals if multiple groups
        if (results.groupResults.length > 1) {
            markdown += `\n## Combined Totals\n\n`;
            markdown += `| Metric | Value |\n`;
            markdown += `|--------|-------|\n`;
            markdown += `| Total Pet Food Processed | ${formatNumber(results.totalPounds)} lbs |\n`;
            markdown += `| Total Volunteers | ${results.totalVolunteers} |\n`;
            markdown += `| Average per Volunteer | ${formatNumber(results.totalPoundsPerVolunteer)} lbs |\n`;
            markdown += `| Average per Volunteer per Hour | ${formatNumber(results.totalPoundsPerVolunteerPerHour)} lbs/hour |\n`;
        }
        
        return markdown;
    }
    
    // Legacy single group structure
    let markdown = `# ${results.groupName} - Volunteer Results\n\n`;
    markdown += `## Input Data\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Volunteer Group | ${results.groupName} |\n`;
    markdown += `| Number of Volunteers | ${results.numVolunteers} |\n`;
    markdown += `| Time Volunteered | ${formatNumber(results.durationHours)} hours |\n\n`;
    
    markdown += `## Bags Processed\n\n`;
    markdown += `| Animal Type | Bag Number | Number of Bags | Pounds per Bag | Total Pounds |\n`;
    markdown += `|-------------|------------|----------------|----------------|-------------|\n`;
    
    results.bagResults.forEach((bag) => {
        markdown += `| ${bag.type} | Type ${bag.bagType} | ${bag.count} | ${bag.weight} lbs | ${formatNumber(bag.total)} lbs |\n`;
    });
    
    markdown += `\n## Summary Results\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Total Pet Food Processed | ${formatNumber(results.totalPounds)} lbs |\n`;
    markdown += `| Amount per Volunteer | ${formatNumber(results.poundsPerVolunteer)} lbs |\n`;
    markdown += `| Amount per Volunteer per Hour | ${formatNumber(results.poundsPerVolunteerPerHour)} lbs/hour |\n`;
    
    return markdown;
}

// Handle form submission
function handleCalculate(event) {
    event.preventDefault();
    
    // Get input values
    let groups;
    try {
        groups = getGroupData();
    } catch (error) {
        // Error already shown to user in getGroupData
        return;
    }
    
    const durationInput = document.getElementById('duration').value;
    const timeUnit = document.getElementById('timeUnit').value;
    const bags = getBagData();
    
    const duration = parseFloat(durationInput);
    
    // Validate inputs
    if (!duration || duration <= 0) {
        alert('Please enter a valid time duration.');
        return;
    }
    
    if (!bags || bags.length === 0) {
        alert('Please enter at least one bag type.');
        return;
    }
    
    if (!groups || groups.length === 0) {
        alert('Please enter at least one volunteer group.');
        return;
    }
    
    // Convert duration to hours
    const durationHours = convertToHours(duration, timeUnit);
    
    // Calculate results based on number of groups
    let results;
    if (groups.length === 1) {
        // Single group - use legacy function for compatibility
        results = calculateResults(groups[0].name, groups[0].volunteers, durationHours, bags);
    } else {
        // Multiple groups - use new function
        results = calculateMultipleGroupResults(groups, durationHours, bags);
    }
    
    // Store results for clipboard and saving
    window.calculationResults = results;
    
    // Display results (without auto-save)
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
    await copyToClipboardLegacy(markdown);
}

// Copy entries to spreadsheet (TSV format)
async function copyEntriesToSpreadsheet() {
    if (!window.calculationResults) {
        alert('Please calculate results first.');
        return;
    }
    
    const results = window.calculationResults;
    let tsvData = '';
    
    // Check if this is multiple groups or single group
    if (results.groupResults && results.groupResults.length > 0) {
        // Multiple groups - copy all group entries
        tsvData = getTSVHeader();
        
        results.groupResults.forEach(groupResult => {
            const date = new Date();
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Format bag types
            const bagTypesStr = formatBagTypes(groupResult.bagResults);
            
            tsvData += `${groupResult.groupName}\t${formattedDate}\t${groupResult.numVolunteers}\t${formatNumber(groupResult.durationHours)}\t${bagTypesStr}\t${formatNumber(groupResult.totalPounds)}\t${formatNumber(groupResult.poundsPerVolunteer)}\t${formatNumber(groupResult.poundsPerVolunteerPerHour)}\n`;
        });
    } else {
        // Single group - copy as one entry
        const date = new Date();
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        // Format bag types
        const bagTypesStr = formatBagTypes(results.bagResults);
        
        tsvData = getTSVHeader();
        tsvData += `${results.groupName}\t${formattedDate}\t${results.numVolunteers}\t${formatNumber(results.durationHours)}\t${bagTypesStr}\t${formatNumber(results.totalPounds)}\t${formatNumber(results.poundsPerVolunteer)}\t${formatNumber(results.poundsPerVolunteerPerHour)}`;
    }
    
    await copyToClipboardLegacy(tsvData);
}

// Copy to clipboard helper for legacy feedback system
async function copyToClipboardLegacy(text) {
    try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
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
        generateMarkdownTable,
        StorageModule,
        generateAllDataCSV,
        importDataFromCSV,
        parseCSVLine,
        entryToCSVLine,
        getCSVHeader,
        getTSVHeader,
        HEADER_FIELDS,
        areEntriesDuplicate,
        mergeImportedData,
        generateGroupEntriesCSV
    };
}

// View Switching Functions
function initializeViewSwitching() {
    const navCalculator = document.getElementById('navCalculator');
    const navDataViewer = document.getElementById('navDataViewer');
    
    if (navCalculator) {
        navCalculator.addEventListener('click', () => switchView('calculator'));
    }
    
    if (navDataViewer) {
        navDataViewer.addEventListener('click', () => switchView('dataViewer'));
    }
    
    // Initialize data viewer components
    const groupSelect = document.getElementById('groupSelect');
    if (groupSelect) {
        groupSelect.addEventListener('change', loadGroupData);
    }
    
    const refreshBtn = document.getElementById('refreshGroupsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshGroupList);
    }
    
    // Initialize date filter components
    const dateFilterType = document.getElementById('dateFilterType');
    if (dateFilterType) {
        dateFilterType.addEventListener('change', function() {
            const customDateRange = document.getElementById('customDateRange');
            if (this.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
            }
            loadGroupData();
        });
    }
    
    const startDate = document.getElementById('startDate');
    if (startDate) {
        startDate.addEventListener('change', loadGroupData);
    }
    
    const endDate = document.getElementById('endDate');
    if (endDate) {
        endDate.addEventListener('change', loadGroupData);
    }
}

function switchView(view) {
    currentView = view;
    
    const calculatorView = document.getElementById('calculatorView');
    const dataViewerView = document.getElementById('dataViewerView');
    const navCalculator = document.getElementById('navCalculator');
    const navDataViewer = document.getElementById('navDataViewer');
    
    if (view === 'calculator') {
        calculatorView.style.display = 'block';
        dataViewerView.style.display = 'none';
        navCalculator.classList.add('active');
        navDataViewer.classList.remove('active');
    } else {
        calculatorView.style.display = 'none';
        dataViewerView.style.display = 'block';
        navCalculator.classList.remove('active');
        navDataViewer.classList.add('active');
        
        // Load data viewer
        refreshGroupList();
    }
}

// Data Viewer Functions
function refreshGroupList() {
    const groupSelect = document.getElementById('groupSelect');
    const groups = StorageModule.getGroupNames();
    
    groupSelect.innerHTML = '<option value="">-- Select a volunteer group --</option>';
    
    // Add "All Groups" option if there are any groups
    if (groups.length > 0) {
        const allOption = document.createElement('option');
        allOption.value = '__ALL_GROUPS__';
        allOption.textContent = 'All Groups';
        groupSelect.appendChild(allOption);
    }
    
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
    
    // Clear the data table and summary
    clearDataViewerUI();
}

function loadGroupData() {
    const groupSelect = document.getElementById('groupSelect');
    const selectedGroup = groupSelect.value;
    
    if (!selectedGroup) {
        clearDataViewerUI();
        return;
    }
    
    if (selectedGroup === '__ALL_GROUPS__') {
        // Load all entries from all groups
        const allData = StorageModule.getAll();
        const allEntries = [];
        Object.keys(allData).forEach(groupName => {
            allData[groupName].forEach(entry => {
                allEntries.push(entry);
            });
        });
        // Apply date filter
        const filteredEntries = filterEntriesByDate(allEntries);
        displayGroupEntries('All Groups', filteredEntries, true);
    } else {
        const entries = StorageModule.getGroup(selectedGroup);
        // Apply date filter
        const filteredEntries = filterEntriesByDate(entries);
        displayGroupEntries(selectedGroup, filteredEntries, false);
    }
}

function displayGroupEntries(groupName, entries, isAllGroups = false) {
    const tableBody = document.getElementById('dataTableBody');
    const actionsDiv = document.getElementById('dataViewerActions');
    const summaryDiv = document.getElementById('groupSummary');
    
    // Store current group and entries for selection operations
    currentGroupName = groupName;
    currentEntries = entries;
    
    // Clear selection when loading new data
    clearSelection();
    
    if (entries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="no-data">No entries found for this group</td></tr>';
        actionsDiv.style.display = 'none';
        if (summaryDiv) {
            summaryDiv.style.display = 'none';
        }
        return;
    }
    
    // Calculate summary statistics
    let totalPounds = 0;
    let totalVolunteerHours = 0;
    let totalEntries = entries.length;
    
    entries.forEach(entry => {
        totalPounds += entry.totalPounds;
        totalVolunteerHours += entry.numVolunteers * entry.durationHours;
    });
    
    const avgPoundsPerVolPerHour = totalVolunteerHours > 0 ? totalPounds / totalVolunteerHours : 0;
    
    // Display summary
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Pet Food Processed:</span>
                    <span class="stat-value">${formatNumber(totalPounds)} lbs</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Entries:</span>
                    <span class="stat-value">${totalEntries}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Avg Pounds/Volunteer/Hour:</span>
                    <span class="stat-value">${formatNumber(avgPoundsPerVolPerHour)} lbs/hour</span>
                </div>
            </div>
        `;
        summaryDiv.style.display = 'block';
    }
    
    tableBody.innerHTML = '';
    
    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        const date = new Date(entry.timestamp);
        const formattedDate = formatTimestamp(entry.timestamp);
        
        // Format bag types
        const bagTypesStr = formatBagTypes(entry.bagResults);
        
        // Add checkboxes for all views, storing both entry ID and group name for proper deletion
        const checkboxHtml = `<td class="checkbox-col"><input type="checkbox" class="entry-checkbox" data-entry-id="${entry.id}" data-group-name="${entry.groupName}" onchange="handleCheckboxChange()" /></td>`;
        
        row.innerHTML = `
            ${checkboxHtml}
            <td>${index + 1}</td>
            <td>${formattedDate}</td>
            <td>${entry.numVolunteers}</td>
            <td>${formatNumber(entry.durationHours)}</td>
            <td>${bagTypesStr}</td>
            <td>${formatNumber(entry.totalPounds)}</td>
            <td>${formatNumber(entry.poundsPerVolunteer)}</td>
            <td>${formatNumber(entry.poundsPerVolunteerPerHour)}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    actionsDiv.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function confirmDeleteEntry(groupName, entryId) {
    // First confirmation
    if (!confirm(`Are you sure you want to delete this entry?\n\nGroup: ${groupName}\n\nThis action cannot be undone.`)) {
        return;
    }
    
    // Second confirmation
    if (!confirm('Please confirm deletion. This is your final warning.')) {
        return;
    }
    
    // Delete the entry
    const success = StorageModule.deleteEntry(groupName, entryId);
    
    if (success) {
        // Reload the data
        loadGroupData();
        
        // Show feedback
        showFeedback('Entry deleted successfully', 'success');
        if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
    } else {
        showFeedback('Failed to delete entry', 'error');
    }
}

// eslint-disable-next-line no-unused-vars
function copyEntryToClipboard(groupName, entryId) {
    const entries = StorageModule.getGroup(groupName);
    const entry = entries.find(e => e.id === entryId);
    
    if (!entry) {
        showFeedback('Entry not found', 'error');
        return;
    }
    
    const tsvData = generateEntryTSV(entry);
    
    copyToClipboard(tsvData, 'Entry copied to clipboard! You can paste it into Excel or Google Sheets.');
}

// eslint-disable-next-line no-unused-vars
function copyAllEntriesToClipboard() {
    const groupSelect = document.getElementById('groupSelect');
    const selectedGroup = groupSelect.value;
    
    if (!selectedGroup) {
        showFeedback('Please select a group first', 'error');
        return;
    }
    
    // Get all entries and apply date filter
    const entries = StorageModule.getGroup(selectedGroup);
    const filteredEntries = filterEntriesByDate(entries);
    
    if (filteredEntries.length === 0) {
        showFeedback('No entries to copy in the selected date range', 'error');
        return;
    }
    
    const tsvData = generateAllEntriesTSV(filteredEntries);
    
    copyToClipboard(tsvData, `${filteredEntries.length} entries copied to clipboard! You can paste them into Excel or Google Sheets.`);
}

// Generate CSV for group entries
function generateGroupEntriesCSV(entries) {
    let csv = getCSVHeader() + '\n';
    
    entries.forEach(entry => {
        csv += entryToCSVLine(entry);
    });
    
    return csv;
}

// Download group entries as CSV file
// eslint-disable-next-line no-unused-vars
function downloadGroupEntriesAsCSV() {
    const groupSelect = document.getElementById('groupSelect');
    const selectedGroup = groupSelect.value;
    
    if (!selectedGroup) {
        showFeedback('Please select a group first', 'error');
        return;
    }
    
    // Get all entries and apply date filter
    const entries = StorageModule.getGroup(selectedGroup);
    const filteredEntries = filterEntriesByDate(entries);
    
    if (filteredEntries.length === 0) {
        showFeedback('No entries to download in the selected date range', 'error');
        return;
    }
    
    try {
        const csv = generateGroupEntriesCSV(filteredEntries);
        
        // Create a blob and download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Use group name in filename, sanitize it
        const sanitizedGroupName = selectedGroup
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase();
        const filename = `${sanitizedGroupName}-entries-${new Date().toISOString().split('T')[0]}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showFeedback(`Downloaded ${filteredEntries.length} entries for ${selectedGroup}!`, 'success');
    } catch (err) {
        console.error('Download failed:', err);
        showFeedback('Failed to download entries', 'error');
    }
}

// Generate TSV (Tab-Separated Values) for a single entry
function generateEntryTSV(entry) {
    const formattedDate = formatTimestamp(entry.timestamp);
    
    // Format bag types
    const bagTypesStr = formatBagTypes(entry.bagResults);
    
    let tsv = getTSVHeader();
    tsv += `${entry.groupName}\t${formattedDate}\t${entry.numVolunteers}\t${formatNumber(entry.durationHours)}\t${bagTypesStr}\t${formatNumber(entry.totalPounds)}\t${formatNumber(entry.poundsPerVolunteer)}\t${formatNumber(entry.poundsPerVolunteerPerHour)}`;
    
    return tsv;
}

// Generate TSV for all entries
function generateAllEntriesTSV(entries) {
    let tsv = getTSVHeader();
    
    entries.forEach(entry => {
        tsv += entryToTSVLine(entry) + '\n';
    });
    
    return tsv;
}

// Convert a single entry to TSV line (without header)
function entryToTSVLine(entry) {
    const formattedDate = formatTimestamp(entry.timestamp);
    const bagTypesStr = formatBagTypes(entry.bagResults);
    
    return `${entry.groupName}\t${formattedDate}\t${entry.numVolunteers}\t${formatNumber(entry.durationHours)}\t${bagTypesStr}\t${formatNumber(entry.totalPounds)}\t${formatNumber(entry.poundsPerVolunteer)}\t${formatNumber(entry.poundsPerVolunteerPerHour)}`;
}

// Copy to clipboard helper
async function copyToClipboard(text, successMessage) {
    try {
        await navigator.clipboard.writeText(text);
        showFeedback(successMessage, 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showFeedback(successMessage, 'success');
        } catch (err) {
            showFeedback('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Show feedback message
function showFeedback(message, type) {
    const feedbackDiv = document.getElementById('viewerFeedback');
    feedbackDiv.textContent = message;
    feedbackDiv.className = `viewer-feedback ${type}`;
    feedbackDiv.style.display = 'block';
    
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 3000);
}

// CSV Export and Import Functions

// Generate CSV for all entries in storage
function generateAllDataCSV() {
    const allData = StorageModule.getAll();
    let csv = getCSVHeader() + '\n';
    
    // Iterate through all groups and their entries
    Object.keys(allData).sort().forEach(groupName => {
        const entries = allData[groupName];
        entries.forEach(entry => {
            csv += entryToCSVLine(entry);
        });
    });
    
    return csv;
}

// Convert a single entry to a CSV line
function entryToCSVLine(entry) {
    const formattedDate = formatTimestamp(entry.timestamp);
    const bagTypesStr = formatBagTypes(entry.bagResults);
    
    // Escape CSV fields that contain commas or quotes
    const escapeCSV = (field) => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    
    return `${escapeCSV(entry.groupName)},${escapeCSV(formattedDate)},${entry.numVolunteers},${formatNumber(entry.durationHours)},${escapeCSV(bagTypesStr)},${formatNumber(entry.totalPounds)},${formatNumber(entry.poundsPerVolunteer)},${formatNumber(entry.poundsPerVolunteerPerHour)}\n`;
}

// Export all data to CSV file
// eslint-disable-next-line no-unused-vars
function exportAllDataToCSV() {
    try {
        const csv = generateAllDataCSV();
        
        // Create a blob and download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `volunteer-calculator-data-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showFeedback('Data exported successfully!', 'success');
    } catch (err) {
        console.error('Export failed:', err);
        showFeedback('Failed to export data', 'error');
    }
}

// Parse CSV line respecting quoted fields
function parseCSVLine(line) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote mode
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    
    // Add the last field
    fields.push(currentField);
    
    return fields;
}

// Parse bag types string back to bag results array
function parseBagTypes(bagTypesStr) {
    if (!bagTypesStr || bagTypesStr === 'N/A') {
        return [];
    }
    
    // Format is like: "Dog (5), Cat (3)"
    const bagResults = [];
    const parts = bagTypesStr.split(',').map(s => s.trim());
    
    parts.forEach((part, index) => {
        const match = part.match(/^(.+?)\s*\((\d+)\)$/);
        if (match) {
            const type = match[1].trim();
            const count = parseInt(match[2], 10);
            // We don't have the original weight, so we'll approximate from total
            bagResults.push({
                bagType: index + 1,
                type: type,
                count: count,
                weight: 0, // Will be recalculated if needed
                total: 0
            });
        }
    });
    
    return bagResults;
}

// Validate and import CSV data
function importDataFromCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
        throw new Error('CSV file is empty');
    }
    
    // Validate header
    const header = lines[0];
    const expectedHeader = getCSVHeader();
    
    if (header.trim() !== expectedHeader.trim()) {
        throw new Error('Invalid CSV header format. Expected: ' + expectedHeader);
    }
    
    // Parse data lines
    const newData = {};
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
        try {
            const fields = parseCSVLine(lines[i]);
            
            if (fields.length !== 8) {
                errors.push(`Line ${i + 1}: Expected 8 fields, got ${fields.length}`);
                continue;
            }
            
            const groupName = fields[0].trim();
            const dateStr = fields[1].trim();
            const numVolunteers = parseFloat(fields[2]);
            const durationHours = parseFloat(fields[3]);
            const bagTypesStr = fields[4].trim();
            const totalPounds = parseFloat(fields[5]);
            const poundsPerVolunteer = parseFloat(fields[6]);
            const poundsPerVolunteerPerHour = parseFloat(fields[7]);
            
            // Validate required fields
            if (!groupName) {
                errors.push(`Line ${i + 1}: Group name is required`);
                continue;
            }
            
            if (isNaN(numVolunteers) || numVolunteers <= 0) {
                errors.push(`Line ${i + 1}: Invalid number of volunteers`);
                continue;
            }
            
            if (isNaN(durationHours) || durationHours <= 0) {
                errors.push(`Line ${i + 1}: Invalid duration hours`);
                continue;
            }
            
            if (isNaN(totalPounds) || totalPounds < 0) {
                errors.push(`Line ${i + 1}: Invalid total pounds`);
                continue;
            }
            
            // Parse date - try to preserve original timestamp or create new one
            let timestamp;
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
                timestamp = parsedDate.toISOString();
            } else {
                // Use current date but log a warning
                timestamp = new Date().toISOString();
                console.warn(`Line ${i + 1}: Could not parse date "${dateStr}", using current date`);
            }
            
            // Create entry object
            const entry = {
                groupName: groupName,
                numVolunteers: numVolunteers,
                durationHours: durationHours,
                bagResults: parseBagTypes(bagTypesStr),
                totalPounds: totalPounds,
                poundsPerVolunteer: poundsPerVolunteer,
                poundsPerVolunteerPerHour: poundsPerVolunteerPerHour,
                timestamp: timestamp,
                id: Date.now() + '-' + Math.random() + '-' + i
            };
            
            // Add to data structure
            const trimmedGroupName = trimGroupName(groupName);
            if (!newData[trimmedGroupName]) {
                newData[trimmedGroupName] = [];
            }
            newData[trimmedGroupName].push(entry);
            
        } catch (err) {
            errors.push(`Line ${i + 1}: ${err.message}`);
        }
    }
    
    if (errors.length > 0) {
        throw new Error('Import errors:\n' + errors.join('\n'));
    }
    
    if (Object.keys(newData).length === 0) {
        throw new Error('No valid data found in CSV file');
    }
    
    return newData;
}

// Check if two entries are duplicates (same group, date, volunteers, hours, total pounds)
function areEntriesDuplicate(entry1, entry2) {
    // Compare key fields to determine if entries are the same
    return entry1.groupName === entry2.groupName &&
           entry1.timestamp === entry2.timestamp &&
           entry1.numVolunteers === entry2.numVolunteers &&
           entry1.durationHours === entry2.durationHours &&
           entry1.totalPounds === entry2.totalPounds;
}

// Merge imported data with existing data (add without duplicates)
function mergeImportedData(existingData, newData) {
    const mergedData = JSON.parse(JSON.stringify(existingData)); // Deep clone
    let addedCount = 0;
    let skippedCount = 0;
    
    // Iterate through new data
    Object.keys(newData).forEach(groupName => {
        const newEntries = newData[groupName];
        
        if (!mergedData[groupName]) {
            mergedData[groupName] = [];
        }
        
        newEntries.forEach(newEntry => {
            // Check if this entry already exists
            const isDuplicate = mergedData[groupName].some(existingEntry => 
                areEntriesDuplicate(existingEntry, newEntry)
            );
            
            if (!isDuplicate) {
                mergedData[groupName].push(newEntry);
                addedCount++;
            } else {
                skippedCount++;
            }
        });
    });
    
    return { mergedData, addedCount, skippedCount };
}

// Handle file import - ADD mode
// eslint-disable-next-line no-unused-vars
function handleImportAddMode() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const newData = importDataFromCSV(text);
            
            const entryCount = Object.values(newData).reduce((sum, entries) => sum + entries.length, 0);
            const groupCount = Object.keys(newData).length;
            
            // ADD mode - merge with existing data
            const existingData = StorageModule.getAll();
            const { mergedData, addedCount, skippedCount } = mergeImportedData(existingData, newData);
            
            // Confirm before proceeding
            const confirmMsg = `Found ${entryCount} entries across ${groupCount} groups.\n\nThis will ADD ${addedCount} new entries to your existing data.\n${skippedCount} duplicate(s) will be skipped.\n\nContinue?`;
            if (!confirm(confirmMsg)) {
                showFeedback('Import cancelled', 'error');
                return;
            }
            
            StorageModule.importAll(mergedData);
            showFeedback(`Successfully added ${addedCount} entries! (${skippedCount} duplicates skipped)`, 'success');
            if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
            
            // Refresh the data viewer
            refreshGroupList();
            
        } catch (err) {
            console.error('Import failed:', err);
            showFeedback('Import failed: ' + err.message, 'error');
        }
    };
    
    input.click();
}

// Handle file import - REPLACE mode
// eslint-disable-next-line no-unused-vars
function handleImportReplaceMode() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const newData = importDataFromCSV(text);
            
            const entryCount = Object.values(newData).reduce((sum, entries) => sum + entries.length, 0);
            const groupCount = Object.keys(newData).length;
            
            // REPLACE mode - confirm before proceeding
            const confirmMsg = `Found ${entryCount} entries across ${groupCount} groups.\n\n⚠️ WARNING: This will REPLACE ALL existing data!\n\nAll current entries will be permanently deleted and replaced with the imported data.\n\nAre you sure you want to continue?`;
            if (!confirm(confirmMsg)) {
                showFeedback('Import cancelled', 'error');
                return;
            }
            
            StorageModule.importAll(newData);
            showFeedback(`Successfully replaced all data with ${entryCount} entries!`, 'success');
            if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
            
            // Refresh the data viewer
            refreshGroupList();
            
        } catch (err) {
            console.error('Import failed:', err);
            showFeedback('Import failed: ' + err.message, 'error');
        }
    };
    
    input.click();
}

// Toggle Data Management section
// eslint-disable-next-line no-unused-vars
function toggleDataManagement() {
    const content = document.getElementById('dataManagementContent');
    const toggle = document.getElementById('dataManagementToggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

// ============================================
// Selection Functions
// ============================================

// Update the selection banner visibility and count
function updateSelectionBanner() {
    const banner = document.getElementById('selectionBanner');
    const countSpan = document.getElementById('selectionCount');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    
    if (!banner || !countSpan) return;
    
    const count = selectedEntries.size;
    countSpan.textContent = count;
    
    if (count > 0) {
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
    
    // Update the "select all" checkbox state
    if (selectAllCheckbox) {
        const totalCheckboxes = document.querySelectorAll('.entry-checkbox').length;
        selectAllCheckbox.checked = count > 0 && count === totalCheckboxes;
        selectAllCheckbox.indeterminate = count > 0 && count < totalCheckboxes;
    }
}

// Handle individual checkbox change
// eslint-disable-next-line no-unused-vars
function handleCheckboxChange() {
    // Update selected entries map
    selectedEntries.clear();
    document.querySelectorAll('.entry-checkbox:checked').forEach(checkbox => {
        const entryId = checkbox.getAttribute('data-entry-id');
        const groupName = checkbox.getAttribute('data-group-name');
        selectedEntries.set(entryId, groupName);
    });
    
    updateSelectionBanner();
}

// Toggle all checkboxes
// eslint-disable-next-line no-unused-vars
function toggleAllCheckboxes(checked) {
    document.querySelectorAll('.entry-checkbox').forEach(checkbox => {
        checkbox.checked = checked;
    });
    handleCheckboxChange();
}

// Select all entries
// eslint-disable-next-line no-unused-vars
function selectAllEntries() {
    toggleAllCheckboxes(true);
}

// Clear selection
// eslint-disable-next-line no-unused-vars
function clearSelection() {
    selectedEntries.clear();
    document.querySelectorAll('.entry-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
    updateSelectionBanner();
}

// Get selected entries from current entries list
function getSelectedEntriesData() {
    return currentEntries.filter(entry => selectedEntries.has(entry.id));
}

// Copy selected entries to clipboard
// eslint-disable-next-line no-unused-vars
function copySelectedEntries() {
    if (selectedEntries.size === 0) {
        showFeedback('No entries selected', 'error');
        return;
    }
    
    const entries = getSelectedEntriesData();
    const tsvData = getTSVHeader() + entries.map(entry => entryToTSVLine(entry)).join('\n') + '\n';
    
    navigator.clipboard.writeText(tsvData).then(() => {
        showFeedback(`Copied ${selectedEntries.size} entries to clipboard`, 'success');
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        showFeedback('Failed to copy to clipboard', 'error');
    });
}

// Download selected entries as CSV
// eslint-disable-next-line no-unused-vars
function downloadSelectedEntries() {
    if (selectedEntries.size === 0) {
        showFeedback('No entries selected', 'error');
        return;
    }
    
    const entries = getSelectedEntriesData();
    const csv = getCSVHeader() + '\n' + entries.map(entry => entryToCSVLine(entry)).join('\n');
    
    // Create a filename based on the group name and current date
    const sanitizedGroupName = currentGroupName.replace(/[^a-z0-9]/gi, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedGroupName}_selected_${dateStr}.csv`;
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showFeedback(`Downloaded ${selectedEntries.size} entries as ${filename}`, 'success');
}

// Delete selected entries
// eslint-disable-next-line no-unused-vars
function deleteSelectedEntries() {
    if (selectedEntries.size === 0) {
        showFeedback('No entries selected', 'error');
        return;
    }
    
    const count = selectedEntries.size;
    const confirmMessage = `Are you sure you want to delete ${count} selected ${count === 1 ? 'entry' : 'entries'}? This action cannot be undone.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Second confirmation
    const secondConfirm = `Final confirmation: Delete ${count} ${count === 1 ? 'entry' : 'entries'}?`;
    if (!confirm(secondConfirm)) {
        return;
    }
    
    // Delete each selected entry using its group name from the map
    let deletedCount = 0;
    selectedEntries.forEach((groupName, entryId) => {
        const success = StorageModule.deleteEntry(groupName, entryId);
        if (success) {
            deletedCount++;
        }
    });
    
    // Clear selection
    clearSelection();
    
    // Reload data
    loadGroupData();
    
    if (deletedCount > 0) {
        showFeedback(`Successfully deleted ${deletedCount} ${deletedCount === 1 ? 'entry' : 'entries'}`, 'success');
        if (typeof CloudSyncModule !== 'undefined' && CloudSyncModule.isLoggedIn()) { CloudSyncModule.syncToCloud(); }
    } else {
        showFeedback('Failed to delete entries', 'error');
    }
}
