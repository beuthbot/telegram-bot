const axios = require('axios')

axios.defaults.baseURL = 'https://my-telegram-bot.beuthbot.now.sh/'

async function post (collection, body) {
  console.log('sending to gateway');
  const response = await axios.post(collection, body)
  console.log('gateway response');
  return response
}

async function sendMessage (message) {
  const response = await post('/message-in', { 'data': { 'message': message }} )
  return response
}

exports.sendMessage = sendMessage
