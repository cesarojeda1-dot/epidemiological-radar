const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GovernmentAgencySchema = new Schema({
  name: String,
  country: String,
  contact: { email: String, phone: String },
  apiEndpoint: String,
  note: String
},{timestamps:true})

module.exports = mongoose.model('GovernmentAgency', GovernmentAgencySchema)
