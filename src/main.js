// Import dependencies
import Alpine from 'alpinejs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import metricsData from '../metrics_latest.json';

// Make tippy globally available
window.tippy = tippy;

// Column configuration
const COLUMN_LABELS = {
  'web_name': 'Player',
  'team': 'Team',
  'element_type': 'Position',
  'matches_counted': 'Matches',
  'returns_5plus_count': '✨ 5+ Returns',
  'return_rate_raw': '✨ Return Rate',
  'return_rate_smooth': 'Return Rate (Smoothed)',
  'blanks_le2_count': 'Blanks (≤2)',
  'blanks_rate': 'Blank Rate',
  'hauls_10plus_count': 'Hauls (10+)',
  'points_avg': 'Avg Points',
  'points_sd': 'Points Volatility',
  'consistency_score': 'Consistency Score'
};

const COLUMN_TOOLTIPS = {
  'web_name': 'Player name',
  'team': 'Club (abbreviated)',
  'element_type': 'GKP (Goalkeeper), DEF (Defender), MID (Midfielder), FWD (Forward)',
  'matches_counted': 'Appearances only (minutes > 0). All metrics calculated from these matches.',
  'returns_5plus_count': '5+ point returns (threshold used by this tool). Count of matches where player scored 5 or more FPL points.',
  'return_rate_raw': 'Raw return rate (%) = returns / matches. Unadjusted proportion.',
  'return_rate_smooth': 'Smoothed return rate (%) using plus-four adjustment (x+2)/(n+4). Stabilizes small-sample estimates. Default display.',
  'blanks_le2_count': 'Blanks = matches with 0–2 points. Per Premier League glossary: "blanked" means failed to return more than appearance points.',
  'blanks_rate': 'Blank rate (%) = blanks / matches. Lower = more reliable floor.',
  'hauls_10plus_count': '10+ point hauls. Double-digit games. Not an official FPL term but useful for upside measurement.',
  'points_avg': 'Average FPL points per appearance. Descriptive statistic only.',
  'points_sd': 'Points volatility (population SD). Spread/variability of match-to-match points. Higher = more streaky/unpredictable.',
  'consistency_score': 'Percentile-based composite (0–100). Weights: 55% return rate + 25% low volatility + 20% low blanks. Higher = more reliable fantasy asset. Players with <6 matches excluded from percentile calculation.'
};

// Alpine component
function fplViewer() {
  return {
    allData: metricsData,
    data: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    clubs: [],
    selectedClub: '',
    selectedPosition: '',
    searchQuery: '',
    currentSortBy: 'points_avg',
    currentSortOrder: 'desc',
    searchTimeout: null,
    totalPlayers: 0,
    viewMode: window.innerWidth < 768 ? 'card' : 'table', // Auto-detect on init
    
    // Filter Panel State
    filterPanelOpen: false,
    tempSearchQuery: '',
    tempClub: '',
    tempPosition: '',
    tempSortBy: 'points_avg',
    tempSortOrder: 'desc',
    
    // View change notification
    viewChangeMessage: '',
    showViewChangeNotification: false,

    get headers() {
      return this.data.length > 0 ? Object.keys(this.data[0]).filter(h => h !== 'id') : [];
    },

    getColumnLabel(header) {
      return COLUMN_LABELS[header] || header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    },

    getColumnTooltip(header) {
      return COLUMN_TOOLTIPS[header] || '';
    },

    getPositionIcon(position) {
      const icons = {
        'GKP': '🧤 GKP',
        'DEF': '🛡️ DEF',
        'MID': '⚡ MID',
        'FWD': '🎯 FWD'
      };
      return icons[position] || position;
    },

    getSortLabel(sortKey) {
      const labels = {
        'points_avg': 'Avg Points',
        'consistency_score': 'Consistency',
        'return_rate_smooth': 'Return Rate',
        'returns_5plus_count': '5+ Returns',
        'hauls_10plus_count': 'Hauls',
        'blanks_rate': 'Blank Rate',
        'points_sd': 'Volatility',
        'matches_counted': 'Matches',
        'web_name': 'Name'
      };
      return labels[sortKey] || sortKey;
    },

    formatScore(score, row) {
      if (this.isLowSample(row)) {
        return '0';
      }
      return score || '0';
    },

    // Filter Panel Functions
    openFilterPanel() {
      // Sync temp values with current filters
      this.tempSearchQuery = this.searchQuery;
      this.tempClub = this.selectedClub;
      this.tempPosition = this.selectedPosition;
      this.tempSortBy = this.currentSortBy;
      this.tempSortOrder = this.currentSortOrder;
      this.filterPanelOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeFilterPanel() {
      this.filterPanelOpen = false;
      document.body.style.overflow = '';
    },

    applyFilters() {
      // Apply all temp values to actual filters
      this.searchQuery = this.tempSearchQuery;
      this.selectedClub = this.tempClub;
      this.selectedPosition = this.tempPosition;
      this.currentSortBy = this.tempSortBy;
      this.currentSortOrder = this.tempSortOrder;
      
      this.loadData(1);
      this.closeFilterPanel();
    },

    hasActiveFilters() {
      return this.searchQuery || this.selectedClub || this.selectedPosition || this.currentSortBy !== 'points_avg';
    },

    getActiveFilterCount() {
      let count = 0;
      if (this.searchQuery) count++;
      if (this.selectedClub) count++;
      if (this.selectedPosition) count++;
      if (this.currentSortBy !== 'points_avg') count++;
      return count;
    },

    clearSearch() {
      this.searchQuery = '';
      this.loadData(1);
    },

    clearClub() {
      this.selectedClub = '';
      this.loadData(1);
    },

    clearPosition() {
      this.selectedPosition = '';
      this.loadData(1);
    },

    resetSort() {
      this.currentSortBy = 'points_avg';
      this.currentSortOrder = 'desc';
      this.loadData(1);
    },

    clearAllFilters() {
      this.searchQuery = '';
      this.selectedClub = '';
      this.selectedPosition = '';
      this.currentSortBy = 'points_avg';
      this.currentSortOrder = 'desc';
      this.loadData(1);
    },

    clearAllFiltersPanel() {
      this.tempSearchQuery = '';
      this.tempClub = '';
      this.tempPosition = '';
      this.tempSortBy = 'points_avg';
      this.tempSortOrder = 'desc';
    },

    init() {
      this.loadClubs();
      this.loadData(1);
      this.initTooltips();
      
      // Dynamic view mode switching on window resize
      let resizeTimeout;
      
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const currentWidth = window.innerWidth;
          const isMobile = currentWidth < 768;
          const isLargeScreen = currentWidth >= 1024;
          
          if (isMobile && this.viewMode === 'table') {
            this.viewMode = 'card';
            this.showViewNotification('📱 Switched to Card View');
          } else if (isLargeScreen && this.viewMode === 'card') {
            this.viewMode = 'table';
            this.showViewNotification('📊 Switched to Table View');
          }
        }, 150); // Debounce resize events
      });

      // Close filter panel on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.filterPanelOpen) {
          this.closeFilterPanel();
        }
      });
    },

    showViewNotification(message) {
      this.viewChangeMessage = message;
      this.showViewChangeNotification = true;
      setTimeout(() => {
        this.showViewChangeNotification = false;
      }, 2000);
    },

    initTooltips() {
      this.$nextTick(() => {
        document.querySelectorAll('th[data-header]').forEach(th => {
          const header = th.getAttribute('data-header');
          const tooltip = this.getColumnTooltip(header);
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

    loadClubs() {
      const uniqueClubs = [...new Set(this.allData.map(row => row.team))].filter(Boolean).sort();
      this.clubs = uniqueClubs;
    },

    loadData(page = 1) {
      try {
        const filteredData = this.getFilteredData();

        // Calculate pagination
        this.totalPlayers = filteredData.length;
        this.totalPages = Math.ceil(filteredData.length / this.pageSize) || 1;
        
        // Validate and set page
        this.currentPage = Math.max(1, Math.min(page, this.totalPages));

        // Paginate data
        const startIdx = (this.currentPage - 1) * this.pageSize;
        this.data = filteredData.slice(startIdx, startIdx + this.pageSize);

        this.initTooltips();
      } catch (err) {
        console.error('Load error:', err);
        this.data = [];
      }
    },

    getFilteredData() {
      let filtered = [...this.allData];

      // Apply search filter (overrides club/position)
      if (this.searchQuery.length >= 1) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(row => (row.web_name || '').toLowerCase().includes(query));
      } else {
        // Apply club filter
        if (this.selectedClub) {
          filtered = filtered.filter(row => row.team === this.selectedClub);
        }
        // Apply position filter
        if (this.selectedPosition) {
          filtered = filtered.filter(row => row.element_type === this.selectedPosition);
        }
      }

      // Sort data
      return filtered.sort((a, b) => {
        const aVal = a[this.currentSortBy];
        const bVal = b[this.currentSortBy];
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        // Numeric sorting
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return this.currentSortOrder === 'desc' ? bNum - aNum : aNum - bNum;
        }

        // String sorting
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        return this.currentSortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
      });
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadData(1);
      }, 300);
    },

    filterByClub() {
      this.loadData(1);
    },

    filterByPosition() {
      this.loadData(1);
    },

    toggleSort(column) {
      if (this.currentSortBy === column) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSortBy = column;
        this.currentSortOrder = 'desc';
      }
      this.loadData(1);
    },

    isLowSample(row) {
      return (row.matches_counted || 0) < 6;
    },

    formatValue(header, value, row) {
      if (header === 'consistency_score' && this.isLowSample(row)) {
        return value === 0 || value === '0' 
          ? '<span class="text-slate-500">0 <span class="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded">Low sample</span></span>' 
          : value;
      }
      return value;
    },

    download() {
      const filteredData = this.getFilteredData();
      if (filteredData.length === 0) return;

      const headers = Object.keys(filteredData[0]);
      let csv = headers.join(',') + '\r\n';
      
      filteredData.forEach(row => {
        const values = headers.map(h => {
          const val = row[h];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        csv += values.join(',') + '\r\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'fpl_return_consistency.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };
}

window.fplViewer = fplViewer;
Alpine.start();
