FROM alpine
RUN apk add npm
RUN mkdir /scr/
RUN mkdir /scr/files
COPY ./src/. ./scr/.
WORKDIR /scr/
CMD sh init.sh
