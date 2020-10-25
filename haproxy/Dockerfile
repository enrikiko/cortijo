FROM haproxy
COPY 400.http /etc/haproxy/errors/400.http
COPY 403.http /etc/haproxy/errors/403.http
COPY 408.http /etc/haproxy/errors/408.http
COPY 500.http /etc/haproxy/errors/500.http
COPY 502.http /etc/haproxy/errors/502.http
COPY 503.http /etc/haproxy/errors/503.http
COPY 504.http /etc/haproxy/errors/504.http
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
RUN mkdir -p /run/haproxy/
RUN mkdir -p /root/dev
