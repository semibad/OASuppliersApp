import { useState } from 'react'
import { useLazyGetOverlapsQuery } from '../store/suppliersApi'
import Modal from './Modal'
import './SupplierCard.css'

function formatDate(dateStr) {
  if (!dateStr) return 'Ongoing'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function SupplierCard({ supplier, inModal = false }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [fetchOverlaps, { data: overlaps, isLoading, isError }] = useLazyGetOverlapsQuery()

  function handleShowOverlaps() {
    fetchOverlaps(supplier.SupplierId)
    setModalOpen(true)
  }

  return (
    <>
      <li className="supplier-card">
        <div className="supplier-header">
          <span className="supplier-name">{supplier.Name}</span>
          <div className="supplier-header-actions">
            <span className="rate-count">{supplier.rates.length} rate{supplier.rates.length !== 1 ? 's' : ''}</span>
            {!inModal && <button className="btn-show-overlaps" onClick={handleShowOverlaps}>Overlapping rates for this supplier</button>}
          </div>
        </div>
        {supplier.rates.length > 0 && (
          <ul className="rates">
            {supplier.rates.map((rate) => (
              <li key={rate.SupplierRateId} className="rate-row">
                <span className="rate-value">£{rate.Rate}</span>
                <span className="rate-range">
                  {formatDate(rate.RateStartDate)}
                  <span className="rate-arrow">→</span>
                  {formatDate(rate.RateEndDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </li>

      {modalOpen && (
        <Modal title={`Overlapping rates for ${supplier.Name}`} onClose={() => setModalOpen(false)}>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Failed to load overlaps.</p>}
          {overlaps && overlaps.length === 0 && <p>No overlaps found.</p>}
          {overlaps && overlaps.length > 0 && (
            <ul>
              {overlaps.map((s) => (
                <SupplierCard key={s.SupplierId} supplier={s} inModal />
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  )
}

export default SupplierCard
