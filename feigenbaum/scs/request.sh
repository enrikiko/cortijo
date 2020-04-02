IP=$local_ip
SERVERIP="$IP:8000"
echo "$SERVERIP"/newSensor/humidity/"$mock_name/$IP:$mock_port"
RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port)
sleep 1000
RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port)
echo $RES
