FROM node:8-alpine
RUN apk --no-cache add \
        bash
RUN mkdir /workspace
COPY smo/. /workspace
COPY builder/smo/entrypoint.sh /workspace

WORKDIR /workspace
RUN yarn

ENTRYPOINT ["/workspace/entrypoint.sh"]
