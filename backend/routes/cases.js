const express = require('express')
const router = express.Router()
const Case = require('../models/Case')
const multer = require('multer')
const csv = require('csv-parse')
const upload = multer()

// List cases
router.get('/', async (req,res)=>{
  const items = await Case.find().sort({date:-1}).limit(100)
  res.json(items)
})

// Create case
router.post('/', async (req,res)=>{
  try{
    const c = new Case(req.body)
    await c.save()
    res.status(201).json(c)
  }catch(e){res.status(400).json({error:e.message})}
})

// Ingest CSV/JSON
router.post('/ingest', upload.single('file'), async (req,res)=>{
  try{
    if(req.file){
      const text = req.file.buffer.toString('utf8')
      csv(text, {columns:true, trim:true}, async (err, records)=>{
        if(err) return res.status(400).json({error:err.message})
        const created = []
        for(const r of records){
          const doc = new Case({
            species: r.species || r.type || 'unknown',
            location: { type:'Point', coordinates:[parseFloat(r.lng), parseFloat(r.lat)] },
            city: r.city || '',
            count: parseInt(r.count||1),
            severity: r.severity || 'low',
            date: r.date? new Date(r.date): new Date()
          })
          await doc.save()
          created.push(doc)
        }
        res.json({created:created.length})
      })
    }else{
      // JSON body
      const body = req.body
      if(Array.isArray(body)){
        await Case.insertMany(body)
        return res.json({created: body.length})
      }
      res.status(400).json({error:'No file or array provided'})
    }
  }catch(e){res.status(500).json({error:e.message})}
})

// Get one
router.get('/:id', async (req,res)=>{
  try{ const c = await Case.findById(req.params.id); res.json(c)}catch(e){res.status(404).json({error:'not found'})}
})

// Update
router.put('/:id', async (req,res)=>{
  try{ const c = await Case.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(c)}catch(e){res.status(400).json({error:e.message})}
})

// Delete
router.delete('/:id', async (req,res)=>{
  try{ await Case.findByIdAndDelete(req.params.id); res.json({deleted:true}) }catch(e){res.status(400).json({error:e.message})}
})

module.exports = router
