const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlertSchema = new Schema({
  title: String,
  description: String,
  level: {type:String, enum:['info','warning','critical'], default:'warning'},
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
  relatedCases: [{ type: Schema.Types.ObjectId, ref: 'Case' }]
},{timestamps:true})

AlertSchema.index({ location: '2dsphere' })
module.exports = mongoose.model('Alert', AlertSchema)
