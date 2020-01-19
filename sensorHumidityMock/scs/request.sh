IP=$local_ip
STATUS="false"
SERVERIP="$IP:8000"
echo "$SERVERIP"/newSensor/"$mock_name/$IP:$mock_port"
RES=$(curl $SERVERIP"/newSensor/humidity/"$mock_name/$IP:$mock_port)
sleep 1000
RES=$(curl $SERVERIP"/newSensor/humidity/"$mock_name/$IP:$mock_port)
echo $RES
