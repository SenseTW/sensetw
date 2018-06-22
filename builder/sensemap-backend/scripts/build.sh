#!/bin/sh
cp /templates/* /workspace/
cd /workspace

BRANCH_NAME=$1
COMMIT_SHA=$2

DB_NAME=sensemap
if [ "$1" != "release" ] && [ "$1" != "master" ]; then
  DB_NAME="sensemap_${BRANCH_NAME}"
fi

sed -i "s/\${DB_NAME}/$DB_NAME/g" env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend_service.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend_service.yaml
