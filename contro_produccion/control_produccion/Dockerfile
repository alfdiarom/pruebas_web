ARG NODE_VERSION=10
FROM node:${NODE_VERSION}

# Home directory for Node-RED application source code and running instance
ENV WORK_DIR=/usr/src
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}

# Complementary Debian packages
RUN apt-get update && apt-get install -y --no-install-recommends nano tree

#### NODE-RED PACKAGES
#### -----------------
# Copies the package.json first for better cache on later pushes
COPY ./src/package.json ./
RUN npm install

#### APP DATA AND PERSISTENCE WITH A VOLUME
#### --------------------------------------
COPY ./src ./
#COPY ./src/start.sh /src/start.sh

# Volume for data persistance
VOLUME ${WORK_DIR}

# RUN THE NODE-RED INSTANCE
COPY ./start.sh  ./
CMD ["bash", "start.sh"]

# Set time zone
ENV TZ=Europe/Madrid
