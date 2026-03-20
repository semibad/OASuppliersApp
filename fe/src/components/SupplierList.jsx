import SupplierCard from './SupplierCard'

function SupplierList({ title, data, isLoading, isError }) {
  return (
    <div>
      {title && <h2>{title}</h2>}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load suppliers.</p>}
      {data && (
        <ul>
          {data.map((supplier) => (
            <SupplierCard key={supplier.SupplierId} supplier={supplier} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default SupplierList
