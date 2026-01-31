/**
 * FPL Return Consistency - Utility Functions
 * Reusable helper functions for data processing and formatting
 */

import { APP_CONFIG, NUMERIC_COLUMNS, TABLE_COLUMN_STYLES } from './config.js';

// ============================================================================
// DATA FILTERING & SORTING
// ============================================================================

/**
 * Check if a player has a low sample size
 * @param {Object} player - Player data object
 * @returns {boolean}
 */
export function isLowSample(player) {
  return (player.matches_counted || 0) < APP_CONFIG.MIN_MATCHES_FOR_SCORE;
}

/**
 * Filter data based on search query, club, and position
 * All filters work together - they are combined, not exclusive
 * @param {Array} data - Full dataset
 * @param {string} searchQuery - Search term
 * @param {string} selectedClub - Selected club filter
 * @param {string} selectedPosition - Selected position filter
 * @returns {Array} Filtered dataset
 */
export function filterData(data, searchQuery, selectedClub, selectedPosition) {
  let filtered = [...data];

  // Apply search filter (by player name)
  if (searchQuery && searchQuery.length >= APP_CONFIG.MIN_SEARCH_CHARS) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(row => 
      (row.web_name || '').toLowerCase().includes(query)
    );
  }

  // Apply club filter (works with search)
  if (selectedClub) {
    filtered = filtered.filter(row => row.team === selectedClub);
  }

  // Apply position filter (works with search and club)
  if (selectedPosition) {
    filtered = filtered.filter(row => row.element_type === selectedPosition);
  }

  return filtered;
}

/**
 * Sort data by specified column and order
 * @param {Array} data - Dataset to sort
 * @param {string} sortBy - Column to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Array} Sorted dataset
 */
export function sortData(data, sortBy, sortOrder) {
  return data.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    // Numeric sorting
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
    }

    // String sorting
    const aStr = String(aVal || '').toLowerCase();
    const bStr = String(bVal || '').toLowerCase();
    return sortOrder === 'desc' 
      ? bStr.localeCompare(aStr) 
      : aStr.localeCompare(bStr);
  });
}

/**
 * Get filtered and sorted data
 * @param {Array} allData - Full dataset
 * @param {Object} filters - Filter and sort options
 * @returns {Array} Processed dataset
 */
export function getProcessedData(allData, filters) {
  const { searchQuery, selectedClub, selectedPosition, sortBy, sortOrder } = filters;
  
  // Filter first
  const filtered = filterData(allData, searchQuery, selectedClub, selectedPosition);
  
  // Then sort
  return sortData(filtered, sortBy, sortOrder);
}

/**
 * Paginate data
 * @param {Array} data - Full dataset
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} Paginated result with data and metadata
 */
export function paginateData(data, page, pageSize) {
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIdx, startIdx + pageSize);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    totalItems: data.length
  };
}

// ============================================================================
// DATA EXTRACTION & VALIDATION
// ============================================================================

/**
 * Extract unique clubs from data
 * @param {Array} data - Full dataset
 * @returns {Array} Sorted array of unique club names
 */
export function extractClubs(data) {
  return [...new Set(data.map(row => row.team))]
    .filter(Boolean)
    .sort();
}

/**
 * Get headers from data object (excluding id) in custom display order
 * @param {Array} data - Dataset
 * @returns {Array} Header names in desired order
 */
export function getHeaders(data) {
  if (data.length === 0) return [];
  
  // Define the desired column order based on UX requirements
  const desiredOrder = [
    'web_name',           // Player
    'team',               // Team
    'element_type',       // Position
    'matches_counted',    // Matches
    'points_avg',         // Avg Points (moved after Matches)
    'returns_5plus_count', // 5+ Returns
    'return_rate_raw',    // Return Rate
    'return_rate_smooth', // Return Rate (Smoothed)
    'blanks_le2_count',   // Blanks (≤2)
    'blanks_rate',        // Blank Rate
    'hauls_10plus_count', // Hauls (10+)
    'points_sd',          // Points Volatility
    'consistency_score'   // Consistency Score (remains at end)
  ];
  
  // Get all available keys from data (excluding 'id')
  const availableKeys = Object.keys(data[0]).filter(h => h !== 'id');
  
  // Return keys in desired order, followed by any additional keys not in the order
  const orderedKeys = desiredOrder.filter(key => availableKeys.includes(key));
  const remainingKeys = availableKeys.filter(key => !desiredOrder.includes(key));
  
  return [...orderedKeys, ...remainingKeys];
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Format consistency score with low sample indication
 * @param {number|string} score - Score value
 * @param {Object} player - Player data object
 * @returns {string} Formatted score
 */
export function formatConsistencyScore(score, player) {
  if (isLowSample(player)) {
    return '0';
  }
  return score || '0';
}

/**
 * Format value with HTML for special cases (low sample)
 * @param {string} header - Column header
 * @param {*} value - Cell value
 * @param {Object} row - Row data
 * @returns {string} Formatted HTML string
 */
export function formatCellValue(header, value, row) {
  if (header === 'consistency_score' && isLowSample(row)) {
    return value === 0 || value === '0' 
      ? '<span class="text-slate-500">0 <span class="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded">Low sample</span></span>' 
      : value;
  }
  return value;
}

// ============================================================================
// CSS CLASS HELPERS
// ============================================================================

/**
 * Check if a column is numeric
 * @param {string} header - Column header
 * @returns {boolean}
 */
export function isNumericColumn(header) {
  return NUMERIC_COLUMNS.includes(header);
}

/**
 * Get table column CSS classes
 * @param {string} header - Column header
 * @param {number} index - Column index
 * @param {boolean} isHeaderRow - Whether this is for header row
 * @returns {Array} Array of CSS classes
 */
export function getTableColumnClasses(header, index, isHeaderRow = false) {
  const classes = ['px-3 sm:px-5 py-3 sm:py-4'];
  const config = TABLE_COLUMN_STYLES[header] || {};

  // First column (sticky)
  if (index === 0) {
    classes.push('sticky left-0 z-10 bg-slate-800 border-r border-slate-700/50');
    if (isHeaderRow) {
      classes.push('z-20 bg-gradient-to-r from-slate-800 to-slate-700');
    }
  }

  // Add min-width if specified
  if (config.minWidth) {
    classes.push(config.minWidth);
  }

  // Add color if specified
  if (config.color) {
    classes.push(config.color);
  }

  // Add font weight if specified
  if (config.fontWeight) {
    classes.push(config.fontWeight);
  }

  // Add alignment
  if (config.align) {
    classes.push(config.align);
  } else if (index > 0 && isNumericColumn(header)) {
    classes.push('text-right');
  } else {
    classes.push('text-left');
  }

  // Add tabular-nums for numeric columns in body rows
  if (!isHeaderRow && isNumericColumn(header)) {
    classes.push('tabular-nums');
  }

  // Add whitespace handling
  if (isHeaderRow) {
    classes.push('whitespace-nowrap');
  }

  // Header specific styles
  if (isHeaderRow) {
    classes.push('font-semibold text-slate-200 cursor-pointer hover:bg-slate-700 transition-all duration-200');
  } else {
    classes.push('text-slate-100');
    if (index === 0) {
      classes.push('font-semibold text-blue-300');
    }
  }

  return classes;
}

// ============================================================================
// CSV EXPORT
// ============================================================================

/**
 * Generate CSV from data
 * @param {Array} data - Dataset to export
 * @returns {string} CSV string
 */
export function generateCSV(data) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  let csv = headers.join(',') + '\r\n';
  
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h];
      // Escape values with commas or quotes
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csv += values.join(',') + '\r\n';
  });

  return csv;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csvContent, filename = 'fpl_return_consistency.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ============================================================================
// VIEW MODE DETECTION
// ============================================================================

/**
 * Get initial view mode based on screen size
 * @returns {string} 'card' or 'table'
 */
export function getInitialViewMode() {
  return window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT ? 'card' : 'table';
}

/**
 * Check if current screen is mobile
 * @returns {boolean}
 */
export function isMobile() {
  return window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT;
}

/**
 * Check if current screen is large
 * @returns {boolean}
 */
export function isLargeScreen() {
  return window.innerWidth >= APP_CONFIG.LARGE_SCREEN_BREAKPOINT;
}
