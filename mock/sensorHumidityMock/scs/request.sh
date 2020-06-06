IP=$local_ip
STATUS="true"
SERVERIP="back.app.cortijodemazas.com"
echo "$SERVERIP"/newSensor/humidity/"$mock_name/$IP:$mock_port"?devices=deviceMock,Device_1&min=300000&max=800000&lapse=1
RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port"?devices=deviceMock,Device_1&min=300000&max=800000&lapse=1")
#sleep 1000
#RES=$(curl -X POST $SERVERIP"/sensor/humidity/"$mock_name/$IP:$mock_port"?devices=deviceMock&min=200000&max=800000")
echo $RES
