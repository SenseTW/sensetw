FROM node:8 as front-builder
ARG ENV=stage
ARG BRANCH_NAME
ARG COMMIT_SHA
ARG GA_ID
ARG GTM_ID
RUN mkdir /workspace
ADD builder/sensemap/build.sh /opt/front-builder.sh
COPY sensemap/. /workspace
WORKDIR /workspace
RUN /opt/front-builder.sh $BRANCH_NAME $COMMIT_SHA $GA_ID $GTM_ID

FROM node:8-alpine
RUN apk --no-cache add \
        postgresql-client \
        bash
RUN mkdir /workspace
RUN mkdir /static
COPY sensemap-backend/. /workspace
COPY builder/sensemap-backend/entrypoint.sh /workspace
COPY --from=front-builder /workspace/build/. /static

WORKDIR /workspace
RUN yarn

ENTRYPOINT ["/workspace/entrypoint.sh"]
