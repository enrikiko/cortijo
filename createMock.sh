ip=$(curl https://5nwdav0wk9.execute-api.eu-central-1.amazonaws.com/dev/get_ip)
sh deviceMock/fpd.sh mock 8000 $ip
sh deviceMock/fpd.sh mock1 8001 $ip
sh deviceMock/fpd.sh mock3 8003 $ip
