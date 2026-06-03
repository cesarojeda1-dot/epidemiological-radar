// User & Auth
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'owner' | 'vet' | 'admin' | 'pharmacy'
  phone: string
  profileImage?: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  firstName: string
  lastName: string
  role: string
  phone: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Pet
export interface Pet {
  id: string
  ownerId: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed: string
  age: number
  weight: number
  microchip: string
  vaccinationDate: string
  medicalHistory?: string
  createdAt: string
}

// Products
export interface Product {
  id: string
  name: string
  description: string
  category: 'medicine' | 'nutrition' | 'accessory' | 'grooming'
  price: number
  requiresPrescription: boolean
  stock: number
  manufacturer?: string
  createdAt: string
}

export interface CartItem extends Product {
  quantity: number
}

// Orders
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

// Teleconsultation
export interface Vet {
  id: string
  userId: string
  firstName: string
  lastName: string
  specialty: string
  licenseNumber: string
  consultationFee: number
  isAvailable: boolean
  avatar?: string
  bio?: string
}

export interface Consultation {
  id: string
  vetId: string
  clientId: string
  petId: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  scheduledAt: string
  duration: number // minutes
  notes?: string
  prescription?: string
  createdAt: string
}

// Insurance
export interface InsurancePlan {
  id: string
  name: string
  monthlyPrice: number
  coverage: number
  features: string[]
  deductible: number
  isFeatured?: boolean
}

export interface InsurancePolicy {
  id: string
  userId: string
  petId: string
  planId: string
  status: 'active' | 'inactive' | 'cancelled'
  startDate: string
  endDate: string
  claims: Claim[]
  createdAt: string
}

// Claims
export interface Claim {
  id: string
  policyId: string
  amount: number
  description: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// Prescriptions
export interface Prescription {
  id: string
  vetId: string
  petId: string
  medication: string
  dosage: string
  duration: string
  notes?: string
  issuedAt: string
  expiresAt: string
}

// Lab Results
export interface LabTest {
  id: string
  petId: string
  testType: string
  results: Record<string, any>
  notes?: string
  performedAt: string
}

// Address
export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
