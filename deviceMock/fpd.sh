NAME=$1
PORT=$2
docker run -p "$PORT":3000 --name "$NAME" -e mock_name=${NAME} -e mock_port=${PORT} -d mock
