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

const {Gateway, BotRequest} = require('@bhtbot/bhtbot');

const telegrambot = require('node-telegram-bot-api')

// import telegram bot commands
const commands = require('./commands')

// use `dotenv` to ready `.env` file even when not running with docker-compose
const dotenv = require('dotenv').config()

// receive telegram token from the `.env` file
const token = process.env.TELEGRAM_TOKEN

// create gateway connection
const gateway = new Gateway(process.env.GATEWAY_ENDPOINT, 'telegram');

// create telegram bot which does the telegram stuff for us
const bot = new telegrambot(token, { polling: true })



// === -------------------------------------------------------------------- ===
//
// Node Telegram Bot
// @see: https://github.com/yagop/node-telegram-bot-api
// === -------------------------------------------------------------------- ===

// handle incoming messages from telegram bot
bot.on('message', async (message) => {
    // check for existing telegram bot command first and handle it if present
    if (commands.isCommand(message)) {
        commands.handleCommands(bot, message)
    }

    // if not send message to beuth bot gateway api
    else {

        const beuthBotMessage = new BotRequest({
            clientDate: message.date,
            text: message.text,
            clientLanguage: message.from ? message.from.language_code : undefined,
            lastName: message.from ? message.from.last_name : undefined,
            telegramId: message.from ? message.from.id : undefined,
            nickname: message.from ? message.from.username : undefined,
            firstName: message.from ? message.from.first_name : undefined,
        });

        // send message to gateway api and synchron wait for response
        const botResponse = await gateway.query(beuthBotMessage)

        if(botResponse && botResponse.answer && botResponse.answer.content){
            const responseMessage = botResponse.answer.content;
            bot.sendMessage(responseMessage)
        }
        else{
            bot.sendMessage('ERROR cant connect to bot gateway')
        }
    }
})

// handle incoming callback queries from telegram bot
bot.on('callback_query', (query) => {

    // print query for debugging purposes
    console.log("incoming callback query: " + query)

    commands.handleCallbackQuery(bot, query)
})

// handle incoming inline queries from telegram bot
bot.on('inline_query', (query) => {

    // print query for debugging purposes
    console.log("incoming inline query: " + query)

    commands.handleInlineQuerys(bot, query)
})

// print running message for debugging purposes
console.log("Telegram Bot is up and running")


