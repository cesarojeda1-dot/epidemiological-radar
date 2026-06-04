const express = require('express')
const router = express.Router()
const Commission = require('../models/Commission')

router.get('/', async (req,res)=>{ const items = await Commission.find().limit(200); res.json(items) })
router.post('/', async (req,res)=>{ try{ const c = new Commission(req.body); await c.save(); res.status(201).json(c)}catch(e){res.status(400).json({error:e.message})} })

module.exports = router
