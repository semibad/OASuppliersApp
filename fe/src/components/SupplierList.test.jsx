import { render, screen } from '@testing-library/react'
import { renderWithStore } from '../test/renderWithStore'
import SupplierList from './SupplierList'

const mockSuppliers = [
  { SupplierId: 1, Name: 'Supplier One', rates: [] },
  { SupplierId: 2, Name: 'Supplier Two', rates: [] },
]

describe('SupplierList', () => {
  it('renders a title when provided', () => {
    renderWithStore(<SupplierList title="All Suppliers" data={mockSuppliers} />)
    expect(screen.getByText('All Suppliers')).toBeInTheDocument()
  })

  it('renders no title element when title is omitted', () => {
    renderWithStore(<SupplierList data={mockSuppliers} />)
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('renders a card for each supplier', () => {
    renderWithStore(<SupplierList data={mockSuppliers} />)
    expect(screen.getByText('Supplier One')).toBeInTheDocument()
    expect(screen.getByText('Supplier Two')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<SupplierList isLoading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<SupplierList isError />)
    expect(screen.getByText('Failed to load suppliers.')).toBeInTheDocument()
  })

  it('renders nothing when data is absent and no loading or error', () => {
    const { container } = render(<SupplierList />)
    expect(container.querySelector('ul')).not.toBeInTheDocument()
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })
})
