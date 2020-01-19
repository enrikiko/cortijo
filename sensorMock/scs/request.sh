IP=$local_ip
STATUS="false"
SERVERIP="$IP:8000"
echo "$SERVERIP"/newSensor/temperature/"$mock_name/$IP:$mock_port"
RES=$(curl $SERVERIP"/newSensor/temperature/"$mock_name/$IP:$mock_port)
sleep 1000
RES=$(curl $SERVERIP"/newSensor/temperature/"$mock_name/$IP:$mock_port)
echo $RES
