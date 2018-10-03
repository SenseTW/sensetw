#!/bin/bash
BASH_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cp $BASH_DIR/templates/* ./

BRANCH_NAME=$BRANCH_NAME
COMMIT_SHA=$COMMIT_SHA
DB_ACCOUNT=$_DB_ACCOUNT
DB_PASSWORD=$_DB_PASSWORD
DB_HOST=$_DB_HOST
SESSION_SECRET=$_SESSION_SECRET
MAILGUN_HOST=$_MAILGUN_HOST
MAILGUN_PORT=$_MAILGUN_PORT
MAILGUN_USER=$_MAILGUN_USER
MAILGUN_PASS=$_MAILGUN_PASS
MAILGUN_NAME=$_MAILGUN_NAME
REDIS_HOST=$_REDIS_HOST
REDIS_PORT=$_REDIS_PORT
GS_BACKUP_BUCKET=$_GS_BACKUP_BUCKET

if [ "$1" = "release" ]; then
  BRANCH_NAME="$1"
fi

API_SERVERNAME=api.sense.tw
FRONT_SERVERNAME=sense.tw
PUBLIC_URL=https\\:\\/\\/api.sense.tw\\/
DB_NAME=sensemap

if [ "$BRANCH_NAME" != "release" ]; then
  DB_NAME="sensemap_${BRANCH_NAME}"
  MAILGUN_NAME="${BRANCH_NAME}.${MAILGUN_NAME}"
  API_SERVERNAME=staging.api.sense.tw
  FRONT_SERVERNAME=staging.sense.tw
  PUBLIC_URL=https\\:\\/\\/staging.api.sense.tw\\/
fi

if [ "$BRANCH_NAME" != "release" ] && [ "$BRANCH_NAME" != "master" ]; then
  PUBLIC_URL="https\\:\\/\\/${BRANCH_NAME}.staging.api.sense.tw\\/"
  API_SERVERNAME="${BRANCH_NAME}.staging.api.sense.tw"
  FRONT_SERVERNAME="${BRANCH_NAME}.staging.sense.tw"
fi

if [ -z "$SESSION_SECRET" ]; then
  SESSION_SECRET="TEST"
fi

sed -i "s/\${DB_HOST}/$DB_HOST/g" restore_env.yaml
sed -i "s/\${DB_NAME}/$DB_NAME/g" restore_env.yaml
sed -i "s/\${DB_ACCOUNT}/$DB_ACCOUNT/g" restore_env.yaml
sed -i "s/\${DB_PASSWORD}/$DB_PASSWORD/g" restore_env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" restore_env.yaml
sed -i "s/\${GS_BACKUP_BUCKET}/$GS_BACKUP_BUCKET/g" restore_env.yaml
sed -i "s/\${DB_HOST}/$DB_HOST/g" env.yaml
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
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-staging.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-staging.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap_service.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap_service.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" nginx.yaml
sed -i "s/\${API_SERVERNAME}/$API_SERVERNAME/g" nginx.yaml
sed -i "s/\${FRONT_SERVERNAME}/$FRONT_SERVERNAME/g" nginx.yaml

if [ "$1" = "release" ]; then
  cat <<EOT >> env.yaml
  REDIS_HOST: $REDIS_HOST
  REDIS_PORT: "$REDIS_PORT"
EOT
else
  sed -i '/    nodePort\: 30600/d' sensemap_service.yaml
fi
