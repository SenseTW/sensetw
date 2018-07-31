#!/bin/sh
cp /templates/* /workspace/
cd /workspace

BRANCH_NAME=$1
COMMIT_SHA=$2
DB_ACCOUNT=$3
DB_PASSWORD=$4
SESSION_SECRET=$5

PUBLIC_URL=https\\:\\/\\/staging.api.sense.tw\\/
DB_NAME=sensemap
if [ "$1" != "release" ] && [ "$1" != "master" ]; then
  DB_NAME="sensemap_${BRANCH_NAME}"
  PUBLIC_URL="https\\:\\/\\/${BRANCH_NAME}.staging.api.sense.tw\\/"
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
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend_service.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend_service.yaml

