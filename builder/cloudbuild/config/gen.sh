#!/bin/bash
BASH_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cp $BASH_DIR/templates/* ./

BRANCH_NAME=$1
COMMIT_SHA=$2
DB_ACCOUNT=$3
DB_PASSWORD=$4
SESSION_SECRET=$5
MAILGUN_HOST=$6
MAILGUN_PORT=$7
MAILGUN_USER=$8
MAILGUN_PASS=$9
MAILGUN_NAME=${10}
REDIS_HOST=${11}
REDIS_PORT=${12}

API_SERVERNAME=api.sense.tw
FRONT_SERVERNAME=sense.tw
PUBLIC_URL=https\\:\\/\\/api.sense.tw\\/
DB_NAME=sensemap

if [ "$1" != "release" ]; then
  MAILGUN_NAME="${BRANCH_NAME}.${MAILGUN_NAME}"
  API_SERVERNAME=staging.api.sense.tw
  FRONT_SERVERNAME=staging.sense.tw
  PUBLIC_URL=https\\:\\/\\/staging.api.sense.tw\\/
fi

if [ "$1" != "release" ] && [ "$1" != "master" ]; then
  DB_NAME="sensemap_${BRANCH_NAME}"
  PUBLIC_URL="https\\:\\/\\/${BRANCH_NAME}.staging.api.sense.tw\\/"
  API_SERVERNAME="${BRANCH_NAME}.staging.api.sense.tw"
  FRONT_SERVERNAME="${BRANCH_NAME}.staging.sense.tw"
fi

if [ -z "$SESSION_SECRET" ]; then
  SESSION_SECRET="TEST"
fi

sed -i "s/\${DB_NAME}/$DB_NAME/g" env.yaml
sed -i "s/\${DB_ACCOUNT}/$DB_ACCOUNT/g" env.yaml
sed -i "s/\${DB_PASSWORD}/$DB_PASSWORD/g" env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" env.yaml
sed -i "s/\${PUBLIC_URL}/$PUBLIC_URL/g" env.yaml
sed -i "s/\${SESSION_SECRET}/$SESSION_SECRET/g" env.yaml
sed -i "s/\${MAILGUN_HOST}/$MAILGUN_HOST/g" env.yaml
sed -i "s/\${MAILGUN_PORT}/$MAILGUN_PORT/g" env.yaml
sed -i "s/\${MAILGUN_USER}/$MAILGUN_USER/g" env.yaml
sed -i "s/\${MAILGUN_PASS}/$MAILGUN_PASS/g" env.yaml
sed -i "s/\${MAILGUN_NAME}/$MAILGUN_NAME/g" env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap_service.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap_service.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" nginx.yaml

if [ "$1" = "release" ]; then
  cat <<EOT >> env.yaml
  REDIS_HOST: $REDIS_HOST
  REDIS_PORT: "$REDIS_PORT"
EOT
else
  sed -i '/    nodePort\: 30600/d' sensemap_service.yaml
fi
