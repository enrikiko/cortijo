- docker build -t autocommitimage --build-arg PASSWORD=$GIT_PASSWORD .
- docker run -d --name autocommitcontainer autocommitimage