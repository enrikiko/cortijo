FROM alpine
RUN apk add npm
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
COPY . .
# ARG TELEGRAM_TOKEN
# ARG TELEGRAM_ID
CMD node server.js
