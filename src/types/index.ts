// Core TypeScript types and interfaces for POS System

// ============= Common Types =============
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============= Auth Types =============
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  shopId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'cashier' | 'staff';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ============= Product/Stock Types =============
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  category?: Category;
  price: number;
  costPrice: number;
  quantity: number;
  minStockLevel: number;
  unit: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  userId: string;
  user?: User;
  createdAt: string;
}

// ============= Sales Types =============
export interface Sale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  userId: string;
  user?: User;
  shopId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

// ============= Customer Types =============
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalPurchases: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= Expense Types =============
export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
  user?: User;
  shopId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Report Types =============
export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalDiscount: number;
  totalTax: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesByPaymentMethod: Array<{
    method: PaymentMethod;
    count: number;
    total: number;
  }>;
  dailyBreakdown?: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
}

export interface ExpenseReport {
  period: string;
  totalExpenses: number;
  expensesByCategory: Array<{
    category: string;
    total: number;
    count: number;
  }>;
  dailyBreakdown?: Array<{
    date: string;
    total: number;
  }>;
}

export interface StockReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: Product[];
  outOfStockItems: Product[];
  recentMovements: StockMovement[];
}

// ============= Dashboard Types =============
export interface DashboardStats {
  todaySales: {
    count: number;
    revenue: number;
    profit: number;
  };
  todayExpenses: number;
  lowStockCount: number;
  activeCustomers: number;
  recentSales: Sale[];
  topProducts: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
  }>;
}

// ============= Filter Types =============
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface SalesFilter extends PaginationParams, Partial<DateRangeFilter> {
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface StockFilter extends PaginationParams {
  categoryId?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
}

export interface ExpenseFilter extends PaginationParams, Partial<DateRangeFilter> {
  category?: string;
  minAmount?: number;
  maxAmount?: number;
}
