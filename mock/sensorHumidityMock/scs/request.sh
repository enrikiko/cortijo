IP=$local_ip
STATUS="false"
SERVERIP="$IP:8000"
echo "$SERVERIP"/newSensor/humidity/"$mock_name/$IP:$mock_port"?devices=mock,mock2&min=500000&max=600000
RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port"?devices=deviceMock&min=200000&max=800000")
sleep 1000
RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port"?devices=deviceMock&min=200000&max=800000")
echo $RES