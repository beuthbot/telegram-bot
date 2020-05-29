/**
 * telegram-bot.js
 *
 * main file which is executed by npm
 *
 * in this file we define functions for the telegram bot which are called for
 * incoming messages and queries from a telegram chat
 *
 * Contributed by:
 *  - Tobias Klatt
 *  - Lukas Danckwerth
 */

// === -------------------------------------------------------------------- ===
//
// Node.js Modules / Constants
// === -------------------------------------------------------------------- ===

// Fixes a message about deprecated functionality: 'Automatic enabling of
// cancellation of promises is deprecated. In the future, you will have to
// enable it yourself.'
// See https://github.com/yagop/node-telegram-bot-api/issues/319.
// See https://github.com/yagop/node-telegram-bot-api/issues/540
process.env.NTBA_FIX_319 = 1;


const telegrambot = require('node-telegram-bot-api')

const util = require('util')

// import telegram bot commands
const commands = require('./commands')

// import the gateway api
const gateway = require('./gateway-api')

// use `dotenv` to ready `.env` file even when not running with docker-compose
const dotenv = require('dotenv').config()

// receive telegram token from the `.env` file
const token = process.env.TELEGRAM_TOKEN

// express application is used to serve a simple answer for a `GET` request.
// LD: do we really need this?
// const express = require('express')
// const app = express()

// create telegram bot which does the telegram stuff for us
const bot = new telegrambot(token, {polling: true})


// === -------------------------------------------------------------------- ===
//
// Express Application
// @see: https://expressjs.com/de/guide/routing.html
// === -------------------------------------------------------------------- ===

// Repond simple hello text for `GET` requests
// LD: do we really need this?
// app.use((req, res, next) => {
//     res.send('Hello from BeuthBot Telegram Bot')
// })


// === -------------------------------------------------------------------- ===
//
// Node Telegram Bot
// @see: https://github.com/yagop/node-telegram-bot-api
// === -------------------------------------------------------------------- ===

// handle incoming messages from telegram bot
bot.on('message', async (message) => {

    // print message for debugging purposes
    var logContent = util.inspect(message, false, null, true)
    // console.log("incoming callback query: " + logContent)
    console.log("incoming message: " + logContent)

    // check for existing telegram bot command first and handle it if present
    if (commands.isCommand(message)) {
        commands.handleCommands(bot, message)
    }

    // if not send message to beuth bot gateway api
    else {
        // send message to gateway api and synchron wait for response
        const response = await gateway.postMessage(message)

        console.log("incoming response: " + response)

	    // tell telegram bot to send back the answer
        bot.sendMessage(message.chat.id, response.data.answer.content)
    }
})

// handle incoming callback queries from telegram bot
bot.on('callback_query', (query) => {

    // print message for debugging purposes
    // var logContent = util.inspect(query, false, null, true)
    // console.log("incoming callback query: " + logContent)

    commands.handleCallbackQuery(bot, query)
})

// handle incoming inline queries from telegram bot
bot.on('inline_query', (query) => {

    // print message for debugging purposes
    console.log("incoming inline query: " + query)

    commands.handleInlineQuerys(bot, query)
})

// listen to upcoming polling errors
bot.on("polling_error", (err) => {
    console.log(err)
});

// finally start the express application on port 8000
// app.listen(8000)

console.log('running telegram bot')
