const express = require('express')
const moment = require('moment')
const telegrambot = require('node-telegram-bot-api')

const commands = require('./commands')

// # initialisation
const token = '1008019346:AAHZ-PALIP0-TcCq5r90u3A5ekc1JvbdTy4'
const app = express()
const bot = new telegrambot(token, {polling: true})

// # web: localhost:8080
app.use((req, res, next) => {
  res.send('<h1>Hello Kakadu</h1>')
})

// # direct messages
bot.on('message', (message) => {
	if (commands.isCommand(message)) commands.handleCommands(bot, message)
	else bot.sendMessage(message.chat.id, 'Kia Ora!')
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
