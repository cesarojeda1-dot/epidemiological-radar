-- ============================================================
-- LEXIPET SENTINEL - DATABASE SCHEMA
-- PostgreSQL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'vet', 'pharmacy', 'admin')),
  phone VARCHAR(20),
  profile_image VARCHAR(500),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- PETS TABLE
-- ============================================================
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed VARCHAR(100),
  age DECIMAL(3,1),
  weight DECIMAL(5,2),
  microchip VARCHAR(50) UNIQUE,
  date_of_birth DATE,
  medical_history TEXT,
  allergies TEXT,
  medications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_microchip ON pets(microchip);

-- ============================================================
-- VETERINARIANS TABLE
-- ============================================================
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  specialization VARCHAR(100),
  clinic_name VARCHAR(100),
  clinic_address TEXT,
  consultation_fee DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2),
  total_consultations INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vets_license ON veterinarians(license_number);
CREATE INDEX idx_vets_available ON veterinarians(is_available);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('medicine', 'nutrition', 'accessory', 'grooming')),
  price DECIMAL(10,2) NOT NULL,
  requires_prescription BOOLEAN DEFAULT false,
  stock INT NOT NULL DEFAULT 0,
  manufacturer VARCHAR(100),
  supplier_id UUID,
  image_url VARCHAR(500),
  sku VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- CONSULTATIONS TABLE
-- ============================================================
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vet_id UUID NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INT DEFAULT 30,
  consultation_type VARCHAR(50) CHECK (consultation_type IN ('video', 'audio', 'text')),
  notes TEXT,
  prescription TEXT,
  cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consultations_vet ON consultations(vet_id);
CREATE INDEX idx_consultations_client ON consultations(client_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- ============================================================
-- PRESCRIPTIONS TABLE
-- ============================================================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vet_id UUID NOT NULL REFERENCES veterinarians(id),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id),
  medication VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100),
  duration_days INT,
  instructions TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_vet ON prescriptions(vet_id);
CREATE INDEX idx_prescriptions_pet ON prescriptions(pet_id);
CREATE INDEX idx_prescriptions_expires ON prescriptions(expires_at);

-- ============================================================
-- INSURANCE PLANS TABLE
-- ============================================================
CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10,2) NOT NULL,
  coverage_amount DECIMAL(10,2) NOT NULL,
  deductible DECIMAL(10,2) DEFAULT 0,
  features JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INSURANCE POLICIES TABLE
-- ============================================================
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES insurance_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  premium_amount DECIMAL(10,2),
  next_payment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_user ON insurance_policies(user_id);
CREATE INDEX idx_policies_status ON insurance_policies(status);

-- ============================================================
-- CLAIMS TABLE
-- ============================================================
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  claim_date DATE NOT NULL,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approval_date TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);

-- ============================================================
-- LAB TESTS TABLE
-- ============================================================
CREATE TABLE lab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES veterinarians(id),
  test_type VARCHAR(100) NOT NULL,
  results JSONB,
  notes TEXT,
  reference_values JSONB,
  performed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lab_tests_pet ON lab_tests(pet_id);
CREATE INDEX idx_lab_tests_type ON lab_tests(test_type);

-- ============================================================
-- VACCINATIONS TABLE
-- ============================================================
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES veterinarians(id),
  vaccine_name VARCHAR(100) NOT NULL,
  vaccine_batch VARCHAR(50),
  administered_at DATE NOT NULL,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vaccinations_pet ON vaccinations(pet_id);
CREATE INDEX idx_vaccinations_due ON vaccinations(next_due_date);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- INSERT SAMPLE DATA
-- ============================================================

-- Insurance Plans
INSERT INTO insurance_plans (name, monthly_price, coverage_amount, deductible, is_featured, features) VALUES
('Básico', 39.00, 2000.00, 100.00, false, '{"emergencies": 3, "includes": ["basic_consultations", "vaccines"]}'),
('Premium', 89.00, 8000.00, 50.00, true, '{"emergencies": "unlimited", "includes": ["surgeries", "lab_tests", "consultations"]}'),
('Elite', 159.00, 99999.00, 0.00, false, '{"emergencies": "unlimited", "includes": ["everything", "dental", "oncology", "travel"]}');

-- Create indexes for performance
CREATE INDEX idx_users_created ON users(created_at DESC);
CREATE INDEX idx_pets_created ON pets(created_at DESC);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_consultations_scheduled ON consultations(scheduled_at DESC);
