/**
 * FPL Return Consistency - Configuration File
 * All constants and configuration in one place for easy maintenance
 */

// ============================================================================
// APPLICATION CONSTANTS
// ============================================================================

export const APP_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SORT_BY: 'points_avg',
  DEFAULT_SORT_ORDER: 'desc',
  
  // Thresholds
  MIN_MATCHES_FOR_SCORE: 6,
  MOBILE_BREAKPOINT: 768,
  LARGE_SCREEN_BREAKPOINT: 1024,
  
  // Search
  SEARCH_DEBOUNCE_DELAY: 300,
  MIN_SEARCH_CHARS: 1,
  
  // Notifications
  NOTIFICATION_DURATION: 2000,
  RESIZE_DEBOUNCE_DELAY: 150,
};

// ============================================================================
// COLUMN CONFIGURATION
// ============================================================================

export const COLUMN_LABELS = {
  'web_name': 'PLAYER',
  'team': 'TEAM',
  'element_type': 'POSITION',
  'matches_counted': 'MATCHES',
  'returns_5plus_count': '✨ 5+ RETURNS',
  'return_rate_raw': '✨ RETURN RATE',
  'return_rate_smooth': 'RETURN RATE (SMOOTHED)',
  'blanks_le2_count': 'BLANKS (≤2)',
  'blanks_rate': 'BLANK RATE',
  'hauls_10plus_count': 'HAULS (10+)',
  'points_avg': 'AVG POINTS',
  'points_sd': 'POINTS VOLATILITY',
  'consistency_score': 'CONSISTENCY SCORE'
};

export const COLUMN_TOOLTIPS = {
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

// ============================================================================
// POSITION CONFIGURATION
// ============================================================================

export const POSITION_CONFIG = {
  'GKP': {
    icon: '🧤',
    label: 'GKP',
    fullName: 'Goalkeeper',
    display: '🧤 GKP'
  },
  'DEF': {
    icon: '🛡️',
    label: 'DEF',
    fullName: 'Defender',
    display: '🛡️ DEF'
  },
  'MID': {
    icon: '⚡',
    label: 'MID',
    fullName: 'Midfielder',
    display: '⚡ MID'
  },
  'FWD': {
    icon: '🎯',
    label: 'FWD',
    fullName: 'Forward',
    display: '🎯 FWD'
  }
};

// ============================================================================
// SORT OPTIONS CONFIGURATION
// ============================================================================

export const SORT_OPTIONS = [
  { value: 'points_avg', label: 'Avg Points', icon: '📊' },
  { value: 'consistency_score', label: 'Consistency Score', icon: '⭐' },
  { value: 'return_rate_smooth', label: 'Return Rate', icon: '✨' },
  { value: 'returns_5plus_count', label: '5+ Returns Count', icon: '🎯' },
  { value: 'hauls_10plus_count', label: 'Hauls (10+)', icon: '🚀' },
  { value: 'blanks_rate', label: 'Blank Rate', icon: '📉' },
  { value: 'points_sd', label: 'Volatility (SD)', icon: '📈' },
  { value: 'matches_counted', label: 'Matches', icon: '🏃' },
  { value: 'web_name', label: 'Player Name', icon: '🔤' }
];

// Helper to get sort label by key
export const getSortLabelByKey = (sortKey) => {
  const option = SORT_OPTIONS.find(opt => opt.value === sortKey);
  return option ? option.label : sortKey;
};

// ============================================================================
// FILTER ICONS AND LABELS
// ============================================================================

export const FILTER_CONFIG = {
  search: { icon: '🔍', label: 'Search' },
  team: { icon: '🏟️', label: 'Team' },
  position: { icon: '⚽', label: 'Position' },
  sort: { icon: '📊', label: 'Sort' }
};

// ============================================================================
// CSS CLASS CONFIGURATIONS (Reusable class sets)
// ============================================================================

export const CSS_CLASSES = {
  // Input/Select base
  input: 'w-full h-12 bg-slate-700 border border-slate-600 rounded-lg px-4 text-slate-100 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
  
  // Buttons
  button: {
    primary: 'rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold transition-all duration-200 hover:from-blue-500 hover:to-blue-600 active:scale-95',
    secondary: 'rounded-lg bg-slate-700 border border-slate-600 text-slate-300 font-medium hover:bg-slate-600 active:scale-95 transition-all duration-200',
    success: 'rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold transition-all duration-200 hover:from-emerald-500 hover:to-emerald-600 active:scale-95'
  },
  
  // Cards
  card: 'bg-gradient-to-br from-slate-800 to-slate-800/80 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-colors duration-200',
  
  // Badges
  badge: {
    default: 'inline-flex items-center px-2.5 py-0.5 rounded-full font-medium',
    team: 'bg-slate-700 text-slate-300',
    position: {
      GKP: 'bg-purple-900/30 text-purple-400',
      DEF: 'bg-blue-900/30 text-blue-400',
      MID: 'bg-green-900/30 text-green-400',
      FWD: 'bg-red-900/30 text-red-400'
    }
  },
  
  // Filter badges
  filterBadge: {
    base: 'filter-badge inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all',
    search: 'bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30',
    team: 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30',
    position: 'bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30',
    sort: 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/30',
    clear: 'bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30'
  },
  
  // Position filter buttons (mobile panel)
  positionButton: {
    base: 'h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium',
    active: {
      GKP: 'bg-purple-600 border-purple-500 text-white',
      DEF: 'bg-blue-600 border-blue-500 text-white',
      MID: 'bg-green-600 border-green-500 text-white',
      FWD: 'bg-red-600 border-red-500 text-white'
    },
    inactive: 'bg-slate-700 border-slate-600 text-slate-300'
  }
};

// ============================================================================
// TABLE COLUMN STYLING
// ============================================================================

export const TABLE_COLUMN_STYLES = {
  'web_name': {
    minWidth: 'min-w-[140px] sm:min-w-[180px]',
    sticky: true,
    align: 'text-left',
    color: 'text-blue-300',
    fontWeight: 'font-semibold'
  },
  'team': {
    minWidth: 'min-w-[100px] sm:min-w-[140px]',
    align: 'text-left'
  },
  'element_type': {
    minWidth: 'min-w-[80px] sm:min-w-[100px]',
    align: 'text-left'
  },
  'points_avg': {
    minWidth: 'min-w-[100px] sm:min-w-[120px]',
    color: '!text-emerald-400',
    fontWeight: 'font-bold',
    align: 'text-right'
  },
  'consistency_score': {
    minWidth: 'min-w-[100px] sm:min-w-[120px]',
    fontWeight: 'font-bold',
    align: 'text-right'
  },
  'returns_5plus_count': {
    color: '!text-green-400',
    fontWeight: 'font-semibold',
    align: 'text-right'
  },
  'return_rate_raw': {
    color: '!text-cyan-400',
    fontWeight: 'font-semibold',
    align: 'text-right'
  },
  'return_rate_smooth': {
    minWidth: 'min-w-[90px] sm:min-w-[110px]',
    align: 'text-right'
  },
  'blanks_le2_count': {
    color: '!text-rose-400',
    fontWeight: 'font-semibold',
    align: 'text-right'
  },
  'hauls_10plus_count': {
    minWidth: 'min-w-[90px] sm:min-w-[110px]',
    align: 'text-right'
  },
  // Default for numeric columns
  numeric: {
    align: 'text-right'
  }
};

// Numeric columns list
export const NUMERIC_COLUMNS = [
  'matches_counted',
  'returns_5plus_count',
  'return_rate_raw',
  'return_rate_smooth',
  'blanks_le2_count',
  'blanks_rate',
  'hauls_10plus_count',
  'points_avg',
  'points_sd',
  'consistency_score'
];

// ============================================================================
// MESSAGES & TEXT CONTENT
// ============================================================================

export const MESSAGES = {
  emptyState: {
    icon: '📭',
    title: 'No players found',
    subtitle: 'Try adjusting your filters or search terms'
  },
  viewChange: {
    card: '📱 Switched to Card View',
    table: '📊 Switched to Table View'
  }
};

// ============================================================================
// EXPORT DEFAULT CONFIG OBJECT
// ============================================================================

export default {
  APP_CONFIG,
  COLUMN_LABELS,
  COLUMN_TOOLTIPS,
  POSITION_CONFIG,
  SORT_OPTIONS,
  FILTER_CONFIG,
  CSS_CLASSES,
  TABLE_COLUMN_STYLES,
  NUMERIC_COLUMNS,
  MESSAGES,
  getSortLabelByKey
};
