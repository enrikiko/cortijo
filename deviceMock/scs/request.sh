IP=$local_ip
STATUS="true"
SERVERIP="$IP:8000"
echo "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port"
# RES=$(curl "$SERVERIP"/new/"$mock_name/$STATUS/$IP:$mock_port")
RES=$(curl 192.168.1.50:8000/new/mock/false/192.168.1.50:8001)
echo $RES
