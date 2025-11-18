import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'
import type { Expense, PaginationParams, DateRangeFilter, ApiResponse, PaginatedResponse } from '@/types/api'

export interface ExpenseFilter extends PaginationParams, Partial<DateRangeFilter> {
  category?: string
  minAmount?: number
  maxAmount?: number
}

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<PaginatedResponse<Expense>, ExpenseFilter>({
      query: (params) => ({
        url: '/expenses',
        params,
      }),
      providesTags: ['Expense'],
    }),
    
    getExpense: builder.query<Expense, number>({
      query: (id) => `/expenses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Expense', id }],
    }),
    
    createExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (expense) => ({
        url: '/expenses',
        method: 'POST',
        body: expense,
      }),
      invalidatesTags: ['Expense'],
    }),
    
    updateExpense: builder.mutation<Expense, { id: number; data: Partial<Expense> }>({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Expense', id }],
    }),
    
    deleteExpense: builder.mutation<void, number>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense'],
    }),
    
    getExpenseCategories: builder.query<string[], void>({
      query: () => '/expenses/categories',
      providesTags: ['Expense'],
    }),
  }),
})

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoriesQuery,
} = expensesApi
