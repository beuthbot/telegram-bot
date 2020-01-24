const axios = require('axios')

axios.defaults.baseURL = process.env.GATEWAY_ENDPOINT

async function post (collection, body) {
  console.log('sending to gateway');
  const response = await axios.post(collection, body)
  console.log('got gateway response');
  return response
}

async function sendMessage (message) {
  console.log({ 'data': { 'message': message }});
  const response = await post('/message-in', { 'data': { 'message': message }} )
  return response
}

exports.sendMessage = sendMessage
