FROM ubuntu:18.04
RUN apt update
RUN apt install -y ansible
RUN apt install -y apt openssh-client
RUN apt install -y git
COPY ./private ./private
RUN mkdir text.txt
ARG PASSWORD
RUN echo $PASSWORD > ./password
RUN ansible-vault decrypt --vault-password-file=./password private
RUN mkdir ~/.ssh
RUN chmod 700 ~/.ssh
RUN mv ./private ~/.ssh/id_rsa
RUN chmod 600 ~/.ssh/id_rsa
RUN ssh -oStrictHostKeyChecking=no -T git@github.com || true
RUN git clone git@github.com:enrikiko/Java
COPY ./ ./
RUN chmod 777 init.sh
RUN chmod 777 entry.sh
RUN chmod 777 commit.sh
ENTRYPOINT ["sh", "init.sh"]
