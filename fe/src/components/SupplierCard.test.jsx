import { screen, fireEvent } from '@testing-library/react'
import { renderWithStore } from '../test/renderWithStore'
import SupplierCard from './SupplierCard'

const mockSupplier = {
  SupplierId: 1,
  Name: 'Supplier One',
  rates: [
    { SupplierRateId: 1, Rate: 250, RateStartDate: '2020-01-01', RateEndDate: null },
    { SupplierRateId: 2, Rate: 300, RateStartDate: '2023-06-01', RateEndDate: '2024-12-31' },
  ],
}

function renderCard(props = {}) {
  return renderWithStore(<ul><SupplierCard supplier={mockSupplier} {...props} /></ul>)
}

describe('SupplierCard', () => {
  it('renders the supplier name', () => {
    renderCard()
    expect(screen.getByText('Supplier One')).toBeInTheDocument()
  })

  it('renders the rate count', () => {
    renderCard()
    expect(screen.getByText('2 rates')).toBeInTheDocument()
  })

  it('renders each rate value', () => {
    renderCard()
    expect(screen.getByText('£250')).toBeInTheDocument()
    expect(screen.getByText('£300')).toBeInTheDocument()
  })

  it('renders "Ongoing" for a null end date', () => {
    renderCard()
    expect(screen.getByText(/Ongoing/)).toBeInTheDocument()
  })

  it('shows the overlapping rates button when not in modal', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /overlapping rates/i })).toBeInTheDocument()
  })

  it('hides the overlapping rates button when inModal is true', () => {
    renderCard({ inModal: true })
    expect(screen.queryByRole('button', { name: /overlapping rates/i })).not.toBeInTheDocument()
  })

  it('opens the modal when overlapping rates button is clicked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /overlapping rates/i }))
    expect(screen.getByText(`Overlapping rates for Supplier One`)).toBeInTheDocument()
  })
})
