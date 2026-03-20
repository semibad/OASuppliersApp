import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithStore } from './test/renderWithStore'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    renderWithStore(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'OA Suppliers App' })).toBeInTheDocument()
  })

  it('shows the "Show overlapping rates" button initially', () => {
    renderWithStore(<App />)
    expect(screen.getByRole('button', { name: 'Show overlapping rates' })).toBeInTheDocument()
  })

  it('loads and displays suppliers', async () => {
    renderWithStore(<App />)
    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
      expect(screen.getByText('Supplier Two')).toBeInTheDocument()
    })
  })

  it('toggles to OverlapsView when the button is clicked', async () => {
    renderWithStore(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Show overlapping rates' }))
    expect(screen.getByText('All Overlapping Rates')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show all suppliers' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
    })
  })

  it('toggles back to SuppliersView when clicked again', async () => {
    renderWithStore(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Show overlapping rates' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show all suppliers' }))
    expect(screen.getByText('All Suppliers')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
    })
  })
})
