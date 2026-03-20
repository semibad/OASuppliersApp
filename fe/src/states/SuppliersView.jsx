import { useGetSuppliersQuery } from '../store/suppliersApi'
import SupplierList from '../components/SupplierList'

function SuppliersView() {
  const { data, isLoading, isError } = useGetSuppliersQuery()

  return <SupplierList title="All Suppliers" data={data} isLoading={isLoading} isError={isError} />
}

export default SuppliersView
