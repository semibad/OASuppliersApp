import { configureStore } from '@reduxjs/toolkit'
import { suppliersApi } from './suppliersApi'

export const store = configureStore({
  reducer: {
    [suppliersApi.reducerPath]: suppliersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(suppliersApi.middleware),
})
