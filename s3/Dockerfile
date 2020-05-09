FROM python:3
WORKDIR /usr/src/app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ./upload.py ./upload.py
COPY ./watcher.py ./watcher.py
ARG ACCESS_KEY
ARG SECRET_KEY
ARG BUCKETS_NAME
CMD python3 watcher.py
