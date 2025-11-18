// API Types and Interfaces
export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  payload: T;
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

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'cashier';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  productCode: string;
  price: number;
  costPrice: number;
  quantity: number;
  pv: number;
  bv: number;
  minStockLevel: number;
  categoryId: number;
  category?: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Stock Types
export interface Stock {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  shopId: number;
  shop?: Shop;
  issuedAt: string;
  issuedBy: number;
  issuedByUser?: User;
}

// Sale Types
export interface Sale {
  id: number;
  date: string;
  quantity: number;
  unitPrice: number;
  total: number;
  clientType: 'retail' | 'wholesale';
  paid: boolean;
  stockId: number;
  stock?: Stock;
  customerId?: number;
  customer?: Customer;
  shopId: number;
  shop?: Shop;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleRequest {
  sales: Array<{
    stockId: number;
    quantity: number;
    date: string;
    shopId: number;
    unitPrice: number;
    clientType: string;
  }>;
  customerId?: number;
  paymentDate?: string;
  loan: boolean;
  shopId: number;
  clientType: string;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  packageId?: number;
  package?: Package;
  totalPurchases: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Expense Types
export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: number;
  user?: User;
  shopId: number;
  shop?: Shop;
  createdAt: string;
  updatedAt: string;
}

// Shop Types
export interface Shop {
  id: number;
  name: string;
  location: string;
  managerId: number;
  manager?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalItemsSold: number;
  averageSaleValue: number;
  topProducts: Array<{
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesByShop: Array<{
    shopId: number;
    shopName: string;
    totalSales: number;
    revenue: number;
  }>;
}

export interface ExpenseReport {
  period: string;
  totalExpenses: number;
  expensesByCategory: Array<{
    category: string;
    total: number;
    percentage: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    total: number;
  }>;
}

export interface StockReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockByCategory: Array<{
    categoryId: number;
    categoryName: string;
    totalItems: number;
    totalValue: number;
  }>;
}

// Filter Types
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
