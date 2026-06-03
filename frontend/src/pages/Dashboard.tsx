import Card from '../components/Card'
import './Dashboard.css'

const Dashboard = () => {
  const stats = [
    { title: 'Usuarios Activos', value: '50,247', icon: '👥', color: '#0F766E' },
    { title: 'Consultas Hoy', value: '1,284', icon: '📞', color: '#1E3A8A' },
    { title: 'Revenue del Día', value: 'S/84,320', icon: '💰', color: '#065F46' },
    { title: 'Alertas Activas', value: '3', icon: '🚨', color: '#92400E' },
  ]

  const modules = [
    { title: 'Dueños y Pacientes', icon: '👥', desc: 'App B2C sincronizada' },
    { title: 'Médicos Veterinarios', icon: '🏥', desc: 'Red médica activa' },
    { title: 'Clínicas Veterinarias', icon: '🏨', desc: 'Nodos al 99.9%' },
    { title: 'Laboratorios LIMS', icon: '🔬', desc: 'API LIMS conectada' },
    { title: 'PetShop & Farmacia', icon: '💊', desc: 'Logística integrada' },
    { title: 'Seguros para Mascotas', icon: '🛡️', desc: 'Smart Contracts' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Ecosistema Global LexiPet</h1>
        <p>Infraestructura unificada para Dueños, Veterinarios, Laboratorios, Farmacias y Seguros.</p>
      </div>

      <div className="kpi-row">
        {stats.map((stat, idx) => (
          <div key={idx} className="kpi-card" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}>
            <div className="kpi-value">{stat.value}</div>
            <div className="kpi-label">{stat.title}</div>
            <div className="kpi-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="modules-grid">
        {modules.map((module, idx) => (
          <Card key={idx}>
            <div className="module-header">
              <div className="module-icon">{module.icon}</div>
              <h3>{module.title}</h3>
            </div>
            <p className="module-desc">{module.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
