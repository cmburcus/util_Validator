# Use node 9.11.1
FROM node:9.11.1

RUN apt-get update &&\
    apt-get install

# Change working directory
WORKDIR /app
