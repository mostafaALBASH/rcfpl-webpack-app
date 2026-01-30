/**
 * FPL Return Consistency - Data Interfaces Documentation
 * 
 * This file documents all data structures used in the application.
 * These interfaces define the contract between frontend and backend/data sources.
 * 
 * @version 1.0.0
 * @date January 29, 2026
 */

// ============================================================================
// PLAYER DATA INTERFACES
// ============================================================================

/**
 * Main player metrics interface
 * Represents a single player's return consistency metrics
 */
export interface PlayerMetrics {
  /** Unique identifier for the player */
  id: number;
  
  /** Player's display name (e.g., "Salah", "Haaland") */
  web_name: string;
  
  /** Club abbreviation (e.g., "LIV", "MCI", "ARS") */
  team: string;
  
  /** Player position: "GKP" | "DEF" | "MID" | "FWD" */
  element_type: PlayerPosition;
  
  /** Number of appearances (matches with minutes > 0) */
  matches_counted: number;
  
  /** Count of matches with 5+ FPL points */
  returns_5plus_count: number;
  
  /** Raw return rate percentage (returns / matches * 100) */
  return_rate_raw: number;
  
  /** Smoothed return rate using plus-four adjustment: (x+2)/(n+4) * 100 */
  return_rate_smooth: number;
  
  /** Count of matches with 0-2 FPL points (blanks) */
  blanks_le2_count: number;
  
  /** Blank rate percentage (blanks / matches * 100) */
  blanks_rate: number;
  
  /** Count of matches with 10+ FPL points (hauls) */
  hauls_10plus_count: number;
  
  /** Average FPL points per appearance */
  points_avg: number;
  
  /** Points standard deviation (volatility measure) */
  points_sd: number;
  
  /** 
   * Composite consistency score (0-100 percentile)
   * Weights: 55% return rate + 25% low volatility + 20% low blanks
   * Players with <6 matches get score of 0
   */
  consistency_score: number;
}

/**
 * Player position enum
 */
export type PlayerPosition = 'GKP' | 'DEF' | 'MID' | 'FWD';

/**
 * Position display configuration
 */
export interface PositionConfig {
  code: PlayerPosition;
  label: string;
  emoji: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

// ============================================================================
// FILTER & SORT INTERFACES
// ============================================================================

/**
 * Filter state for player list
 */
export interface FilterState {
  /** Search query for player name */
  searchQuery: string;
  
  /** Selected club filter (empty string = all clubs) */
  selectedClub: string;
  
  /** Selected position filter (empty string = all positions) */
  selectedPosition: PlayerPosition | '';
  
  /** Current sort column */
  currentSortBy: SortableColumn;
  
  /** Current sort direction */
  currentSortOrder: SortOrder;
}

/**
 * Temporary filter state (used in mobile filter panel)
 */
export interface TempFilterState {
  tempSearchQuery: string;
  tempClub: string;
  tempPosition: PlayerPosition | '';
  tempSortBy: SortableColumn;
  tempSortOrder: SortOrder;
}

/**
 * Sortable columns
 */
export type SortableColumn = 
  | 'web_name'
  | 'team'
  | 'element_type'
  | 'matches_counted'
  | 'returns_5plus_count'
  | 'return_rate_raw'
  | 'return_rate_smooth'
  | 'blanks_le2_count'
  | 'blanks_rate'
  | 'hauls_10plus_count'
  | 'points_avg'
  | 'points_sd'
  | 'consistency_score';

/**
 * Sort order direction
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  key: SortableColumn;
  label: string;
  emoji?: string;
}

// ============================================================================
// VIEW STATE INTERFACES
// ============================================================================

/**
 * View mode enum
 */
export type ViewMode = 'card' | 'table';

/**
 * Pagination state
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Total number of filtered players */
  totalPlayers: number;
}

/**
 * UI state
 */
export interface UIState {
  /** Current view mode */
  viewMode: ViewMode;
  
  /** Mobile filter panel open state */
  filterPanelOpen: boolean;
  
  /** View change notification visibility */
  showViewChangeNotification: boolean;
  
  /** View change notification message */
  viewChangeMessage: string;
}

// ============================================================================
// ALPINE.JS COMPONENT INTERFACE
// ============================================================================

/**
 * Main Alpine.js component data structure
 */
export interface FplViewerComponent extends FilterState, TempFilterState, PaginationState, UIState {
  /** All player data (unfiltered) */
  allData: PlayerMetrics[];
  
  /** Current page data (filtered and paginated) */
  data: PlayerMetrics[];
  
  /** List of unique clubs for filter dropdown */
  clubs: string[];
  
  /** Search debounce timeout reference */
  searchTimeout: NodeJS.Timeout | null;
  
  /** Computed property: table headers */
  readonly headers: string[];
  
  // Methods
  init(): void;
  loadClubs(): void;
  loadData(page: number): void;
  getFilteredData(): PlayerMetrics[];
  debounceSearch(): void;
  filterByClub(): void;
  filterByPosition(): void;
  toggleSort(column: SortableColumn): void;
  
  // Filter panel methods
  openFilterPanel(): void;
  closeFilterPanel(): void;
  applyFilters(): void;
  hasActiveFilters(): boolean;
  getActiveFilterCount(): number;
  clearSearch(): void;
  clearClub(): void;
  clearPosition(): void;
  resetSort(): void;
  clearAllFilters(): void;
  clearAllFiltersPanel(): void;
  
  // View methods
  showViewNotification(message: string): void;
  
  // Utility methods
  getColumnLabel(header: string): string;
  getColumnTooltip(header: string): string;
  getPositionIcon(position: PlayerPosition): string;
  getSortLabel(sortKey: SortableColumn): string;
  formatScore(score: number, row: PlayerMetrics): string;
  isLowSample(row: PlayerMetrics): boolean;
  formatValue(header: string, value: any, row: PlayerMetrics): string | number;
  download(): void;
  initTooltips(): void;
}

// ============================================================================
// COLUMN CONFIGURATION INTERFACES
// ============================================================================

/**
 * Column label mapping
 */
export interface ColumnLabels {
  [key: string]: string;
}

/**
 * Column tooltip mapping
 */
export interface ColumnTooltips {
  [key: string]: string;
}

/**
 * Column configuration
 */
export interface ColumnConfig {
  key: SortableColumn;
  label: string;
  tooltip: string;
  sortable: boolean;
  align?: 'left' | 'right' | 'center';
  minWidth?: string;
  colorClass?: string;
  isBold?: boolean;
}

// ============================================================================
// API/DATA SOURCE INTERFACES
// ============================================================================

/**
 * API Response wrapper (if using a backend API)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

/**
 * Player metrics API response
 */
export interface PlayerMetricsResponse extends ApiResponse<PlayerMetrics[]> {
  meta?: {
    total: number;
    page?: number;
    pageSize?: number;
    lastUpdated?: string;
  };
}

/**
 * Clubs list API response
 */
export interface ClubsResponse extends ApiResponse<string[]> {
  meta?: {
    total: number;
    season?: string;
  };
}

// ============================================================================
// CSV EXPORT INTERFACES
// ============================================================================

/**
 * CSV export options
 */
export interface CsvExportOptions {
  /** Filename for the download */
  filename: string;
  
  /** Include headers row */
  includeHeaders: boolean;
  
  /** Delimiter character */
  delimiter: string;
  
  /** Filtered data to export */
  data: PlayerMetrics[];
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  /** Default page size for pagination */
  defaultPageSize: number;
  
  /** Minimum search query length */
  minSearchLength: number;
  
  /** Search debounce delay (ms) */
  searchDebounceDelay: number;
  
  /** Resize debounce delay (ms) */
  resizeDebounceDelay: number;
  
  /** Notification display duration (ms) */
  notificationDuration: number;
  
  /** Responsive breakpoints */
  breakpoints: {
    mobile: number;    // < 768px
    tablet: number;    // >= 768px
    desktop: number;   // >= 1024px
  };
  
  /** Low sample threshold for consistency score */
  lowSampleThreshold: number;
}

/**
 * Position display configurations
 */
export const POSITION_CONFIGS: Record<PlayerPosition, PositionConfig> = {
  GKP: {
    code: 'GKP',
    label: 'Goalkeeper',
    emoji: '🧤',
    color: {
      bg: 'bg-purple-900/30',
      text: 'text-purple-400',
      border: 'border-purple-500'
    }
  },
  DEF: {
    code: 'DEF',
    label: 'Defender',
    emoji: '🛡️',
    color: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-400',
      border: 'border-blue-500'
    }
  },
  MID: {
    code: 'MID',
    label: 'Midfielder',
    emoji: '⚡',
    color: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      border: 'border-green-500'
    }
  },
  FWD: {
    code: 'FWD',
    label: 'Forward',
    emoji: '🎯',
    color: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-500'
    }
  }
};

/**
 * Default application configuration
 */
export const DEFAULT_CONFIG: AppConfig = {
  defaultPageSize: 10,
  minSearchLength: 1,
  searchDebounceDelay: 300,
  resizeDebounceDelay: 150,
  notificationDuration: 2000,
  breakpoints: {
    mobile: 768,
    tablet: 768,
    desktop: 1024
  },
  lowSampleThreshold: 6
};

// ============================================================================
// UTILITY TYPE DEFINITIONS
// ============================================================================

/**
 * Deep partial - makes all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Required deep - makes all properties required recursively
 */
export type RequiredDeep<T> = {
  [P in keyof T]-?: T[P] extends object ? RequiredDeep<T[P]> : T[P];
};

/**
 * Player metrics keys as union type
 */
export type PlayerMetricsKey = keyof PlayerMetrics;

/**
 * Numeric player metrics only
 */
export type NumericMetrics = Pick<
  PlayerMetrics,
  | 'matches_counted'
  | 'returns_5plus_count'
  | 'return_rate_raw'
  | 'return_rate_smooth'
  | 'blanks_le2_count'
  | 'blanks_rate'
  | 'hauls_10plus_count'
  | 'points_avg'
  | 'points_sd'
  | 'consistency_score'
>;

/**
 * String player metrics only
 */
export type StringMetrics = Pick<
  PlayerMetrics,
  'web_name' | 'team' | 'element_type'
>;

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Player metrics validator
 */
export interface PlayerMetricsValidator {
  validate(data: PlayerMetrics): ValidationResult;
  validateBatch(data: PlayerMetrics[]): ValidationResult;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example player data
 */
export const EXAMPLE_PLAYER: PlayerMetrics = {
  id: 1,
  web_name: "Salah",
  team: "LIV",
  element_type: "MID",
  matches_counted: 20,
  returns_5plus_count: 15,
  return_rate_raw: 75.0,
  return_rate_smooth: 70.8,
  blanks_le2_count: 3,
  blanks_rate: 15.0,
  hauls_10plus_count: 8,
  points_avg: 6.5,
  points_sd: 3.2,
  consistency_score: 92
};

/**
 * Example filter state
 */
export const EXAMPLE_FILTERS: FilterState = {
  searchQuery: "",
  selectedClub: "",
  selectedPosition: "",
  currentSortBy: "points_avg",
  currentSortOrder: "desc"
};
