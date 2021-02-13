IP=$local_ip
STATUS="false"
SERVERIP="192.168.1.23:11000"
TENANT="test"
echo "$SERVERIP"/device/"$TENANT/$mock_name/$STATUS/$IP:$mock_port"
sleep 10000
RES=$(curl -X POST $SERVERIP"/device/"$TENANT/$mock_name/$STATUS/$IP:$mock_port)
# sleep 1000
# RES=$(curl -X POST $SERVERIP"/device/"$mock_name/$STATUS/$IP:$mock_port)
echo $RES
