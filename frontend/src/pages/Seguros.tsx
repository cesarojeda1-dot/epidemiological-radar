import Card from '../components/Card'
import './Seguros.css'

const Seguros = () => {
  const plans = [
    { name: 'Básico', price: 39, icon: '🐕', features: ['Emergencias limitadas', 'Vacunas cubiertas', 'Hasta S/2,000'] },
    { name: 'Premium', price: 89, icon: '⭐', features: ['Emergencias ilimitadas', 'Cirugías incluidas', 'Hasta S/8,000'], popular: true },
    { name: 'Elite', price: 159, icon: '👑', features: ['Cobertura total', 'Dental completo', 'Sin límite'] },
  ]

  return (
    <div className="seguros">
      <div className="insurance-hero">
        <h2><i className="fas fa-shield-dog"></i> LexiShield — Seguros para Mascotas</h2>
        <p>Protección inteligente con liquidación automática en menos de 24 horas</p>
      </div>

      <div className="policy-grid">
        {plans.map((plan, idx) => (
          <Card key={idx} className="policy-card">
            {plan.popular && <div className="popular-badge">⭐ MÁS POPULAR</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">S/ {plan.price}<span>/mes</span></div>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}><i className="fas fa-check"></i> {feature}</li>
              ))}
            </ul>
            <button className="btn-plan" onClick={() => alert(`Plan ${plan.name} contratado`)}>Contratar</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Seguros
