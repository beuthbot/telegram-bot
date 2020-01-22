const express = require('express')
const moment = require('moment')
const telegrambot = require('node-telegram-bot-api')

const commands = require('./commands')
const gateway = require('./gateway_api')

// # initialisation
const token = process.env.TELEGRAM_TOKEN
const app = express()
const bot = new telegrambot(token, {polling: true})

// # web: localhost:8080
app.use((req, res, next) => {
  res.send('<h1>Hello Kakadu</h1>')
})

// # direct messages
bot.on('message', async (message) => {
    if (commands.isCommand(message)) commands.handleCommands(bot, message)
    else {
        // send message to gateway
        const response = await gateway.sendMessage(message)
        console.debug(response)

        // todo: answer using `response.payload` or something
        bot.sendMessage(message.chat.id, 'Kia Ora!')
    }
})

// # callback queries
bot.on('callback_query', (query) => {
  commands.handleCallbackQuerys(bot, query)
})

// # inline queries
bot.on('inline_query', (query) => {
  commands.handleInlineQuerys(bot, query)
})

app.listen(8000)
