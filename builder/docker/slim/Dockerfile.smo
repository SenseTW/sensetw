FROM node:8
RUN apt-get update -qqy && apt-get install -qqy \
        bash
RUN mkdir /workspace
COPY smo/. /workspace
COPY builder/smo/entrypoint.sh /workspace

WORKDIR /workspace
RUN yarn

ENTRYPOINT ["/workspace/entrypoint.sh"]
