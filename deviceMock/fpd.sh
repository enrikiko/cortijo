NAME=$1
PORT=$2
IP=$3
docker run -p "$PORT":3000 --name "$NAME" -e local_ip=${IP} -e mock_name=${NAME} -e mock_port=${PORT} -d mock
