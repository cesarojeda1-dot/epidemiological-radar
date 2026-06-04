const express = require('express')
const router = express.Router()
const Alert = require('../models/Alert')

router.get('/', async (req,res)=>{
  const items = await Alert.find().sort({createdAt:-1}).limit(100)
  res.json(items)
})

router.post('/', async (req,res)=>{
  try{ const a = new Alert(req.body); await a.save(); res.status(201).json(a)}catch(e){res.status(400).json({error:e.message})}
})

module.exports = router
