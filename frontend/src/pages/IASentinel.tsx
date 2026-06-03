import { useState } from 'react'
import Card from '../components/Card'
import './IASentinel.css'

const IASentinel = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>(
    [{ role: 'ai', text: '👋 Hola, soy LexiSentinel. ¿En qué puedo ayudarte hoy?' }]
  )
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', text: input }])
    setInput('')

    // Simular respuesta IA
    setTimeout(() => {
      const responses = [
        '🔬 Basándome en el historial de Rocky, te recomiendo...',
        '💉 La próxima vacuna vence en 7 días. ¿Quieres agendar?',
        '⚠️ Detecté un patrón en los síntomas reportados.',
      ]
      setMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 1000)
  }

  return (
    <div className="ia-sentinel">
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-teal)', marginBottom: '1rem' }}>
        <i className="fas fa-robot" style={{ color: 'var(--primary-teal)' }}></i> IA Sentinel
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Asistente clínico inteligente entrenado con +120M de registros</p>

      <div className="ia-layout">
        <Card className="chat-window">
          <div className="chat-header">
            <div style={{ fontSize: '1.8rem' }}>🤖</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2px' }}>LexiSentinel v3.2</h4>
              <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>En línea · Responde en segundos</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}><i className="fas fa-paper-plane"></i></button>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '1rem' }}><i className="fas fa-dog"></i> Paciente Activo</h5>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem' }}>🐕</div>
              <div>
                <p style={{ fontWeight: 800, color: 'var(--text-dark)' }}>Rocky</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Golden Retriever · 3 años</p>
              </div>
            </div>
          </Card>
          <Card>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '1rem' }}><i className="fas fa-calendar"></i> Próximas Acciones</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Vacuna Bordetella</span>
                <strong style={{ color: 'var(--alert-red)' }}>Vence 3 Jun</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Desparasitación</span>
                <strong style={{ color: 'var(--accent-amber)' }}>Vence 15 Jun</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IASentinel
