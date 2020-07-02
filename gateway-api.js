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

const util = require('util')

/**
 * Sends a `POST` to the BeuthBot Gateway API.  The given message is send as
 * the body of the request.
 *
 * @param requestBody The message to send to the gateway.  in the `README.md` file
 * is a description of how this message should look like.
 *
 * @returns {Promise<AxiosResponse<*>>}
 */
async function postMessage(requestBody) {

  // print function call for debugging purposes
  console.debug("post message:\n" + util.inspect(requestBody, false, null, true) + "\n\n")

  // await response from gateway
  const response = await axios.post('/message', requestBody)

  if (response.data) {
    console.debug("gateway response:\n" + util.inspect(response.data, false, null, true) + "\n\n")
  } else {
    console.debug("no response.data")
  }

  return response
}

// export main post function to use it in the telegram-bot.js file
exports.postMessage = postMessage
