import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend LexiPet Sentinel running ✅' })
})

// Rutas API
app.get('/api/dashboard', (req: Request, res: Response) => {
  res.json({
    users: 50247,
    consultations: 1284,
    revenue: 84320,
    alerts: 3,
  })
})

app.get('/api/products', (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Bravecto 1000mg', price: 98 },
    { id: 2, name: 'Royal Canin', price: 142 },
    { id: 3, name: 'Frontline Plus', price: 34 },
    { id: 4, name: 'Collar GPS', price: 89 },
  ])
})

app.get('/api/vets', (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Dra. Valeria Torres', specialty: 'Medicina Interna', price: 45 },
    { id: 2, name: 'Dr. Luis Paredes', specialty: 'Cirugía', price: 65 },
  ])
})

app.post('/api/payment', (req: Request, res: Response) => {
  const { amount, concept } = req.body
  res.json({ success: true, transactionId: 'TXN-' + Date.now(), amount, concept })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
