# Bot Doku

> [Telegram](https://telegram.org/) Bot build for the _BeuthBot_-Project, with easy extensibility and customization in mind

## Table of content

- [Bot Doku](#bot-doku)
	- [Table of content](#table-of-content)
	- [Getting Started](#getting-started)
		- [Prerequisites](#prerequisites)
		- [Installing](#installing)
	- [Overview](#overview)
	- [Structure](#structure)
	- [Functionalities](#functionalities)
		- [User Requests](#user-requests)
		- [Commands](#commands)
		- [Functions](#functions)
		- [BotFather](#botfather)
	- [Further Development](#further-development)
	- [Further Reading](#further-reading)
	- [Built With](#built-with)
	- [Versioning](#versioning)
	- [Authors](#authors)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need a current version of [_node_ & _npm_](https://nodejs.org/en/).

### Cloning

Get the source code by cloning its [repository](https://github.com/T0biWan/heftigwolf-bot).

### Installing

After cloning the repository, install the dependencies. You can then run the project.

```bash
# install dependencies
npm install

# serve at localhost:8000
npm start
```

## Overview

The bot is basically a _Node_-_Express_-Backend. Incoming requests are checked and specifically handled.

## Structure

The bot is separated into two files. `index.js` contains the fundamental logic. The bot get created with its token and waits for incoming events. For example an incoming message. The bot then calls a handler function.

These handlers can be found in the second file, `commands.js`. This file contains the available commands as an Object. Furthermore does ist contain functions to determine if a message contains a commands and to answer the several requests a user can make.

## Functionalities

### User Requests

The bot supports three different kinds of user requests:

- **Message**: A user sends a message to the bot. We then check if the message contains a command. Commands are declared with a prefixed `/` in _Telegram_
- **Callback Queries**: The bot can answer with a question, providing the user a simple interface, using a button matrix. When the user clicks on of these buttons we get a _callback query_.
- **Inline Queries**: Users can call our bot from within another chat by prefixing the botname with an `@`. The user can then send a text to the bot, which results in an inline query. The result that the bot gives back is inserted in the chat, where the user called the bot from.

### Commands

The `commands.js`-file contains an `commands`-object. Every entry of this object is a supported command. The Key is always the command string, prefixed with `/`, eg: `/help`. The value for these keys is an object containing an description, and options object and the reference to the function that renders the answer for the specific command.

```js
const commands = {
	'/help': {
		answer: renderHelpString,
		description: 'Get a helpful list of all available commands and functionalities',
		options: {
			parse_mode: 'Markdown'
		}
	},
  '/date': {
    answer: (message => 'What date format do you prefer?'),
    description: 'Get the current timestamp in a chooseable format',
    options: {
      parse_mode: 'Markdown',
      reply_markup: {
        // this initiates a callback query
        // by giving the user two buttons to answer with
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
  }
}
```

### Functions

The `commands.js`-file provides several functions. Eg. functions to check if a message contains an command and to find out if the requested command is in the `commands`-object, which means it is an supported command.

Further are functions provided to handle Messages (containing normal _Commands_), _Callback Queries_ and _Inline Queries_.

The bot has the following functionalities, that a user can request and use:

- getTimestamp: Get the timestamp of the moment the message containing this command was send.
- getFormatedTimestamp: Renders the timestamp in Zulu or German format, this is a function used to answer a _Callback Query_.
- renderHelpString: Iterates over the _commands_-object and prints all available commands and there description.
- supportedMarkdown: This function gives the User a list of supported [_Markdown_](https://markdown.de/) markup by Telegram.

### BotFather

The [BotFather](https://core.telegram.org/bots) allows so configure our bot. You can just write the _BotFather_ with Telegram and the bot will guide you through everything. The _BotFather_ enables you among others to change the profile picture, description and about text of your bot.

Further you can register the commands and inline queries your bot supports. This allows a cleaner user experience since the bot will then suggest commands and inline queries while the user types. So absolutely do register them!

The neccessary commands are:

- `/setcommands`
- `/setinline`

## Further Development

New commands can simply added to the `commands`-object but have to follow the presented structure under [Commands](#commands).

## Further Reading

- [Telegram Bot APi](https://core.telegram.org/bots/api)

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Node-Telegram-Bot-API](https://github.com/yagop/node-telegram-bot-api)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/T0biWan/heftigwolf-bot/tags).

## Authors

- **Tobias Klatt** - _Initial work_ - [GitHub](https://github.com/T0biWan/)

See also the list of [contributors](https://github.com/T0biWan/heftigwolf-bot/graphs/contributors) who participated in this project.
