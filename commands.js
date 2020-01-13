const moment = require('moment')

const commands = {
	'/start': {
		answer: renderHelpString,
		description: 'for quick prototyping',
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
		description: 'Get the current timestamp in Zulu format',
		options: {
			parse_mode: 'Markdown'
		}
	},
	'/dateformated': {
		answer: (message => 'What date format do you prefer?'),
		description: 'Get the current timestamp in a chooseable format',
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

const callbackQuerys = {
	'date': {
		answer: getFormatedTimestamp,
		options: {
			parse_mode: 'Markdown'
		}
	}
}

function isCommand (message) {
	return message.text.toLowerCase().startsWith('/')
}

function commandExists (command) {
	return commands.hasOwnProperty(command)
}

function getCommand (message) {
	const regex = /^\/\w*/i
	return regex.exec(message.text)[0]
}

function handleCommands (bot, message) {
	const command = getCommand(message)
	if (commandExists(command)) bot.sendMessage(message.chat.id, commands[command].answer(message), commands[command].options)
	else {
		bot.sendMessage(message.chat.id, 'I could not find a matching command. Have a look at the `/help`-command:')
		bot.sendMessage(message.chat.id, renderHelpString(message))
	}
}

function handleCallbackQuerys(bot, query) {
	const message = query.message
	const data = JSON.parse(query.data)
	const query = querys[data.command]
	bot.sendMessage(message.chat.id, query.answer(message, data.payload), query.options)
	bot.answerCallbackQuery(query.id)
}

function handleInlineQuerys(bot, query) {
  // https://core.telegram.org/bots/api#inline-mode
  console.log('inline_query', query)
  // const results = []
  if (query.query === 'taube') {
    // https://core.telegram.org/bots/api#inlinequeryresultarticle
    const results = [
      // https://core.telegram.org/bots/api#inputmessagecontent
      // https://core.telegram.org/bots/api#inlinekeyboardmarkup
      // https://core.telegram.org/bots/api#inlinekeyboardbutton

      // bevor der nutzer was aussihet, sieht er thumbnail, titel, description und url
      // Nach der Auswahl wird der text in den Chat geposted
      { type:'article', id: "1", title:"Titel 1", input_message_content: { message_text: "Text 1" }, url: 'test.com', description: 'description' },
      // { type:'article', id: "2", title:"RESULT 4", reply_markup: {}, input_message_content: { message_text: "TEXT 2" }, url: 'test.com', description: 'description' }
    ]
    bot.answerInlineQuery(query.id, results)
  }
}

function logger (message) { return message.text }

function getTimestamp (message) { return `${moment.unix(message.date).format('YYYY-MM-DD')}` }

function getFormatedTimestamp (message, payload) {
	if (payload === 'zulu') return `${moment.unix(message.date).format('YYYY-MM-DD')}`
	else if (payload === 'german') return `${moment.unix(message.date).format('DD-MM-YYYY')}`
}

function renderHelpString (message) {
	let str = 'Beneath you find the available commands. Try one out by simply clicking on it.\n\n'
	for (let command of Object.keys(commands)) {
		str += `- ${command} - ${commands[command].description}\n`
	}
	return str
}

function supportedMarkdown (message) {
	let str =
	`<b>bold</b> **bold**
<i>italic</i> __italic__
<code>monospace</code> \`monospace\`
\`\`\`
code block
\`\`\``

	return str
}

exports.isCommand = isCommand
exports.handleCommands = handleCommands
exports.handleCallbackQuerys = handleCallbackQuerys
exports.handleInlineQuerys = handleInlineQuerys
