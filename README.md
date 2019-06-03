docker build -t api-name .
docker run -p <port>:3000 api-name


"/terminal"
"/device/log"
"/device/all"
"/device/name/:name"
"/device/new/:name/:status/:description"
"/device/update/:name/:status"
"/device/remove/:name"
