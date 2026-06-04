import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import RadarMap from './components/RadarMap'
import Dashboard from './components/Dashboard'
import VetContact from './components/VetContact'
import GovernmentPanel from './components/GovernmentPanel'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function App(){
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const res = await axios.get(`${API}/api/cases`)
        if(!mounted) return
        setCases(res.data || [])
      }catch(e){
        console.warn('Could not fetch cases from API, falling back to demo data', e.message)
        // fallback to demo data embedded in RadarMap if API not available
        setError(e.message)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  return (
    <div>
      <Navbar />
      <main style={{maxWidth:1200, margin:'2rem auto', padding:'0 1rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 420px', gap:'1rem'}}>
          <div>
            <RadarMap cases={cases} />
            <Dashboard />
          </div>
          <aside>
            <VetContact />
            <GovernmentPanel />
          </aside>
        </div>
        {loading && <div style={{textAlign:'center', marginTop:12}}>Cargando datos...</div>}
        {error && <div style={{textAlign:'center', marginTop:12, color:'#EF4444'}}>Error cargando datos: {error}</div>}
      </main>
    </div>
  )
}
