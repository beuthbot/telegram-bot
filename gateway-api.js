/**
 * gateway-api.js
 *
 * summarizes the function of the BeuthBot's Gateway api.
 *
 * Contributed by:
 *  - Tobias Klatt
 *  - Lukas Danckwerth
 */

// use `axios` as HTTP client for requesting gateway API
const axios = require('axios')

// set default URL of axios HTTP client.  fallback on local host for development
axios.defaults.baseURL = process.env.GATEWAY_ENDPOINT || "http://localhost:3000"

/**
 * Sends a `POST` to the BeuthBot Gateway API.  The given message is send as the body of the request.
 *
 * @param message The message to send to the gateway.  in the `README.md` file is a description of how this message
 * should look like.
 *
 * @returns {Promise<AxiosResponse<*>>}
 */
async function postMessage(message) {

  // print function call for debugging purposes
  console.log("post message: " + message + "\n");

  // create request body which is send via the `POST` request
  const requestBody = message

  // print gateway URL for debugging purposes
  console.log("sending to gateway: " + axios.defaults.baseURL)

  // await response from gateway
  const response = await axios.post('/message', requestBody)

  // print response for debugging purposes
  console.log("got gateway response: " + response + "\n")

  return response
}

// export main post function to use it in the telegram-bot.js file
exports.postMessage = postMessage
