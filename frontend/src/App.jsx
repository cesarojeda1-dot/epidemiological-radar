import React from 'react'
import Navbar from './components/Navbar'
import RadarMap from './components/RadarMap'
import Dashboard from './components/Dashboard'
import VetContact from './components/VetContact'
import GovernmentPanel from './components/GovernmentPanel'

export default function App(){
  return (
    <div>
      <Navbar />
      <main style={{maxWidth:1200, margin:'2rem auto', padding:'0 1rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 420px', gap:'1rem'}}>
          <div>
            <RadarMap />
            <Dashboard />
          </div>
          <aside>
            <VetContact />
            <GovernmentPanel />
          </aside>
        </div>
      </main>
    </div>
  )
}
