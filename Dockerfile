FROM mvertes/alpine-mongo

ENV WORKINGDIR=/root/app
ENV WAITFOR=/root/waitfor

RUN	mkdir -p ${WORKINGDIR} && chmod 666 ${WORKINGDIR}

WORKDIR ${WORKINGDIR}

RUN	apk update						&&	\
	apk add nodejs npm git

RUN git clone https://docker:4QnaPMwu2eh_DHdbM4KV@gitlab.com/bitbmp/progetto-asw.git ${WORKINGDIR}
RUN git clone https://github.com/eficode/wait-for.git ${WAITFOR}

RUN	npm install

EXPOSE 3000

CMD mongod & ${WAITFOR}/wait-for localhost:27017 -- node index.js
