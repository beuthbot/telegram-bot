FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package-lock.json package.json ./

RUN npm install

COPY . . 

CMD ["npm", "run", "start"]
