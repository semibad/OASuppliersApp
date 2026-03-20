import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { suppliersApi } from '../store/suppliersApi'

function makeStore() {
  return configureStore({
    reducer: { [suppliersApi.reducerPath]: suppliersApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(suppliersApi.middleware),
  })
}

export function renderWithStore(ui) {
  return render(<Provider store={makeStore()}>{ui}</Provider>)
}
