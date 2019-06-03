IP="192.168.1.50"
STATUS="true"
SERVERIP="192.168.1.50:3371"
echo "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port"
RES=$(curl "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port")
echo $RES
