FROM node:8

RUN mkdir /workspace
WORKDIR /workspace
COPY . .

RUN yarn

ENTRYPOINT ["/workspace/entrypoint.sh"]
