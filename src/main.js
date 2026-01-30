/**
 * FPL Return Consistency - Main Application
 * Refactored for maintainability and clean code structure
 */

// Import dependencies
import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Import custom styles
import './styles.css';

// Import data
import metricsData from '../metrics_latest.json';

// Import configuration and utilities
import {
  APP_CONFIG,
  COLUMN_LABELS,
  COLUMN_TOOLTIPS,
  POSITION_CONFIG,
  SORT_OPTIONS,
  MESSAGES,
  getSortLabelByKey
} from './config.js';

import {
  isLowSample,
  getProcessedData,
  paginateData,
  extractClubs,
  getHeaders,
  formatConsistencyScore,
  formatCellValue,
  getTableColumnClasses,
  generateCSV,
  downloadCSV,
  getInitialViewMode,
  isMobile,
  isLargeScreen
} from './utils.js';

// Make tippy globally available
window.tippy = tippy;

/**
 * Alpine.js Component - FPL Viewer
 * Main application component for viewing and filtering FPL data
 */
function fplViewer() {
  return {
    // ========================================================================
    // DATA STATE
    // ========================================================================
    allData: metricsData,
    data: [],
    clubs: [],
    totalPlayers: 0,

    // ========================================================================
    // PAGINATION STATE
    // ========================================================================
    currentPage: 1,
    totalPages: 0,
    pageSize: APP_CONFIG.DEFAULT_PAGE_SIZE,

    // ========================================================================
    // FILTER STATE
    // ========================================================================
    selectedClub: '',
    selectedPosition: '',
    searchQuery: '',
    searchTimeout: null,

    // ========================================================================
    // SORT STATE
    // ========================================================================
    currentSortBy: APP_CONFIG.DEFAULT_SORT_BY,
    currentSortOrder: APP_CONFIG.DEFAULT_SORT_ORDER,

    // ========================================================================
    // VIEW STATE
    // ========================================================================
    viewMode: getInitialViewMode(),

    // ========================================================================
    // MOBILE FILTER PANEL STATE
    // ========================================================================
    filterPanelOpen: false,
    tempSearchQuery: '',
    tempClub: '',
    tempPosition: '',
    tempSortBy: APP_CONFIG.DEFAULT_SORT_BY,
    tempSortOrder: APP_CONFIG.DEFAULT_SORT_ORDER,

    // ========================================================================
    // NOTIFICATION STATE
    // ========================================================================
    viewChangeMessage: '',
    showViewChangeNotification: false,

    // ========================================================================
    // COMPUTED PROPERTIES
    // ========================================================================

    /**
     * Get table headers from current data
     */
    get headers() {
      return getHeaders(this.data);
    },

    // ========================================================================
    // FORMATTING METHODS
    // ========================================================================

    /**
     * Get column label
     */
    getColumnLabel(header) {
      return COLUMN_LABELS[header] || header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    },

    /**
     * Get column tooltip
     */
    getColumnTooltip(header) {
      return COLUMN_TOOLTIPS[header] || '';
    },

    /**
     * Get position icon and label
     */
    getPositionIcon(position) {
      return POSITION_CONFIG[position]?.display || position;
    },

    /**
     * Get sort label by key
     */
    getSortLabel(sortKey) {
      return getSortLabelByKey(sortKey);
    },

    /**
     * Format consistency score
     */
    formatScore(score, row) {
      return formatConsistencyScore(score, row);
    },

    /**
     * Format cell value with HTML
     */
    formatValue(header, value, row) {
      return formatCellValue(header, value, row);
    },

    /**
     * Check if player has low sample
     */
    isLowSample(row) {
      return isLowSample(row);
    },

    /**
     * Get CSS classes for table columns
     */
    getTableColumnClasses(header, index, isHeaderRow = false) {
      return getTableColumnClasses(header, index, isHeaderRow);
    },

    /**
     * Get CSS classes for table columns
     */
    getTableColumnClasses(header, index, isHeaderRow = false) {
      return getTableColumnClasses(header, index, isHeaderRow);
    },

    // ========================================================================
    // FILTER PANEL METHODS
    // ========================================================================

    /**
     * Open mobile filter panel
     */
    openFilterPanel() {
      this.tempSearchQuery = this.searchQuery;
      this.tempClub = this.selectedClub;
      this.tempPosition = this.selectedPosition;
      this.tempSortBy = this.currentSortBy;
      this.tempSortOrder = this.currentSortOrder;
      this.filterPanelOpen = true;
      document.body.style.overflow = 'hidden';
    },

    /**
     * Close mobile filter panel
     */
    closeFilterPanel() {
      this.filterPanelOpen = false;
      document.body.style.overflow = '';
    },

    /**
     * Apply filters from mobile panel
     */
    applyFilters() {
      this.searchQuery = this.tempSearchQuery;
      this.selectedClub = this.tempClub;
      this.selectedPosition = this.tempPosition;
      this.currentSortBy = this.tempSortBy;
      this.currentSortOrder = this.tempSortOrder;
      
      this.loadData(1);
      this.closeFilterPanel();
    },

    /**
     * Check if any filters are active
     */
    hasActiveFilters() {
      return this.searchQuery || 
             this.selectedClub || 
             this.selectedPosition || 
             this.currentSortBy !== APP_CONFIG.DEFAULT_SORT_BY;
    },

    /**
     * Get count of active filters
     */
    getActiveFilterCount() {
      let count = 0;
      if (this.searchQuery) count++;
      if (this.selectedClub) count++;
      if (this.selectedPosition) count++;
      if (this.currentSortBy !== APP_CONFIG.DEFAULT_SORT_BY) count++;
      return count;
    },

    /**
     * Clear search filter
     */
    clearSearch() {
      this.searchQuery = '';
      this.loadData(1);
    },

    /**
     * Clear club filter
     */
    clearClub() {
      this.selectedClub = '';
      this.loadData(1);
    },

    /**
     * Clear position filter
     */
    clearPosition() {
      this.selectedPosition = '';
      this.loadData(1);
    },

    /**
     * Reset sort to default
     */
    resetSort() {
      this.currentSortBy = APP_CONFIG.DEFAULT_SORT_BY;
      this.currentSortOrder = APP_CONFIG.DEFAULT_SORT_ORDER;
      this.loadData(1);
    },

    /**
     * Clear all filters and reset to defaults
     */
    clearAllFilters() {
      this.searchQuery = '';
      this.selectedClub = '';
      this.selectedPosition = '';
      this.currentSortBy = APP_CONFIG.DEFAULT_SORT_BY;
      this.currentSortOrder = APP_CONFIG.DEFAULT_SORT_ORDER;
      this.loadData(1);
    },

    /**
     * Clear all filters in mobile panel (temp values)
     */
    clearAllFiltersPanel() {
      this.tempSearchQuery = '';
      this.tempClub = '';
      this.tempPosition = '';
      this.tempSortBy = APP_CONFIG.DEFAULT_SORT_BY;
      this.tempSortOrder = APP_CONFIG.DEFAULT_SORT_ORDER;
    },

    // ========================================================================
    // DATA LOADING & PROCESSING
    // ========================================================================

    /**
     * Load clubs list from data
     */
    loadClubs() {
      this.clubs = extractClubs(this.allData);
    },

    /**
     * Load and display data with filters and pagination
     */
    loadData(page = 1) {
      try {
        // Get filtered and sorted data
        const processedData = getProcessedData(this.allData, {
          searchQuery: this.searchQuery,
          selectedClub: this.selectedClub,
          selectedPosition: this.selectedPosition,
          sortBy: this.currentSortBy,
          sortOrder: this.currentSortOrder
        });

        // Apply pagination
        const result = paginateData(processedData, page, this.pageSize);
        
        this.data = result.data;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.totalPlayers = result.totalItems;

        // Re-initialize tooltips after data update
        this.initTooltips();
      } catch (err) {
        console.error('Error loading data:', err);
        this.data = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalPlayers = 0;
      }
    },

    /**
     * Debounced search handler
     */
    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadData(1);
      }, APP_CONFIG.SEARCH_DEBOUNCE_DELAY);
    },

    /**
     * Filter by club
     */
    filterByClub() {
      this.loadData(1);
    },

    /**
     * Filter by position
     */
    filterByPosition() {
      this.loadData(1);
    },

    /**
     * Toggle sort column and order
     */
    toggleSort(column) {
      if (this.currentSortBy === column) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSortBy = column;
        this.currentSortOrder = 'desc';
      }
      this.loadData(1);
    },

    // ========================================================================
    // VIEW & NOTIFICATION METHODS
    // ========================================================================

    /**
     * Show view change notification
     */
    showViewNotification(message) {
      this.viewChangeMessage = message;
      this.showViewChangeNotification = true;
      setTimeout(() => {
        this.showViewChangeNotification = false;
      }, APP_CONFIG.NOTIFICATION_DURATION);
    },

    // ========================================================================
    // EXPORT METHODS
    // ========================================================================

    /**
     * Download filtered data as CSV
     */
    download() {
      const processedData = getProcessedData(this.allData, {
        searchQuery: this.searchQuery,
        selectedClub: this.selectedClub,
        selectedPosition: this.selectedPosition,
        sortBy: this.currentSortBy,
        sortOrder: this.currentSortOrder
      });

      if (processedData.length === 0) {
        console.warn('No data to export');
        return;
      }

      const csv = generateCSV(processedData);
      downloadCSV(csv);
    },

    // ========================================================================
    // TOOLTIP INITIALIZATION
    // ========================================================================

    /**
     * Initialize Tippy.js tooltips on table headers
     */
    initTooltips() {
      this.$nextTick(() => {
        document.querySelectorAll('th[data-header]').forEach(th => {
          const header = th.getAttribute('data-header');
          const tooltip = this.getColumnTooltip(header);
          
          // Only create tooltip if content exists and tooltip not already initialized
          if (tooltip && !th._tippy) {
            tippy(th, {
              content: tooltip,
              theme: 'dark',
              placement: 'top',
              arrow: false,
              interactive: false,
              delay: [0, 0],
              duration: [200, 150]
            });
          }
        });
      });
    },

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize application
     */
    init() {
      // Load initial data
      this.loadClubs();
      this.loadData(1);
      this.initTooltips();
      
      // Setup responsive view mode switching
      this.setupResponsiveViewMode();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
    },

    /**
     * Setup responsive view mode with debounced resize handler
     */
    setupResponsiveViewMode() {
      let resizeTimeout;
      
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (isMobile() && this.viewMode === 'table') {
            this.viewMode = 'card';
            this.showViewNotification(MESSAGES.viewChange.card);
          } else if (isLargeScreen() && this.viewMode === 'card') {
            this.viewMode = 'table';
            this.showViewNotification(MESSAGES.viewChange.table);
          }
        }, APP_CONFIG.RESIZE_DEBOUNCE_DELAY);
      });
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Close filter panel on Escape
        if (e.key === 'Escape' && this.filterPanelOpen) {
          this.closeFilterPanel();
        }
      });
    }
  };
}

// ============================================================================
// EXPORT & INITIALIZE
// ============================================================================

// Make component globally available for Alpine
window.fplViewer = fplViewer;

// Start Alpine.js
Alpine.start();
