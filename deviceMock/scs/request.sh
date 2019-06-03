IP=$local_ip 
STATUS="true"
SERVERIP="$IP:8000"
echo "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port"
RES=$(curl "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port")
echo $RES
