import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseApi'

export interface Customer {
  id: number
  name: string
  email: string
  location: string
  phone: string
  package: {
    id: number
    name: string
  } | null
  packageId: number | null
}

export interface CustomerSearchParams {
  search?: string
  page?: number
  pageSize?: number
}

interface GetCustomersResponse {
  status: boolean
  payload: Customer[]
}

interface GetCustomerResponse {
  status: boolean
  payload: Customer
}

interface UpdateCustomerParams {
  id: number
  data: Partial<Customer>
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], CustomerSearchParams>({
      query: ({ search = '', page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        params.append('page', page.toString())
        params.append('pageSize', pageSize.toString())
        return `/customers?${params.toString()}`
      },
      transformResponse: (response: GetCustomersResponse) => response.payload,
      providesTags: ['Customers'],
    }),
    getCustomer: builder.query<Customer, number>({
      query: (id) => `/customers/${id}`,
      transformResponse: (response: GetCustomerResponse) => response.payload,
      providesTags: (result, error, id) => [{ type: 'Customers', id }],
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation<Customer, UpdateCustomerParams>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customers', id }],
    }),
    deleteCustomer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
  }),
})

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi
