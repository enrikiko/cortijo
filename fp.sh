url="http://88.8.67.178:8000"
device=$1
# echo "Create New Device"
# curl -X GET $url"/new/"$device"/true/192.2168.1.23:7615"
echo
echo
echo "View Device"
echo $url"/name/"$device
curl -X GET $url"/name/"$device
echo
echo
echo "Change Device Status"
echo $url"/update/"$device"/false"
curl -X GET $url"/update/"$device"/false"
echo
echo "View Device"
echo $url"/name/"$device
curl -X GET $url"/name/"$device
# echo "Create An Existing Device"
# curl -X GET $url"/new/"$device"/true/192.2168.1.23:2000"
# echo
# echo
# echo "Remove Device"
# echo $url"/remove/"$device
# curl -X GET $url"/remove/"$device
# echo
# echo
# echo "Remove Device"
# echo $url"/remove/"$device
# curl -X GET $url"/remove/"$device
# echo
# echo
