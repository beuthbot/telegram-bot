/**
 * commands.js
 *
 * summarizes the functionality of the command of the telegram bot.
 *
 * Contributed by:
 *  - Tobias Klatt
 *  - Lukas Danckwerth
 */

// === -------------------------------------------------------------------- ===
//
// Node.js Modules / Constants
// === -------------------------------------------------------------------- ===

const moment = require('moment')

const util = require('util')

const commands = {
	'/start': {
		answer: renderHelpString,
		description: 'For quick prototyping',
		options: {
			parse_mode: 'Markdown'
		}
	},
	'/help': {
		answer: renderHelpString,
		description: 'Get a helpful list of all available commands and functionalities',
		options: {
			parse_mode: 'Markdown'
		}
	},
	'/date': {
		answer: getTimestamp,
		description: 'Get the current date in Zulu format',
		options: {
			parse_mode: 'Markdown'
		}
	},
	'/dateformatted': {
		answer: (message => 'What date format do you prefer?'),
		description: 'Get the current date in a eligible format',
		options: {
			parse_mode: 'Markdown',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Zulu',
							callback_data: JSON.stringify({
								command: 'date',
								payload: 'zulu'
							})
						},
						{
							text: 'German',
							callback_data: JSON.stringify({
								command: 'date',
								payload: 'german'
							})
						}
					]
				]
			}
		}
	},
	'/md': {
		answer: supportedMarkdown,
		description: 'Get a list of telegram supported markdown markup',
		options: {
			parse_mode: 'HTML'
		}
	}
}

const callbackQueryCommands = {
	'date': {
		answer: getFormattedTimestamp,
		options: {
			parse_mode: 'Markdown'
		}
	}
}


// === -------------------------------------------------------------------- ===
//
// Auxiliary Functions
// === -------------------------------------------------------------------- ===

/**
 * @param message The message with a text which is probably a telegram bot command.  A telegram bot command is a
 * 			      string with a leading `/`.
 * @returns {boolean} Whether the text in the given message is a telegram bot command
 */
function isCommand (message) {
	if (!message.text) return false
	return message.text.toLowerCase().startsWith('/')
}

/**
 * @param command The telegram bot command which may exist in the dictionary of commands
 * @returns {boolean} Whether the command exists in the dictionary of commands
 */
function commandExists (command) {
	return commands.hasOwnProperty(command)
}

/**
 * Uses a regular expression to find a telegram bot command in the given text of the given message.
 *
 * @param message The message with a text
 * @returns {string} The found telegram bot command (if any)
 */
function getCommand (message) {
	const regex = /^\/\w*/i
	const results = regex.exec(message.text)
	if (results.length == 0) return null
	return results[0]
}

/**
 *
 *
 * @param bot
 * @param message
 */
function handleCommands (bot, message) {
	const command = getCommand(message)
	const chatID = message.chat.id
	if (commandExists(command)) {
		const answer = commands[command].answer(message)
		const options = commands[command].options
		bot.sendMessage(chatID, answer, options)
	}
	else {
		const answer = "I could not find a matching command. Have a look at the `/help`-command:"
		bot.sendMessage(chatID, answer)
		bot.sendMessage(chatID, renderHelpString(message))
	}
}

/**
 *
 * @param bot
 * @param query2
 */
function handleCallbackQuery(bot, callbackQuery) {

	const message = callbackQuery.message
	const chatID = message.chat.id
	const dataString = callbackQuery.data
	const data = JSON.parse(dataString)
	const commandName = data.command
	const payload = data.payload
	const command = callbackQueryCommands[commandName]
	const answer = command.answer(message, payload)

	bot.sendMessage(chatID, answer, command.options)
	bot.answerCallbackQuery(callbackQuery.id)
}

/**
 *
 * @param bot
 * @param query
 */
function handleInlineQuerys(bot, query) {
	// https://core.telegram.org/bots/api#inline-mode
	// console.log('inline_query', query)
	// const results = []
	if (query.query === 'taube') {
		// https://core.telegram.org/bots/api#inlinequeryresultarticle
		const results = [
			// https://core.telegram.org/bots/api#inputmessagecontent
			// https://core.telegram.org/bots/api#inlinekeyboardmarkup
			// https://core.telegram.org/bots/api#inlinekeyboardbutton
			// bevor der nutzer was aussihet, sieht er thumbnail, titel, description und url
			// Nach der Auswahl wird der text in den Chat geposted
			{
				type:'article', id: "1", title:"Titel 1", input_message_content: { message_text: "Text 1" }, url: 'test.com', description: 'description' },
      // { type:'article', id: "2", title:"RESULT 4", reply_markup: {}, input_message_content: { message_text: "TEXT 2" }, url: 'test.com', description: 'description' }
    ]
    bot.answerInlineQuery(query.id, results)
  }
}

/**
 * @param message The message which requested the current date
 * @returns {string} The formatted current date
 */
function getTimestamp (message) {
	return getFormattedTimestamp(message, "zulu")
}

/**
 * @param message The message which requested the formatted current date
 * @param payload The format of the date which is returned
 * @returns {string} The formatted date from the given message
 */
function getFormattedTimestamp (message, payload) {
	if (payload === 'zulu')
		return `${moment.unix(message.date).format('YYYY-MM-DD')}`
	else if (payload === 'german')
		return `${moment.unix(message.date).format('DD-MM-YYYY')}`
}

/**
 * @param message The message which requested the help message
 * @returns {string} A String containing a help message for the user listing
 *                   the available commands
 */
function renderHelpString (message) {
	let str = 'Beneath you find a list of the available commands. Try one out by simply clicking on it.\n\n'
	for (let command of Object.keys(commands)) {
		str += `- ${command} - ${commands[command].description}\n`
	}
	return str
}

/**
 * @param message The message which requested the supported markdowns
 * @returns {string} A String containing the information about the mark down
 *                   language which can be used
 */
function supportedMarkdown (message) {
	return `
<b>bold</b> **bold**
<i>italic</i> __italic__
<code>monospace</code> \`monospace\`
\`\`\`
code block
\`\`\`
	`
}


// === -------------------------------------------------------------------- ===
//
// node exports
// === -------------------------------------------------------------------- ===

exports.isCommand = isCommand
exports.handleCommands = handleCommands
exports.handleCallbackQuery = handleCallbackQuery
exports.handleInlineQuerys = handleInlineQuerys
