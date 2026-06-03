import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { useToastStore } from '../store/toastStore'
import api from '../services/api'
import { Pet } from '../types'
import './Pets.css'

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    weight: '',
    microchip: '',
  })
  const { showMessage } = useToastStore()

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    try {
      const response = await api.get('/pets')
      setPets(response.data.data || [])
    } catch (error) {
      showMessage('Error cargando mascotas', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/pets', formData)
      showMessage('Mascota registrada correctamente', 'success')
      setFormData({ name: '', species: 'dog', breed: '', age: '', weight: '', microchip: '' })
      setShowForm(false)
      loadPets()
    } catch (error: any) {
      showMessage(error.response?.data?.error || 'Error registrando mascota', 'error')
    }
  }

  return (
    <div className="pets-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-teal)' }}>🐾 Mis Mascotas</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Agregar Mascota</button>
      </div>

      {showForm && (
        <Card className="form-card">
          <h3>Registra tu mascota</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Nombre</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Especie</label>
                <select value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}>
                  <option value="dog">Perro</option>
                  <option value="cat">Gato</option>
                  <option value="bird">Pájaro</option>
                  <option value="rabbit">Conejo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Raza</label>
                <input value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Edad (años)</label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Microchip</label>
                <input value={formData.microchip} onChange={(e) => setFormData({ ...formData, microchip: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-submit">Registrar Mascota</button>
          </form>
        </Card>
      )}

      <div className="pets-grid">
        {pets.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No tienes mascotas registradas. ¡Agrega una!
          </p>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--dark-teal)', marginBottom: '0.5rem' }}>{pet.name}</h4>
              <p><strong>Especie:</strong> {pet.species}</p>
              <p><strong>Raza:</strong> {pet.breed}</p>
              <p><strong>Edad:</strong> {pet.age} años</p>
              <p><strong>Peso:</strong> {pet.weight} kg</p>
              <p><strong>Microchip:</strong> {pet.microchip}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Pets
