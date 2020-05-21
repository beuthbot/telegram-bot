
// === ------------------------------------------------------------------------------------------------------------ ===
//
// Node.js Modules / Constants
// === ------------------------------------------------------------------------------------------------------------ ===
const express = require('express')
const telegrambot = require('node-telegram-bot-api')

// import telegram bot commands
const commands = require('./commands')

// import the gateway api
const gateway = require('./gateway-api')

// receive telegram token from the `.env` file
const token = process.env.TELEGRAM_TOKEN

// express application is used to serve a simple answer for a `GET` request.
// LD: do we really need this?
const app = express()

// create telegram bot which does the telegram stuff for us
const bot = new telegrambot(token, {polling: true})

// === ------------------------------------------------------------------------------------------------------------ ===
//
// Express Application
// @see: https://expressjs.com/de/guide/routing.html
// === ------------------------------------------------------------------------------------------------------------ ===

// Repond simple hello text for `GET` requests
// LD: do we really need this?
app.use((req, res, next) => {
    res.send('Hello from BeuthBot Telegram Bot')
})


// === ------------------------------------------------------------------------------------------------------------ ===
//
// Node Telegram Bot
// @see: https://github.com/yagop/node-telegram-bot-api
// === ------------------------------------------------------------------------------------------------------------ ===

// handle incoming messages from telegram bot
bot.on('message', async (message) => {

    // print message for debugging purposes
    console.log("incoming message: " + message + "\n")

    // check for existing telegram bot command first and handle it if present
    if (commands.isCommand(message)) {
        commands.handleCommands(bot, message)
    }

    // if not send message to beuth bot gateway api
    else {
        // send message to gateway api and synchron wait for response
        const response = await gateway.postMessage(message)

        console.log("incoming response: " + response + "\n")

	    // tell telegram bot to send back the answer
        bot.sendMessage(message.chat.id, response.data.answer.content)
    }
})

// handle incoming callback queries from telegram bot
bot.on('callback_query', (query) => {
  commands.handleCallbackQuerys(bot, query)
})

// handle incoming inline queries from telegram bot
bot.on('inline_query', (query) => {
  commands.handleInlineQuerys(bot, query)
})

// finally start the express application on port 8000
app.listen(8000)

console.log('running telegram bot')
