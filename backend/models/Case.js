const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CaseSchema = new Schema({
  species: {type:String, default:'canine'},
  city: String,
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
  count: {type:Number, default:1},
  severity: {type:String, enum:['low','medium','high'], default:'low'},
  source: String,
  date: {type:Date, default:Date.now}
},{timestamps:true})

CaseSchema.index({ location: '2dsphere' })
module.exports = mongoose.model('Case', CaseSchema)
