import { useGetOverlapsQuery } from '../store/suppliersApi'
import SupplierList from '../components/SupplierList'

function OverlapsView() {
  const { data, isLoading, isError } = useGetOverlapsQuery()

  return <SupplierList title="All Overlapping Rates" data={data} isLoading={isLoading} isError={isError} />
}

export default OverlapsView
