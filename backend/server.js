require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } })

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/cases', require('./routes/cases'))
app.use('/api/alerts', require('./routes/alerts'))
app.use('/api/providers', require('./routes/providers'))
app.use('/api/government', require('./routes/government'))
app.use('/api/commissions', require('./routes/commissions'))

app.get('/health', (req,res)=>res.json({status:'ok'}))

// Socket example
io.on('connection', (socket)=>{
  console.log('socket connected', socket.id)
  socket.on('subscribe', room => socket.join(room))
})

const PORT = process.env.PORT || 4000
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ghsentinel'

mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
  console.log('Mongo connected')
  server.listen(PORT, ()=>console.log(`API listening ${PORT}`))
}).catch(err=>{
  console.error('Mongo connect error', err)
})

module.exports = { app, server, io }
