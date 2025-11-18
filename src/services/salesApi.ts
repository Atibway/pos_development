import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'

export interface SaleItem {
  stockId: number
  quantity: number
  date: string
  shopId: number
  unitPrice: number
  clientType: string
}

export interface CreateSalePayload {
  sales: SaleItem[]
  customerId: number | null
  paymentDate: string | null
  loan: boolean
  shopId: number
  clientType: string
}

export interface Sale {
  id: number
  date: string
  quantity: number
  createdAt: string
  paid: boolean
  clientType: string
  unitPrice: number
  stock: {
    id: number
    name: string
    productCode: string
    price: number
    pv: number
    bv: number
  }
  customer: {
    id: number
    name: string
    email: string
  } | null
  shop: {
    id: number
    name: string
    location: string
  }
}

export interface Shop {
  id: number
  name: string
  location: string
  issuedStocks: IssuedStock[]
}

export interface IssuedStock {
  stockId: number
  productCode: string
  name: string
  description: string
  price: number
  qty: number
  pv: number
  bv: number
  totalPv: number
  totalBv: number
  total: number
  halfPrice: boolean
  issuedAt: string
}

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation<{ status: boolean; payload: Sale[] }, CreateSalePayload>({
      query: (payload) => ({
        url: '/sales',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Sales', 'Stock'],
    }),
    getSales: builder.query<Sale[], { page?: number }>({
      query: ({ page = 1 }) => `/sales?page=${page}`,
      transformResponse: (response: { status: boolean; payload: Sale[] }) => response.payload,
      providesTags: ['Sales'],
    }),
    getUserShops: builder.query<Shop[], number>({
      query: (userId) => `/shops/${userId}`,
      transformResponse: (response: Shop[] | { payload: Shop[] }) => 
        Array.isArray(response) ? response : response.payload || [],
      providesTags: ['Shops'],
    }),
    deleteSale: builder.mutation<{ message: string }, number>({
      query: (saleId) => ({
        url: `/sales/${saleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sales', 'Stock'],
    }),
  }),
})

export const {
  useCreateSaleMutation,
  useGetSalesQuery,
  useGetUserShopsQuery,
  useDeleteSaleMutation,
} = salesApi
