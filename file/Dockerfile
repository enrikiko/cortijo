FROM alpine
RUN apk add npm
RUN mkdir /scr/
RUN mkdir /scr/files
COPY package/. ./scr/.
WORKDIR ./scr
RUN npm install
WORKDIR  /
COPY ./scr/. ./scr/.

WORKDIR /scr/
CMD sh init.sh
