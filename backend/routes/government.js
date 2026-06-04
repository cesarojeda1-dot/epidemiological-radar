const express = require('express')
const router = express.Router()
const GovernmentAgency = require('../models/GovernmentAgency')

router.get('/', async (req,res)=>{ const items = await GovernmentAgency.find().limit(200); res.json(items) })
router.post('/', async (req,res)=>{ try{ const g = new GovernmentAgency(req.body); await g.save(); res.status(201).json(g)}catch(e){res.status(400).json({error:e.message})} })

module.exports = router
