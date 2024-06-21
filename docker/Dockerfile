FROM node:alpine

WORKDIR /app

COPY package.json .

RUN mkdir -p /app
RUN npm cache clean --force
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --quiet
RUN npm install nodemon -g --quiet

COPY . /app

EXPOSE 3000

CMD nodemon -L --watch . app.js
