import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'
import type { ApiResponse, SalesReport, ExpenseReport, StockReport } from '@/types/api'

export interface DashboardStats {
  todaySales: {
    count: number
    revenue: number
    profit: number
  }
  todayExpenses: number
  lowStockCount: number
  activeCustomers: number
  recentSales: any[]
  topProducts: Array<{
    product: any
    quantitySold: number
    revenue: number
  }>
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    
    getSalesReport: builder.query<SalesReport, { startDate: string; endDate: string; period?: string }>({
      query: (params) => ({
        url: '/reports/sales',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getExpenseReport: builder.query<ExpenseReport, { startDate: string; endDate: string; period?: string }>({
      query: (params) => ({
        url: '/reports/expenses',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getStockReport: builder.query<StockReport, void>({
      query: () => '/reports/stock',
      providesTags: ['Report'],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetSalesReportQuery,
  useGetExpenseReportQuery,
  useGetStockReportQuery,
} = dashboardApi
