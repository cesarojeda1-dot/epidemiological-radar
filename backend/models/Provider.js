const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProviderSchema = new Schema({
  name: String,
  type: {type:String, enum:['vet','petshop','supplier'], default:'vet'},
  country: String,
  city: String,
  address: String,
  contact: { phone: String, email: String },
  services: [String],
  rating: {type:Number, default:0}
},{timestamps:true})

module.exports = mongoose.model('Provider', ProviderSchema)
