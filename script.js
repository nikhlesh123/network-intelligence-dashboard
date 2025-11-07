// ============================================
// Network Intelligence Dashboard JavaScript
// Interactive Functionality & Chart Rendering
// Enhanced with Real-time Collaboration & Integration
// ============================================

// Global State Management
const dashboardState = {
    activeRole: 'executive',
    selectedProviders: [],
    activeFilters: {},
    collaborationActive: false,
    syncEnabled: true,
    flaggedItems: []
};

// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeSidebar();
    initializeFilters();
    initializeCharts();
    initializeScenarioCalculator();
    initializeCollaboration();
    initializeIntegration();
    initializeHeatmap();
    initializeUSHeatmap();
    initializeBulkActions();
    updateLastUpdateTime();
    startAutoRefresh();
});

// ========== Collaboration Panel ==========
function initializeCollaboration() {
    const collabBtn = document.getElementById('collaborationBtn');
    const collabPanel = document.getElementById('collaborationPanel');
    const closeBtn = document.getElementById('closeCollabPanel');
    
    if (collabBtn) {
        collabBtn.addEventListener('click', () => {
            collabPanel.classList.toggle('open');
            dashboardState.collaborationActive = !dashboardState.collaborationActive;
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            collabPanel.classList.remove('open');
            dashboardState.collaborationActive = false;
        });
    }
    
    // Initialize collaboration tabs
    document.querySelectorAll('.collab-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-collab-tab');
            switchCollabTab(tabName);
        });
    });
}

function switchCollabTab(tabName) {
    document.querySelectorAll('.collab-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.collab-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-collab-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ========== Integration & Sync Functions ==========
function initializeIntegration() {
    const syncBtn = document.getElementById('syncBtn');
    const roleSelector = document.getElementById('roleSelector');
    
    if (syncBtn) {
        syncBtn.addEventListener('click', syncDashboards);
    }
    
    if (roleSelector) {
        roleSelector.addEventListener('change', function() {
            switchRole(this.value);
        });
    }
}

function syncDashboards() {
    showNotification('Syncing dashboards across all roles...', 'info');
    
    // Simulate sync process
    setTimeout(() => {
        showNotification('All dashboards synchronized successfully', 'success');
        updateSyncIndicators();
    }, 1500);
}

function updateSyncIndicators() {
    document.querySelectorAll('.sync-indicator').forEach(indicator => {
        indicator.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 500);
    });
}

function switchRole(role) {
    dashboardState.activeRole = role;
    
    // Auto-switch to corresponding tab
    const tabMap = {
        'executive': 'executive',
        'manager': 'manager',
        'contracting': 'contracting'
    };
    
    const tabBtn = document.querySelector(`[data-tab="${tabMap[role]}"]`);
    if (tabBtn) {
        tabBtn.click();
    }
    
    showNotification(`Switched to ${role} view`, 'info');
}

// ========== Cross-Dashboard Functions ==========
function drillToContracting(context) {
    // Switch to contracting tab and pass context
    const contractingTab = document.querySelector('[data-tab="contracting"]');
    contractingTab.click();
    
    // Show manager flag section
    const flagSection = document.getElementById('managerFlagSection');
    if (flagSection) {
        flagSection.style.display = 'block';
        flagSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification(`Navigating to contracting team with ${context} context`, 'info');
}

function flagToContracting(providerId) {
    dashboardState.flaggedItems.push({
        id: providerId,
        type: 'provider',
        source: 'manager',
        timestamp: new Date()
    });
    
    showNotification('Provider flagged to contracting team', 'success');
    updateCollaborationBadge();
    
    // Send to collaboration panel
    addCollaborationFlag(providerId);
}

function flagToExecutive(context) {
    showNotification(`Flagging ${context} to executive dashboard`, 'info');
    updateCollaborationBadge();
}

function assignToContracting(context) {
    showNotification(`Assigning ${context} to contracting team`, 'info');
    updateCollaborationBadge();
}

function updateExecutive(providerId) {
    showNotification('Sending update to executive dashboard', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Executive dashboard updated successfully', 'success');
    }, 1000);
}

function updateCollaborationBadge() {
    const badge = document.querySelector('#collaborationBtn .notification-badge');
    if (badge) {
        const current = parseInt(badge.textContent) || 0;
        badge.textContent = current + 1;
    }
}

function addCollaborationFlag(providerId) {
    // Add to flags tab in collaboration panel
    console.log(`Flag added for provider: ${providerId}`);
}

// ========== Heatmap Interactions ==========
function initializeHeatmap() {
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            const value = this.getAttribute('data-value');
            drillDownToRegion(region, value);
        });
    });
}

function drillDownToRegion(region, adequacy) {
    showNotification(`Drilling down to ${region} - Adequacy: ${adequacy}%`, 'info');
    
    // Update filters
    const marketFilter = document.getElementById('marketDrillDown');
    if (marketFilter) {
        marketFilter.value = region.toLowerCase();
    }
    
    // Refresh data
    refreshDashboardData();
}

function drillDownToGap(region) {
    const managerTab = document.querySelector('[data-tab="manager"]');
    managerTab.click();
    
    showNotification(`Viewing coverage gaps in ${region}`, 'info');
}

function expandAdequacyDetails() {
    const heatmap = document.getElementById('adequacyMap');
    if (heatmap) {
        heatmap.scrollIntoView({ behavior: 'smooth' });
    }
}

function flagCriticalRegions() {
    const criticalCells = document.querySelectorAll('.heatmap-cell.critical');
    const count = criticalCells.length;
    
    showNotification(`Flagging ${count} critical region(s) to executive`, 'success');
}

function exportHeatmapData() {
    showNotification('Preparing heatmap data export...', 'info');
    setTimeout(() => {
        showNotification('Heatmap data exported successfully', 'success');
    }, 1000);
}

// ========== US Heatmap Interactions ==========
function initializeUSHeatmap() {
    const stateRegions = document.querySelectorAll('.state-region');
    const stateInfoPanel = document.getElementById('stateInfoPanel');
    
    // Sample state data
    const stateData = {
        'CA': { providers: 12500, members: 3250000, avgRate: '$285' },
        'TX': { providers: 9800, members: 2450000, avgRate: '$268' },
        'FL': { providers: 8900, members: 2120000, avgRate: '$292' },
        'NY': { providers: 11200, members: 2850000, avgRate: '$305' },
        'PA': { providers: 6500, members: 1580000, avgRate: '$276' },
        'IL': { providers: 7200, members: 1720000, avgRate: '$281' },
        'OH': { providers: 5800, members: 1420000, avgRate: '$264' },
        'GA': { providers: 4900, members: 1180000, avgRate: '$278' },
        'NC': { providers: 4200, members: 980000, avgRate: '$273' },
        'MI': { providers: 4500, members: 1120000, avgRate: '$258' },
        'MA': { providers: 3800, members: 950000, avgRate: '$288' },
        'WA': { providers: 3200, members: 820000, avgRate: '$267' },
        'AZ': { providers: 2900, members: 720000, avgRate: '$272' },
        'NJ': { providers: 3600, members: 890000, avgRate: '$269' },
        'VA': { providers: 3100, members: 780000, avgRate: '$265' }
    };
    
    stateRegions.forEach(region => {
        region.addEventListener('click', (e) => {
            const state = region.getAttribute('data-state');
            const variance = region.getAttribute('data-variance');
            const data = stateData[state] || { providers: 'N/A', members: 'N/A', avgRate: 'N/A' };
            
            // Update info panel
            document.getElementById('stateName').textContent = getStateName(state);
            document.getElementById('stateVariance').textContent = variance;
            document.getElementById('stateProviders').textContent = data.providers.toLocaleString();
            document.getElementById('stateMembers').textContent = data.members.toLocaleString();
            document.getElementById('stateRate').textContent = data.avgRate;
            
            // Show panel
            stateInfoPanel.style.display = 'block';
            
            // Highlight selected state
            stateRegions.forEach(r => r.style.strokeWidth = '2');
            region.style.strokeWidth = '4';
            region.style.stroke = '#1e40af';
        });
        
        region.addEventListener('mouseenter', (e) => {
            region.style.filter = 'brightness(1.2)';
        });
        
        region.addEventListener('mouseleave', (e) => {
            if (region.style.strokeWidth !== '4') {
                region.style.filter = 'brightness(1)';
            }
        });
    });
}

function getStateName(abbr) {
    const states = {
        'CA': 'California', 'TX': 'Texas', 'FL': 'Florida', 'NY': 'New York',
        'PA': 'Pennsylvania', 'IL': 'Illinois', 'OH': 'Ohio', 'GA': 'Georgia',
        'NC': 'North Carolina', 'MI': 'Michigan', 'MA': 'Massachusetts',
        'WA': 'Washington', 'AZ': 'Arizona', 'NJ': 'New Jersey', 'VA': 'Virginia',
        'TN': 'Tennessee', 'IN': 'Indiana', 'MO': 'Missouri', 'MD': 'Maryland',
        'WI': 'Wisconsin', 'CO': 'Colorado', 'MN': 'Minnesota', 'SC': 'South Carolina',
        'AL': 'Alabama', 'LA': 'Louisiana', 'KY': 'Kentucky', 'OR': 'Oregon',
        'OK': 'Oklahoma', 'CT': 'Connecticut', 'IA': 'Iowa', 'MS': 'Mississippi',
        'AR': 'Arkansas', 'KS': 'Kansas', 'UT': 'Utah', 'NV': 'Nevada',
        'NM': 'New Mexico', 'WV': 'West Virginia', 'NE': 'Nebraska', 'ID': 'Idaho',
        'HI': 'Hawaii', 'NH': 'New Hampshire', 'ME': 'Maine', 'RI': 'Rhode Island',
        'MT': 'Montana', 'DE': 'Delaware', 'SD': 'South Dakota', 'ND': 'North Dakota',
        'AK': 'Alaska', 'DC': 'District of Columbia', 'VT': 'Vermont', 'WY': 'Wyoming'
    };
    return states[abbr] || abbr;
}

function drillDownToState() {
    const stateName = document.getElementById('stateName').textContent;
    showNotification(`Opening detailed view for ${stateName}...`, 'info');
    
    // Switch to Manager tab for regional drill-down
    setTimeout(() => {
        const managerTab = document.querySelector('[data-tab="manager"]');
        if (managerTab) {
            managerTab.click();
        }
        showNotification(`Viewing ${stateName} regional details`, 'success');
    }, 500);
}

function expandUSMap() {
    const mapWrapper = document.querySelector('.us-map-wrapper');
    if (mapWrapper.requestFullscreen) {
        mapWrapper.requestFullscreen();
    } else if (mapWrapper.webkitRequestFullscreen) {
        mapWrapper.webkitRequestFullscreen();
    } else if (mapWrapper.msRequestFullscreen) {
        mapWrapper.msRequestFullscreen();
    }
    showNotification('Map expanded to fullscreen', 'info');
}

function refreshMapData() {
    showNotification('Refreshing map data...', 'info');
    setTimeout(() => {
        showNotification('Map data updated', 'success');
    }, 1500);
}

function compareToNational() {
    showNotification('Loading national benchmark comparison...', 'info');
}

// ========== Bulk Actions ==========
function initializeBulkActions() {
    // Select all checkboxes
    const selectAllBoxes = document.querySelectorAll('#selectAllOutliers, #selectAllBenchmark');
    selectAllBoxes.forEach(box => {
        box.addEventListener('change', function() {
            const table = this.closest('table');
            const checkboxes = table.querySelectorAll('.row-select');
            checkboxes.forEach(cb => cb.checked = this.checked);
            updateSelectionCount();
        });
    });
    
    // Individual checkboxes
    document.querySelectorAll('.row-select').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });
}

function updateSelectionCount() {
    const selected = document.querySelectorAll('.row-select:checked').length;
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = `${selected} items selected`;
    }
    
    // Update bulk action buttons
    document.querySelectorAll('.bulk-actions button, .bulk-export button').forEach(btn => {
        if (btn.textContent.includes('Selected')) {
            btn.textContent = btn.textContent.replace(/\(\d+\)/, `(${selected})`);
        }
    });
}

function bulkFlagToContracting() {
    const selected = document.querySelectorAll('.row-select:checked');
    showNotification(`Sending ${selected.length} provider(s) to contracting team`, 'success');
}

function bulkExport() {
    const selected = document.querySelectorAll('.row-select:checked');
    showNotification(`Exporting ${selected.length} provider(s)...`, 'info');
}

function exportSelectedToPacket() {
    const selected = document.querySelectorAll('.row-select:checked').length;
    if (selected === 0) {
        showNotification('Please select items to export', 'warning');
        return;
    }
    showNotification(`Creating negotiation packet for ${selected} providers...`, 'info');
    setTimeout(() => {
        showNotification('Negotiation packet ready for download (PPT)', 'success');
    }, 2000);
}

function exportSelectedToExcel() {
    const selected = document.querySelectorAll('.row-select:checked').length;
    if (selected === 0) {
        showNotification('Please select items to export', 'warning');
        return;
    }
    showNotification(`Exporting ${selected} items to Excel...`, 'info');
}

function requestBulkApproval() {
    const selected = document.querySelectorAll('.row-select:checked').length;
    if (selected === 0) {
        showNotification('Please select items for approval', 'warning');
        return;
    }
    showNotification(`Requesting executive approval for ${selected} items...`, 'info');
}

// ========== CPT Drill-Down ==========
function expandCPTDetails(providerId) {
    const cptRow = document.getElementById(`cpt-${providerId}`);
    const expandBtn = event.target.closest('.expand-btn');
    
    if (cptRow) {
        if (cptRow.style.display === 'none' || !cptRow.style.display) {
            cptRow.style.display = 'table-row';
            expandBtn.classList.add('expanded');
        } else {
            cptRow.style.display = 'none';
            expandBtn.classList.remove('expanded');
        }
    }
}

function drillToCPTCodes(providerId) {
    expandCPTDetails(providerId);
    showNotification('Loading CPT code details...', 'info');
}

// ========== Contracting Team Functions ==========
function viewManagerFlags() {
    const flagSection = document.getElementById('managerFlagSection');
    if (flagSection) {
        flagSection.style.display = 'block';
        flagSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeFlagSection() {
    const flagSection = document.getElementById('managerFlagSection');
    if (flagSection) {
        flagSection.style.display = 'none';
    }
}

function startNegotiation(providerId) {
    showNotification(`Starting negotiation process for ${providerId}`, 'info');
    // Open workflow panel or negotiation wizard
}

function requestMoreInfo(providerId) {
    showNotification('Sending information request to network manager', 'info');
    updateCollaborationBadge();
}

function exportNegotiationPacket(format) {
    showNotification(`Preparing negotiation packet (${format.toUpperCase()})...`, 'info');
    setTimeout(() => {
        showNotification(`Negotiation packet ready (${format.toUpperCase()})`, 'success');
    }, 2000);
}

function exportNegPacket(providerId) {
    showNotification(`Exporting negotiation packet for ${providerId}...`, 'info');
}

function requestApproval(providerId) {
    showNotification('Requesting executive approval...', 'info');
    updateCollaborationBadge();
}

function addNote(providerId) {
    const note = prompt('Add negotiation note:');
    if (note) {
        showNotification('Note added successfully', 'success');
    }
}

function viewProviderDetail(providerId) {
    showNotification(`Loading detailed analytics for ${providerId}...`, 'info');
}

function viewFullNote(noteId) {
    showNotification('Opening full note view...', 'info');
}

function downloadAttachment(attachmentId) {
    showNotification('Downloading attachment...', 'info');
}

function addNegotiationNote() {
    showNotification('Opening note editor...', 'info');
}

function attachDocument() {
    showNotification('Opening file browser...', 'info');
}

function sendTag() {
    const tagInput = document.querySelector('.tag-input');
    if (tagInput && tagInput.value) {
        showNotification(`Message sent: ${tagInput.value}`, 'success');
        tagInput.value = '';
        updateCollaborationBadge();
    }
}

function exportAuditLog() {
    showNotification('Exporting audit trail...', 'info');
    setTimeout(() => {
        showNotification('Audit log exported successfully', 'success');
    }, 1000);
}

function resolveDiscrepancy(discrepancyId) {
    showNotification('Opening discrepancy resolution wizard...', 'info');
}

function viewContractDetails(contractId) {
    showNotification(`Loading contract details for ${contractId}...`, 'info');
}

// ========== Context Management ==========
function clearDrillDown() {
    document.querySelectorAll('.context-chip').forEach(chip => chip.remove());
    showNotification('Drill-down context cleared', 'info');
}

function removeContext(type) {
    event.target.closest('.context-chip').remove();
    showNotification(`${type} filter removed`, 'info');
}

// ========== Chart Type Switching ==========
document.querySelectorAll('.chart-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const chartType = this.getAttribute('data-chart');
        switchChartView(chartType);
    });
});

function switchChartView(chartType) {
    document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.chart-view').forEach(view => view.classList.remove('active'));
    
    document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
    document.getElementById(`${chartType}-chart`).classList.add('active');
}

// ========== Auto Refresh ==========
function startAutoRefresh() {
    const autoRefresh = document.getElementById('autoRefresh');
    if (autoRefresh) {
        setInterval(() => {
            if (dashboardState.syncEnabled) {
                updateLastUpdateTime();
                // Simulate data refresh
                console.log('Auto-refreshing data...');
            }
        }, 60000); // Every minute
    }
}

// ========== Additional Chart Initializations ==========
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    initializeSpecialtyComparisonChart();
    initializeRiskTrendChart();
    initializeRateComparisonChart();
    initializeLocalRateBenchmarkChart();
    initializeVolumeWeightedChart();
    initializeSavingsPotentialChart();
}

function initializeLocalRateBenchmarkChart() {
    const ctx = document.getElementById('localRateBenchmarkChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Primary Care', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
            datasets: [{
                label: 'Local Rate',
                data: [145, 485, 398, 525, 612],
                backgroundColor: 'rgba(30, 64, 175, 0.8)'
            }, {
                label: 'National Benchmark',
                data: [155, 425, 385, 485, 575],
                backgroundColor: 'rgba(34, 197, 94, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

function initializeVolumeWeightedChart() {
    const ctx = document.getElementById('volumeWeightedChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Providers',
                data: [
                    { x: 12450, y: 14.1 },
                    { x: 8920, y: 3.5 },
                    { x: 35680, y: -6.5 },
                    { x: 4230, y: 8.2 }
                ],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Volume' } },
                y: { title: { display: true, text: 'Variance %' } }
            }
        }
    });
}

function initializeSavingsPotentialChart() {
    const ctx = document.getElementById('savingsPotentialChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Realized Savings', 'Potential Savings', 'Conservative Target'],
            datasets: [{
                data: [2.5, 12.3, 8.7],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(30, 64, 175, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// ========== Tab Management ==========
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// ========== Sidebar Management ==========
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
}

// ========== Filter Management ==========
function initializeFilters() {
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const resetFiltersBtn = document.querySelector('.reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const region = document.getElementById('regionFilter').value;
    const specialty = document.getElementById('specialtyFilter').value;
    const plan = document.getElementById('planFilter').value;
    const provider = document.getElementById('providerFilter').value;
    const time = document.getElementById('timeFilter').value;
    
    console.log('Applying filters:', { region, specialty, plan, provider, time });
    
    // Show loading indicator
    showNotification('Applying filters...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        showNotification('Filters applied successfully', 'success');
        refreshDashboardData();
    }, 1000);
}

function resetFilters() {
    document.getElementById('regionFilter').value = 'all';
    document.getElementById('specialtyFilter').value = 'all';
    document.getElementById('planFilter').value = 'all';
    document.getElementById('providerFilter').value = 'all';
    document.getElementById('timeFilter').value = 'ytd';
    
    showNotification('Filters reset', 'info');
    refreshDashboardData();
}

function refreshDashboardData() {
    // Simulate data refresh - in production, this would fetch new data from API
    console.log('Refreshing dashboard data...');
    updateCharts();
}

// ========== Chart Initialization ==========
function initializeCharts() {
    // Only initialize charts if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    initializeSpecialtyComparisonChart();
    initializeRiskTrendChart();
    initializeRateComparisonChart();
}

function initializeSpecialtyComparisonChart() {
    const ctx = document.getElementById('specialtyComparisonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Primary Care', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Pediatrics'],
            datasets: [
                {
                    label: 'Our Rates',
                    data: [145, 485, 398, 525, 612, 168],
                    backgroundColor: 'rgba(30, 64, 175, 0.8)',
                    borderColor: 'rgba(30, 64, 175, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Market Median',
                    data: [155, 425, 385, 485, 575, 175],
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Market 75th Percentile',
                    data: [175, 465, 410, 520, 610, 190],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, family: 'Inter' },
                        padding: 15
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        },
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeRiskTrendChart() {
    const ctx = document.getElementById('riskTrendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [
                {
                    label: 'Risk Concentration Index',
                    data: [0.62, 0.64, 0.63, 0.66, 0.67, 0.65, 0.68, 0.69, 0.67, 0.68, 0.68],
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Target Threshold',
                    data: Array(11).fill(0.60),
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, family: 'Inter' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeRateComparisonChart() {
    const ctx = document.getElementById('rateComparisonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Office Visit', 'Procedure', 'Diagnostic', 'Surgery', 'Emergency', 'Specialist Consult'],
            datasets: [
                {
                    label: 'Metropolitan Health',
                    data: [425, 850, 320, 1250, 680, 495],
                    borderColor: 'rgba(30, 64, 175, 1)',
                    backgroundColor: 'rgba(30, 64, 175, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Regional Care Network',
                    data: [398, 795, 285, 1150, 625, 445],
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Academic Medical Center',
                    data: [445, 920, 365, 1425, 745, 525],
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, family: 'Inter' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.r;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        },
                        font: { size: 10 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function updateCharts() {
    // Simulate chart updates with new data
    console.log('Updating charts with filtered data...');
}

// ========== Scenario Calculator ==========
function initializeScenarioCalculator() {
    const rateReductionSlider = document.getElementById('rateReduction');
    const rateReductionValue = document.getElementById('rateReductionValue');
    const calculateBtn = document.querySelector('.calculate-scenario');
    
    if (rateReductionSlider) {
        rateReductionSlider.addEventListener('input', function() {
            rateReductionValue.textContent = this.value + '%';
        });
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateScenario);
    }
}

function calculateScenario() {
    const reduction = parseFloat(document.getElementById('rateReduction').value);
    const systems = document.getElementById('scenarioSystems').value;
    const timeline = document.getElementById('scenarioTimeline').value;
    
    // Simulate calculation
    const baseAnnualCost = 164000000; // $164M
    const basePMPM = 485.20;
    
    const annualSavings = (baseAnnualCost * (reduction / 100)).toFixed(1);
    const pmpmReduction = (basePMPM * (reduction / 100)).toFixed(2);
    const newMarketPosition = (8.5 - reduction).toFixed(1);
    
    // Update result displays with animation
    animateValue('.result-card:nth-child(1) .result-value', 0, annualSavings, 1000, '$', 'M');
    animateValue('.result-card:nth-child(2) .result-value', 0, pmpmReduction, 1000, '$', '');
    animateValue('.result-card:nth-child(3) .result-value', 0, newMarketPosition, 1000, '', '%');
    
    showNotification('Scenario calculated successfully', 'success');
}

function animateValue(selector, start, end, duration, prefix = '', suffix = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = prefix + parseFloat(current).toFixed(1) + suffix;
    }, 16);
}

// ========== Notification System ==========
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// ========== Export Functionality ==========
document.querySelectorAll('.btn-export').forEach(btn => {
    btn.addEventListener('click', function() {
        const format = this.textContent.trim();
        exportDashboard(format);
    });
});

function exportDashboard(format) {
    showNotification(`Preparing ${format} export...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification(`${format} export ready for download`, 'success');
        console.log(`Exporting dashboard as ${format}`);
    }, 1500);
}

// ========== View Toggle Functionality ==========
document.querySelectorAll('.view-toggle').forEach(toggleGroup => {
    const buttons = toggleGroup.querySelectorAll('.toggle-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ========== Time Range Selector ==========
document.querySelectorAll('.time-range-selector').forEach(selector => {
    const buttons = selector.querySelectorAll('.time-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Update chart data based on selected time range
            updateChartTimeRange(this.textContent);
        });
    });
});

function updateChartTimeRange(range) {
    console.log(`Updating chart data for time range: ${range}`);
    // In production, this would fetch and display data for the selected range
}

// ========== Pipeline Filter Pills ==========
document.querySelectorAll('.pipeline-filters').forEach(filterGroup => {
    const pills = filterGroup.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ========== Update Last Update Time ==========
function updateLastUpdateTime() {
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        updateElement.textContent = formatted;
    }
}

// ========== Action Buttons ==========
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-action')) {
        const action = e.target.textContent;
        const row = e.target.closest('tr');
        const provider = row?.querySelector('td:first-child')?.textContent || 'this provider';
        
        showNotification(`Initiating ${action.toLowerCase()} action for ${provider}`, 'info');
    }
});

// ========== Provider Chip Removal ==========
document.querySelectorAll('.provider-chip i').forEach(icon => {
    icon.addEventListener('click', function() {
        const chip = this.closest('.provider-chip');
        chip.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => chip.remove(), 300);
    });
});

// ========== Add CSS Animations ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ========== Tooltips ==========
document.querySelectorAll('.tooltip-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        const tooltip = this.getAttribute('title');
        if (!tooltip) return;
        
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'custom-tooltip';
        tooltipEl.textContent = tooltip;
        tooltipEl.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            max-width: 250px;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltipEl);
        
        const rect = this.getBoundingClientRect();
        tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 10) + 'px';
        tooltipEl.style.left = (rect.left - tooltipEl.offsetWidth / 2 + rect.width / 2) + 'px';
        
        this.tooltipElement = tooltipEl;
    });
    
    icon.addEventListener('mouseleave', function() {
        if (this.tooltipElement) {
            this.tooltipElement.remove();
            this.tooltipElement = null;
        }
    });
});


// ========== Refresh Data Functionality ==========
document.querySelector('.refresh-status')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    icon.style.animationPlayState = 'running';
    
    showNotification('Refreshing data...', 'info');
    
    setTimeout(() => {
        icon.style.animationPlayState = 'paused';
        updateLastUpdateTime();
        showNotification('Data refreshed successfully', 'success');
    }, 2000);
});

// ========== DATA PIPELINE FUNCTIONALITY ==========

// Initialize Pipeline Sub-Navigation
function initializePipelineNavigation() {
    const pipelineSubnavBtns = document.querySelectorAll('.pipeline-subnav-btn');
    const pipelineViews = document.querySelectorAll('.pipeline-view');
    
    pipelineSubnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-pipeline-view');
            
            // Update active button
            pipelineSubnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active view
            pipelineViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${viewId}-view`) {
                    view.classList.add('active');
                }
            });
        });
    });
}

// Start Flow Animation
function startDataFlowAnimation() {
    const startBtn = document.getElementById('startFlowBtn');
    const resetBtn = document.getElementById('resetFlowBtn');
    const pipelineStages = document.querySelectorAll('.pipeline-stage');
    const journeyViz = document.getElementById('dataJourneyViz');
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Activate journey visualization
            journeyViz.classList.add('active');
            
            // Animate stages sequentially
            pipelineStages.forEach((stage, index) => {
                setTimeout(() => {
                    stage.classList.add('active');
                    
                    // Add glow effect
                    stage.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
                    
                    setTimeout(() => {
                        stage.style.boxShadow = '';
                    }, 800);
                }, index * 700);
            });
            
            // Show notification
            showNotification('Data flow animation started', 'success');
            
            // Deactivate visualization after animation
            setTimeout(() => {
                journeyViz.classList.remove('active');
                showNotification('Data successfully processed through all stages!', 'success');
            }, pipelineStages.length * 700 + 2000);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            pipelineStages.forEach(stage => {
                stage.classList.remove('active');
            });
            journeyViz.classList.remove('active');
            showNotification('Pipeline reset', 'info');
        });
    }
}

// Pipeline Stage Hover Effects
function initializePipelineStageInteractions() {
    const stages = document.querySelectorAll('.pipeline-stage');
    
    stages.forEach(stage => {
        stage.addEventListener('mouseenter', () => {
            const stageType = stage.getAttribute('data-stage');
            showStageTooltip(stage, stageType);
        });
        
        stage.addEventListener('mouseleave', () => {
            hideStageTooltip();
        });
    });
}

// Show Stage Tooltip with Details
function showStageTooltip(stage, stageType) {
    const tooltips = {
        'sources': 'Raw data from TiC, MRF, claims, and provider directories',
        'ingestion': 'Automated data extraction using Kafka streams and batch processes',
        'parsing': 'Schema validation and format standardization across all sources',
        'cleaning': 'Deduplication, outlier detection, and data quality enhancement',
        'identity': 'Entity resolution to link providers across different data sources',
        'normalization': 'Risk adjustment and geographic indexing for fair benchmarking',
        'integration': 'Cross-source joins to create unified analytical datasets',
        'modeling': 'Statistical analysis, ML models, and business intelligence',
        'curated': 'Production-ready datasets optimized for query performance',
        'api': 'RESTful APIs providing secure access to curated insights',
        'dashboards': 'Role-based dashboards for executives, managers, and contracting teams'
    };
    
    const tooltip = tooltips[stageType];
    if (tooltip) {
        // You can implement a custom tooltip display here
        stage.setAttribute('title', tooltip);
    }
}

function hideStageTooltip() {
    // Hide custom tooltip if implemented
}

// Switch to Dashboard Tab from Pipeline
function switchToTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.click();
        }
    });
    
    showNotification(`Switched to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Dashboard`, 'success');
}

// Export Pipeline as Infographic
function exportPipelineInfographic() {
    showNotification('Preparing pipeline infographic for download...', 'info');
    
    setTimeout(() => {
        showNotification('Pipeline infographic exported as PNG', 'success');
    }, 1500);
}

// API Try It Functionality
function initializeAPITryButtons() {
    const tryButtons = document.querySelectorAll('.btn-try-api');
    
    tryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const endpointItem = e.target.closest('.api-endpoint-item');
            const endpoint = endpointItem.querySelector('code').textContent;
            
            showNotification(`Opening API playground for ${endpoint}`, 'info');
            
            // Simulate API call
            setTimeout(() => {
                showNotification('API response: 200 OK', 'success');
            }, 1000);
        });
    });
}

// Data Source Card Interactions
function initializeDataSourceCards() {
    const sourceCards = document.querySelectorAll('.data-source-card');
    
    sourceCards.forEach(card => {
        card.addEventListener('click', () => {
            const sourceName = card.querySelector('h4').textContent;
            showNotification(`Viewing details for ${sourceName}`, 'info');
            
            // Highlight the card
            sourceCards.forEach(c => c.style.border = '2px solid transparent');
            card.style.border = '2px solid var(--primary-blue)';
        });
    });
}

// Initialize all Pipeline features
function initializePipeline() {
    initializePipelineNavigation();
    startDataFlowAnimation();
    initializePipelineStageInteractions();
    initializeAPITryButtons();
    initializeDataSourceCards();
}

// Update DOMContentLoaded to include pipeline initialization
const originalDOMContentLoaded = document.querySelector('script');
document.addEventListener('DOMContentLoaded', function() {
    initializePipeline();
});

// Log initialization
console.log('Network Intelligence Dashboard initialized successfully');
console.log('Data Intelligence Pipeline features loaded');

