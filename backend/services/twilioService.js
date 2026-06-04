// Placeholder Twilio service
const twilio = require('twilio')
const client = (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN) : null

module.exports = {
  sendSms: async (to, body) => {
    if(!client) throw new Error('Twilio not configured')
    return client.messages.create({to, from: process.env.TWILIO_FROM, body})
  }
}
