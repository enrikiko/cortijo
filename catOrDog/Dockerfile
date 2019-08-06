FROM ubuntu:18.04
RUN apt update
RUN apt-get update
RUN apt install -y curl
RUN apt install -y python3-pip
RUN apt install -y python-pip
RUN apt install -y git
RUN pip install tensorflow
RUN pip install --upgrade keras
RUN pip install Theano
RUN apt-get install tree
RUN apt-get install locate
RUN apt-get install unzip -y
RUN pip install pillow
RUn pip install Flask
RUN pip install Werkzeug
RUN updatedb
RUN mkdir /src/
COPY ./ /src/
WORKDIR /src/
#RUN curl https://sds-platform-private.s3-us-east-2.amazonaws.com/uploads/P16-Convolutional-Neural-Networks.zip --output zip.zip
#RUN unzip zip.zip
#RUN cp -r Convolutional_Neural_Networks/dataset ./
#RUN rm -r zip.zip Convolutional_Neural_Networks/ __MACOSX/
ENTRYPOINT ["sh", "init.sh"]
