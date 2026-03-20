import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_SHARED_SECRET}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: (id) => id ? `/suppliers/${id}` : '/suppliers',
    }),
    getOverlaps: builder.query({
      query: (id) => id ? `/overlaps/${id}` : '/overlaps',
    }),
  }),
})

export const { useGetSuppliersQuery, useGetOverlapsQuery, useLazyGetOverlapsQuery } = suppliersApi
