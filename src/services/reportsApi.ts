import { api } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type {
  ApiResponse,
  PaginatedResponse,
  SalesReport,
  ExpenseReport,
  StockReport,
  Sale,
  Expense,
  SalesFilter,
  ExpenseFilter,
  DateRangeFilter,
} from '@/types';

// Reports API with pagination support
export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Sales Reports
    getSalesReport: builder.query<ApiResponse<SalesReport>, DateRangeFilter & { period?: string }>({
      query: (params) => ({
        url: API_ENDPOINTS.REPORTS_SALES,
        params,
      }),
      providesTags: ['Report'],
    }),

    // Paginated Sales List for Reports
    getSalesList: builder.query<ApiResponse<PaginatedResponse<Sale>>, SalesFilter>({
      query: (params) => ({
        url: API_ENDPOINTS.SALES,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Sale' as const, id })),
              { type: 'Sale', id: 'LIST' },
            ]
          : [{ type: 'Sale', id: 'LIST' }],
    }),

    // Expense Reports
    getExpenseReport: builder.query<ApiResponse<ExpenseReport>, DateRangeFilter & { period?: string }>({
      query: (params) => ({
        url: API_ENDPOINTS.REPORTS_EXPENSES,
        params,
      }),
      providesTags: ['Report'],
    }),

    // Paginated Expenses List for Reports
    getExpensesList: builder.query<ApiResponse<PaginatedResponse<Expense>>, ExpenseFilter>({
      query: (params) => ({
        url: API_ENDPOINTS.EXPENSES,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Expense' as const, id })),
              { type: 'Expense', id: 'LIST' },
            ]
          : [{ type: 'Expense', id: 'LIST' }],
    }),

    // Stock Report
    getStockReport: builder.query<ApiResponse<StockReport>, void>({
      query: () => API_ENDPOINTS.REPORTS_STOCK,
      providesTags: ['Report'],
    }),

    // Export Sales Report (CSV/PDF)
    exportSalesReport: builder.mutation<Blob, SalesFilter & { format: 'csv' | 'pdf' }>({
      query: (params) => ({
        url: `${API_ENDPOINTS.REPORTS_SALES}/export`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Export Expenses Report (CSV/PDF)
    exportExpensesReport: builder.mutation<Blob, ExpenseFilter & { format: 'csv' | 'pdf' }>({
      query: (params) => ({
        url: `${API_ENDPOINTS.REPORTS_EXPENSES}/export`,
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetSalesReportQuery,
  useGetSalesListQuery,
  useGetExpenseReportQuery,
  useGetExpensesListQuery,
  useGetStockReportQuery,
  useExportSalesReportMutation,
  useExportExpensesReportMutation,
} = reportsApi;
