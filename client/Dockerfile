FROM node:12-slim


RUN npm install -g vue-cli && \
    npm install -g @quasar/cli && \
    npm install -g yarn --force && \
    echo "done"

WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH usr/src/app/node_modules/.bin:$PATH

COPY ./package.json ./
COPY ./package-lock.json ./
RUN yarn install 

COPY . .

EXPOSE 8080

CMD [ "quasar", "dev" ]


##docker build . -t vevedh/build_quasar_app:latest

##Get into image for testing
## docker run --rm --name quasar_app -p 8080:8080/tcp --network "phasme-srv_db-net" --entrypoint /bin/sh -it vevedh/build_quasar_app:latest


##Use image to build a quasar app
## docker run --rm --name quasar_app --mount type=bind,source=$(pwd),target=/usr/src/app -p 8080:8080/tcp --network "phasme-srv_db-net" --entrypoint /bin/sh -it vevedh/build_quasar_app:latest

