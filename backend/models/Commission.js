const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommissionSchema = new Schema({
  name: String,
  type: {type:String, enum:['service','transaction','subscription'], default:'service'},
  rate: {type:Number, default:0.08},
  currency: {type:String, default:'USD'},
  description: String
},{timestamps:true})

module.exports = mongoose.model('Commission', CommissionSchema)
