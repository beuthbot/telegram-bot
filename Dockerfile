FROM node:11-alpine

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy files for npm
COPY package.json package-lock.json ./

# install packages from `package.json` with npm
RUN npm install

# copy file for the telegram bot
COPY telegram-bot.js commands.js ./

# start running the node server
CMD ["npm", "run", "start"]
