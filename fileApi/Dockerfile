FROM alpine
RUN apk add npm
RUN mkdir /scr/
RUN mkdir /scr/files
COPY ./scr/. ./scr/.
WORKDIR /scr/
CMD sh init.sh
