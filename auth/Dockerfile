FROM alpine
RUN apk add npm
RUN mkdir /root/node
WORKDIR /root/node
COPY package/. .
RUN npm install
COPY . .
ARG TOKEN
ENTRYPOINT ["node", "server.js"]
CMD node server.js
