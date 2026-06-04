#!/usr/bin/env bash
# run_ghsentinel_all_with_shortcut.sh
# Crea y levanta una instancia local completa de GHSentinel y crea un acceso directo en el Escritorio.
# Uso:
#   1) Guardar como run_ghsentinel_all_with_shortcut.sh
#   2) chmod +x run_ghsentinel_all_with_shortcut.sh
#   3) ./run_ghsentinel_all_with_shortcut.sh
#
# Requisitos: Docker + Docker Compose (o 'docker compose') instalados y funcionando.
set -euo pipefail

ROOT_DIR="./ghsentinel_local"
API_DIR="$ROOT_DIR/backend"
FRONT_DIR="$ROOT_DIR/frontend"

echo
echo "== GHSentinel local: Creando proyecto en: $ROOT_DIR =="
echo

# Verificar Docker
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker no está instalado. Instálalo antes de continuar."
  exit 1
fi

# detectar docker-compose comando
DOCKER_COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  echo "ERROR: ni 'docker-compose' ni 'docker compose' disponibles. Instala Docker Compose."
  exit 1
fi

# Si existe, pedir confirmación para reemplazar
if [ -d "$ROOT_DIR" ]; then
  echo "El directorio $ROOT_DIR ya existe. Se eliminará para crear uno nuevo."
  read -p "¿Continuar y reemplazar $ROOT_DIR? (s/n): " CONF
  if [[ "$CONF" != "s" && "$CONF" != "S" ]]; then
    echo "Abortado."
    exit 0
  fi
  rm -rf "$ROOT_DIR"
fi

mkdir -p "$API_DIR"
mkdir -p "$FRONT_DIR"

echo "Escribiendo archivos del proyecto..."

# docker-compose.yml
cat > "$ROOT_DIR/docker-compose.yml" <<'YML'
version: '3.8'
services:
  mongo:
    image: mongo:6
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"
  api:
    build:
      context: ./backend
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "4000:4000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/ghsentinel
      - PORT=4000
    depends_on:
      - mongo
volumes:
  mongo-data:
YML

# .env
cat > "$ROOT_DIR/.env" <<'ENV'
MONGO_URI=mongodb://mongo:27017/ghsentinel
PORT=4000
JWT_SECRET=changeme
ENV

# backend package.json
cat > "$API_DIR/package.json" <<'JSON'
{
  "name": "ghsentinel-local-api",
  "version": "0.1.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "csv-parse": "^5.3.9",
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.0.3"
  }
}
JSON

# backend Dockerfile
cat > "$API_DIR/Dockerfile" <<'DOCKAPI'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node","server.js"]
DOCKAPI

# model Case.js
mkdir -p "$API_DIR/models"
cat > "$API_DIR/models/Case.js" <<'CASE'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
  species: { type: String, default: 'canine' },
  city: String,
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
  count: { type: Number, default: 1 },
  severity: { type: String, enum: ['low','medium','high'], default: 'low' },
  source: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

CaseSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Case', CaseSchema);
CASE

# routes/cases.js
mkdir -p "$API_DIR/routes"
cat > "$API_DIR/routes/cases.js" <<'CASEAPI'
const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const multer = require('multer');
const csv = require('csv-parse');
const upload = multer();

// GET /api/cases
router.get('/', async (req,res)=>{
  try{
    const items = await Case.find().sort({date:-1}).limit(200);
    res.json(items);
  }catch(e){ res.status(500).json({error:e.message}); }
});

// POST /api/cases
router.post('/', async (req,res)=>{
  try{
    const c = new Case(req.body);
    await c.save();
    res.status(201).json(c);
  }catch(e){ res.status(400).json({error:e.message}); }
});

// POST /api/cases/ingest (file: CSV)
router.post('/ingest', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({error:'No file uploaded'});
    const text = req.file.buffer.toString('utf8');
    csv(text, {columns:true, trim:true}, async (err, records)=>{
      if(err) return res.status(400).json({error:err.message});
      const created = [];
      for(const r of records){
        const doc = new Case({
          species: r.species||r.type||'unknown',
          city: r.city||'',
          location: { type:'Point', coordinates: [ parseFloat(r.lng||r.lon||0), parseFloat(r.lat||0) ] },
          count: parseInt(r.count||1),
          severity: r.severity||'low',
          source: r.source||'csv-ingest',
          date: r.date ? new Date(r.date) : new Date()
        });
        await doc.save();
        created.push(doc);
      }
      res.json({created: created.length});
    });
  }catch(e){ res.status(500).json({error:e.message}); }
});

module.exports = router;
CASEAPI

# server.js
cat > "$API_DIR/server.js" <<'SRV'
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO = process.env.MONGO_URI || 'mongodb://mongo:27017/ghsentinel';
mongoose.set('strictQuery', false);
mongoose.connect(MONGO)
  .then(()=>console.log('Mongo conectado'))
  .catch(e=>console.error('Mongo connect error', e));

// Routes
app.use('/api/cases', require('./routes/cases'));

// Health
app.get('/health', (req,res)=>res.json({status:'ok'}));

// Serve frontend static
const FRONT_DIST = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONT_DIST));
app.get('*', (req,res)=> {
  res.sendFile(path.join(FRONT_DIST, 'index.html'));
});

// Seed demo data if empty
const Case = require('./models/Case');
async function seedIfEmpty(){
  try{
    const count = await Case.countDocuments();
    if(count === 0){
      console.log('Seed demo data: inserting sample cases...');
      await Case.insertMany([
        { species:'canine', city:'Buenos Aires', location:{type:'Point', coordinates:[-58.3816,-34.6037]}, count:12, severity:'medium', source:'demo' },
        { species:'feline', city:'São Paulo', location:{type:'Point', coordinates:[-46.6333,-23.5505]}, count:25, severity:'high', source:'demo' },
        { species:'canine', city:'Lima', location:{type:'Point', coordinates:[-77.0428,-12.0464]}, count:4, severity:'low', source:'demo' },
        { species:'canine', city:'CDMX', location:{type:'Point', coordinates:[-99.1332,19.4326]}, count:18, severity:'medium', source:'demo' }
      ]);
      console.log('Seed complete.');
    } else {
      console.log('Datos ya presentes:', count);
    }
  }catch(e){
    console.error('seed error', e);
  }
}
seedIfEmpty().catch(()=>{});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('API listening on', PORT));
SRV

# frontend index.html (UI demo)
cat > "$FRONT_DIR/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>GHSentinel - Demo</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#F4F7F6}
    header{background:#fff;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee}
    #map{height:480px;border-radius:8px}
    .container{max-width:1100px;margin:20px auto;padding:0 16px}
    .card{background:#fff;border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid #e6e6e6}
    .btn{background:#0D9488;color:#fff;padding:8px 12px;border-radius:20px;border:none;cursor:pointer}
  </style>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<header>
  <div style="font-weight:800;color:#0F766E"><i class="fa-solid fa-shield-dog"></i> GHSentinel</div>
  <div><button class="btn" onclick="location.href='/api/cases'">Ver API /api/cases</button></div>
</header>
<div class="container">
  <div class="card">
    <h3>Radar Epidemiológico - Demo</h3>
    <div id="map"></div>
  </div>
  <div class="card">
    <h4>Tendencia (demo)</h4>
    <canvas id="chart" style="height:200px"></canvas>
  </div>
</div>

<script>
async function loadCases(){
  try{
    const res = await fetch('/api/cases');
    const data = await res.json();
    return data;
  }catch(e){ console.error(e); return [];}
}
function initMap(cases){
  const map = L.map('map').setView([-15.78,-47.93], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
  cases.forEach(c=>{
    if(c.location && c.location.coordinates){
      const [lng, lat] = c.location.coordinates;
      const marker = L.circleMarker([lat, lng], {radius:8, fillColor: c.severity==='high' ? '#ef4444' : '#0D9488', color:'#fff', weight:1, fillOpacity:0.9}).addTo(map);
      marker.bindPopup(`<strong>${c.city}</strong><br/>Casos: ${c.count}<br/>Severidad: ${c.severity}`);
    }
  });
}
function initChart(){
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type:'line',
    data: { labels: Array.from({length:30}, (_,i)=>`D-${30-i}`), datasets:[{label:'Casos', data:Array.from({length:30}, ()=>Math.floor(Math.random()*30)), borderColor:'#0D9488', backgroundColor:'rgba(13,148,136,0.08)', fill:true}] },
    options: {responsive:true, maintainAspectRatio:false}
  });
}
(async ()=>{
  const cases = await loadCases();
  initMap(cases);
  initChart();
})();
</script>
</body>
</html>
HTML

echo "Archivos escritos correctamente."

# Construir y levantar contenedores
cd "$ROOT_DIR"
echo "Construyendo y arrancando contenedores..."
$DOCKER_COMPOSE_CMD up --build -d

echo "Esperando a que la API responda en http://localhost:4000/health ..."
for i in $(seq 1 60); do
  if curl -sS http://localhost:4000/health >/dev/null 2>&1; then
    echo
    echo "API lista en http://localhost:4000"
    break
  fi
  echo -n "."
  sleep 1
done

# Crear acceso directo en el Escritorio del usuario
URL="http://localhost:4000"
USER_DESKTOP=""

OS_NAME="$(uname -s)"
case "$OS_NAME" in
  Linux*)
    USER_DESKTOP="$HOME/Desktop"
    if [ ! -d "$USER_DESKTOP" ]; then
      USER_DESKTOP="$HOME/Escritorio"
      mkdir -p "$USER_DESKTOP"
    fi
    DESKTOP_FILE="$USER_DESKTOP/GHSentinel Local.desktop"
    cat > "$DESKTOP_FILE" <<DESK
[Desktop Entry]
Type=Application
Name=GHSentinel Local
Comment=Abrir GHSentinel Local
Exec=xdg-open $URL
Icon=network-workgroup
Terminal=false
Categories=Network;
DESK
    chmod +x "$DESKTOP_FILE"
    if command -v gio >/dev/null 2>&1; then
      gio set "$DESKTOP_FILE" "metadata::trusted" yes >/dev/null 2>&1 || true
    fi
    echo "Acceso directo creado: $DESKTOP_FILE"
    ;;
  Darwin*)
    USER_DESKTOP="$HOME/Desktop"
    DESKTOP_FILE="$USER_DESKTOP/GHSentinel Local.command"
    cat > "$DESKTOP_FILE" <<MAC
#!/bin/bash
open "$URL"
MAC
    chmod +x "$DESKTOP_FILE"
    echo "Acceso directo creado: $DESKTOP_FILE"
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    if [ -n "${USERPROFILE:-}" ]; then
      USER_DESKTOP="$USERPROFILE/Desktop"
    else
      USER_DESKTOP="$HOME/Desktop"
    fi
    mkdir -p "$USER_DESKTOP"
    DESKTOP_FILE="$USER_DESKTOP/GHSentinel Local.url"
    cat > "$DESKTOP_FILE" <<WIN
[InternetShortcut]
URL=$URL
IconFile=C:\\Windows\\system32\\SHELL32.dll
IconIndex=0
WIN
    echo "Acceso directo creado: $DESKTOP_FILE"
    ;;
  *)
    echo "No se creó acceso directo automático: sistema no reconocido ($OS_NAME)."
    echo "Abre manualmente: $URL"
    ;;
esac

# Intentar abrir la URL automáticamente
echo "Intentando abrir $URL en el navegador..."
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" || true
elif command -v open >/dev/null 2>&1; then
  open "$URL" || true
else
  echo "Abre manualmente: $URL"
fi

echo
echo "== LISTO =="
echo "La plataforma debería estar accesible en: $URL"
echo "Acceso directo en el Escritorio (si el sistema lo soporta)."
echo
echo "Logs utiles:"
echo "  $DOCKER_COMPOSE_CMD logs -f api"
echo "  $DOCKER_COMPOSE_CMD logs -f mongo"
echo
echo "Para detener: $DOCKER_COMPOSE_CMD down"
echo
