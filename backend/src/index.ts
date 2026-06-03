import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/lexipet',
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Auth Middleware
interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string }
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

// ============================================================
// AUTH ROUTES
// ============================================================
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body

    if (!email || !password || !firstName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex')

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name, role',
      [email, hashedPassword, firstName, lastName, phone, role || 'owner']
    )

    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex')

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user || user.password_hash !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// PETS ROUTES
// ============================================================
app.get('/api/pets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pets WHERE owner_id = $1 ORDER BY created_at DESC', [req.user?.id])
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/pets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, species, breed, age, weight, microchip } = req.body

    const result = await pool.query(
      'INSERT INTO pets (owner_id, name, species, breed, age, weight, microchip) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user?.id, name, species, breed, age, weight, microchip]
    )

    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/pets/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM pets WHERE id = $1 AND owner_id = $2', [req.params.id, req.user?.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Pet not found' })
    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// PRODUCTS ROUTES
// ============================================================
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query
    let query = 'SELECT * FROM products WHERE stock > 0'
    const params: any[] = []

    if (category) {
      query += ' AND category = $1'
      params.push(category)
    }

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT 50'

    const result = await pool.query(query, params)
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' })
    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// VETS ROUTES
// ============================================================
app.get('/api/vets', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT v.*, u.first_name, u.last_name FROM veterinarians v 
       JOIN users u ON v.user_id = u.id 
       WHERE v.is_available = true AND v.verified = true 
       ORDER BY v.rating DESC`
    )
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/vets/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT v.*, u.first_name, u.last_name, u.bio FROM veterinarians v 
       JOIN users u ON v.user_id = u.id 
       WHERE v.id = $1`,
      [req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vet not found' })
    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// ORDERS ROUTES
// ============================================================
app.post('/api/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user?.id, totalAmount, JSON.stringify(shippingAddress), paymentMethod]
    )

    const order = orderResult.rows[0]

    // Add order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.id, item.quantity, item.price]
      )
    }

    res.json({ success: true, data: order })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user?.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// CONSULTATIONS ROUTES
// ============================================================
app.post('/api/consultations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { vetId, petId, scheduledAt, consultationType } = req.body

    const result = await pool.query(
      'INSERT INTO consultations (vet_id, client_id, pet_id, scheduled_at, consultation_type, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [vetId, req.user?.id, petId, scheduledAt, consultationType || 'video', 'scheduled']
    )

    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/consultations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.*, p.name as pet_name, u.first_name, u.last_name FROM consultations c
       JOIN pets p ON c.pet_id = p.id
       JOIN users u ON c.vet_id = u.id
       WHERE c.client_id = $1
       ORDER BY c.scheduled_at DESC`,
      [req.user?.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// INSURANCE ROUTES
// ============================================================
app.get('/api/insurance/plans', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_plans WHERE is_active = true ORDER BY monthly_price')
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/insurance/policies', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { petId, planId } = req.body

    const result = await pool.query(
      'INSERT INTO insurance_policies (user_id, pet_id, plan_id, start_date) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [req.user?.id, petId, planId]
    )

    res.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/insurance/policies', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT p.*, pl.name, pl.monthly_price, pet.name as pet_name FROM insurance_policies p
       JOIN insurance_plans pl ON p.plan_id = pl.id
       JOIN pets pet ON p.pet_id = pet.id
       WHERE p.user_id = $1 AND p.status = 'active'`,
      [req.user?.id]
    )
    res.json({ success: true, data: result.rows })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: '✅ Backend LexiPet Sentinel running' })
})

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: '✅ API LexiPet Sentinel running' })
})

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 LexiPet Sentinel API`)
  console.log(`📊 Server running on port ${PORT}`)
  console.log(`🔗 http://localhost:${PORT}\n`)
})
