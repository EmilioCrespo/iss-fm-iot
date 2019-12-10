FROM nodered/node-red-docker

COPY ./flows_FM.json /data/flows_FM.json

WORKDIR /usr/src/node-red

USER node-red

RUN npm install node-red-dashboard
RUN npm install node-red-contrib-mqtt-broker

# User configuration directory volume
VOLUME ["/data"]
EXPOSE 1880
EXPOSE 1883

# Environment variable holding file path for flows configuration
ENV FLOWS=flows_FM.json

CMD ["npm", "start", "--", "--userDir", "/data"]