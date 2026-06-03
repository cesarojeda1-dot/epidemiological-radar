import { useState } from 'react'
import Card from '../components/Card'
import './Farmacia.css'

const Farmacia = () => {
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    { id: 1, name: 'Bravecto 1000mg', emoji: '💊', price: 98, desc: 'Antipulgas 3 meses' },
    { id: 2, name: 'Royal Canin', emoji: '🥩', price: 142, desc: 'Nutrición premium' },
    { id: 3, name: 'Frontline Plus', emoji: '💧', price: 34, desc: 'Antiparásito' },
    { id: 4, name: 'Collar GPS', emoji: '🦮', price: 89, desc: 'Con localización' },
  ]

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="farmacia">
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-teal)', marginBottom: '1rem' }}>
        <span style={{ marginRight: '0.5rem' }}>💊</span> Farmacia & PetShop
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Medicamentos, nutrición y accesorios con validación automática de recetas</p>

      <div className="farmacia-layout">
        <div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>🔍</button>
          </div>

          <div className="products-grid">
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
              <Card key={product.id}>
                <div style={{ fontSize: '3rem', textAlign: 'center' }}>{product.emoji}</div>
                <h4 style={{ fontWeight: 800, marginTop: '0.5rem' }}>{product.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.desc}</p>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--dark-teal)', marginTop: '0.5rem' }}>S/ {product.price}</div>
                <button className="btn-add-cart" onClick={() => addToCart(product)}>
                  <i className="fas fa-cart-plus"></i> Agregar
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--dark-teal)' }}>🛒 Carrito ({cart.length})</h3>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Tu carrito está vacío</p>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.emoji} {item.name}</span>
                  <strong>S/ {item.price}</strong>
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark-teal)', marginBottom: '1rem' }}>
                  <span>Total:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <button style={{ width: '100%', padding: '0.75rem', background: 'var(--primary-teal)', color: 'white', borderRadius: '8px', fontWeight: 800 }}
                  onClick={() => alert('Redirigiendo a pago...')}
                >
                  Pagar con LexiPay
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Farmacia
