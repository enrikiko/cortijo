IP=$local_ip
STATUS="true"
SERVERIP="back.app.cortijodemazas.com"
echo "$SERVERIP"/newSensor/temperature/"$mock_name/$IP:$mock_port"?devices=mock,mock2
RES=$(curl -X POST $SERVERIP"/sensor/temperature/"$mock_name/$IP:$mock_port"?devices=mock&devices=mock2&devices=mock3")
echo $RES
# sleep 1000
# RES=$(curl -X POST $SERVERIP"/sensor/temperature/"$mock_name/$IP:$mock_port"?devices=mock&devices=mock2&devices=mock3")
# echo $RES
