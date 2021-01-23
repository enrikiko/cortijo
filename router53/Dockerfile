FROM alpine
RUN apk add curl
RUN touch log
WORKDIR /root/node
COPY init.sh init.sh
ARG ROUTE53_KEY
ARG ROUTE53_URL
CMD sh init.sh
