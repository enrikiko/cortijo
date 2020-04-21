FROM alpine
RUN apk add npm curl
RUN touch log
COPY bucle.sh bucle.sh
ENTRYPOINT ["sh", "bucle.sh"]
