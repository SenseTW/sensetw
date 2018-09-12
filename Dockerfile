FROM node:8 as front-builder
ARG ENV=stage
ARG BRANCH_NAME
ARG COMMIT_SHA
RUN mkdir /workspace
ADD builder/sensemap/scripts/build.sh /opt/front-builder.sh
COPY sensemap/. /workspace
WORKDIR /workspace
RUN /opt/front-builder.sh $ENV $BRANCH_NAME $COMMIT_SHA

FROM node:8
RUN mkdir /workspace
RUN mkdir /static
COPY sensemap-backend/. /workspace
COPY --from=front-builder /workspace/build/. /static

WORKDIR /workspace
RUN yarn

ENTRYPOINT ["/workspace/scripts/entrypoint.sh"]
