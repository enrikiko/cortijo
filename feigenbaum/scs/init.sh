#!/bin/sh
env FLASK_APP=init.py flask run --host=0.0.0.0 --port=$PORT & sh request.sh
