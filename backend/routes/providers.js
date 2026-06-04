const express = require('express')
const router = express.Router()
const Provider = require('../models/Provider')

router.get('/', async (req,res)=>{ const items = await Provider.find().limit(200); res.json(items) })
router.post('/', async (req,res)=>{ try{ const p = new Provider(req.body); await p.save(); res.status(201).json(p)}catch(e){res.status(400).json({error:e.message})} })

module.exports = router
