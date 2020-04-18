FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY scs/. .

ENV mock_name=$NAME
ENV mock_port=$PORT
ENV local_ip=$IP

CMD sh init.sh
