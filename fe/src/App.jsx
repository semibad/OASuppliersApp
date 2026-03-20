import { useState } from 'react'
import SuppliersView from './states/SuppliersView'
import OverlapsView from './states/OverlapsView'
import './App.css'

function App() {
  const [showOverlaps, setShowOverlaps] = useState(false)

  return (
    <div>
      <div className="page-header">
        <h1>OA Suppliers App</h1>
        <button className="btn-overlaps" onClick={() => setShowOverlaps((v) => !v)}>
          {showOverlaps ? 'Show all suppliers' : 'Show overlapping rates'}
        </button>
      </div>
      {showOverlaps ? <OverlapsView /> : <SuppliersView />}
    </div>
  )
}

export default App;
