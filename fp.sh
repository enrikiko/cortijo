url="http://88.8.67.178:3371"
device=$1
echo
echo "Create New Device"
curl -X GET $url"/new/"$device"/on/192.2168.1.23:7615"
echo
echo
echo "View Device"
curl -X GET $url"/name/"$device
echo
echo
echo "Change Device Status"
curl -X GET $url"/update/"$device"/off"
echo
echo
echo "Create An Existing Device"
curl -X GET $url"/new/"$device"/on/192.2168.1.23:2000"
echo
echo
echo "Remove Device"
curl -X GET $url"/remove/"$device
echo
echo
echo "Remove Device"
curl -X GET $url"/remove/"$device
echo
echo
