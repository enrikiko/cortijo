IP=$local_ip
STATUS="false"
SERVERIP="$IP:8000"
echo "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port"
RES=$(curl -X POST $SERVERIP"/device/"$mock_name/$STATUS/$IP:$mock_port)
sleep 1000
RES=$(curl -X POST $SERVERIP"/device/"$mock_name/$STATUS/$IP:$mock_port)
echo $RES