// Application constants and configuration

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  LIMITS: [10, 25, 50, 100],
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',

  // Users
  USERS: '/users',
  USER_TYPES: '/user-types',

  // Products/Stock
  PRODUCTS: '/stock',
  CATEGORIES: '/categories',
  STOCK_MOVEMENTS: '/stock/movements',

  // Sales
  SALES: '/sales',
  SALES_ITEMS: '/sales/items',

  // Customers
  CUSTOMERS: '/customers',

  // Expenses
  EXPENSES: '/expenses',

  // Reports
  REPORTS_SALES: '/sales/reports',
  REPORTS_EXPENSES: '/expenses/reports',
  REPORTS_STOCK: '/stock/reports',
  REPORTS_DASHBOARD: '/dashboard/stats',

  // Shops
  SHOPS: '/shops',

  // Activity Logs
  ACTIVITY_LOGS: '/activity-logs',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pos_auth_token',
  REFRESH_TOKEN: 'pos_refresh_token',
  USER: 'pos_user',
  THEME: 'pos_theme',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  STAFF: 'staff',
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
] as const;

// Payment Status
export const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
] as const;

// Report periods
export const REPORT_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
] as const;

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Supplies',
  'Maintenance',
  'Transportation',
  'Insurance',
  'Other',
] as const;

// Toast messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  SAVE_SUCCESS: 'Changes saved successfully.',
  SAVE_ERROR: 'Failed to save changes.',
  DELETE_SUCCESS: 'Deleted successfully.',
  DELETE_ERROR: 'Failed to delete.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: 'hsl(var(--primary))',
  SECONDARY: 'hsl(var(--secondary))',
  SUCCESS: 'hsl(142, 76%, 36%)',
  WARNING: 'hsl(38, 92%, 50%)',
  DANGER: 'hsl(0, 84%, 60%)',
  INFO: 'hsl(199, 89%, 48%)',
} as const;
