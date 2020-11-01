IP=$local_ip
STATUS="false"
SERVERIP="https://back.app.cortijodemazas.com"
TENANT="cortijo"
echo "$SERVERIP"/new/"$TENANT/$mock_name/$STATUS/$IP:$mock_port"
RES=$(curl -X POST $SERVERIP"/device/"$TENANT/$mock_name/$STATUS/$IP:$mock_port)
# sleep 1000
# RES=$(curl -X POST $SERVERIP"/device/"$mock_name/$STATUS/$IP:$mock_port)
echo $RES
