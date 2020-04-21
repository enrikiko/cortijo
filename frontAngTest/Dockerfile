FROM alpine
RUN apk add npm
RUN mkdir angular
WORKDIR angular/.
COPY package.json package.json
RUN npm install
COPY . .
CMD exec init.sh
