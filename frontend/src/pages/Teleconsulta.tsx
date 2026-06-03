import Card from '../components/Card'
import './Teleconsulta.css'

const Teleconsulta = () => {
  const vets = [
    { name: 'Dra. Valeria Torres', specialty: 'Medicina Interna', price: 45, status: 'Disponible', emoji: '👩‍⚕️' },
    { name: 'Dr. Luis Paredes', specialty: 'Cirugía', price: 65, status: 'En consulta', emoji: '👨‍⚕️' },
    { name: 'Dra. Ana Quispe', specialty: 'Nutrición', price: 40, status: 'Disponible', emoji: '👩‍⚕️' },
    { name: 'Dr. Marco Salinas', specialty: 'Cardiología', price: 80, status: 'Disponible', emoji: '👨‍⚕️' },
  ]

  return (
    <div className="teleconsulta">
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-teal)', marginBottom: '1rem' }}>
        <i className="fas fa-video"></i> Teleconsulta Veterinaria
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Conecta con médicos certificados en tiempo real</p>

      <div className="stats-row">
        <div className="stat-card"><strong style={{ color: 'var(--green-accent)' }}>47</strong><span>Vets en línea</span></div>
        <div className="stat-card"><strong>3 min</strong><span>Tiempo de espera</span></div>
        <div className="stat-card"><strong>1,240</strong><span>Consultas hoy</span></div>
        <div className="stat-card"><strong>4.9 ⭐</strong><span>Valoración</span></div>
      </div>

      <div className="vets-grid">
        {vets.map((vet, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem' }}>{vet.emoji}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{vet.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{vet.specialty}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', fontWeight: 700, marginTop: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--green-accent)', borderRadius: '50%', marginRight: '6px' }}></span>
                  {vet.status}
                </p>
              </div>
              <strong style={{ color: 'var(--dark-teal)', fontSize: '1.1rem' }}>S/ {vet.price}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button style={{ padding: '0.75rem', background: 'var(--primary-teal)', color: 'white', borderRadius: '8px', fontWeight: 700 }} onClick={() => alert('Iniciando videollamada...')}>
                <i className="fas fa-video"></i> Video
              </button>
              <button style={{ padding: '0.75rem', background: 'var(--light-teal)', color: 'var(--dark-teal)', borderRadius: '8px', fontWeight: 700 }} onClick={() => alert('Abriendo chat...')}>
                <i className="fas fa-comment"></i> Chat
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Teleconsulta
