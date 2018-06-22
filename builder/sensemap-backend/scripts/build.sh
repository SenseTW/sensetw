#!/bin/sh
cp /templates/* /workspace/
cd /workspace

BRANCH_NAME=$1
COMMIT_SHA=$2

sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" env.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend.yaml
sed -i "s/\${BRANCH_NAME}/$BRANCH_NAME/g" sensemap-backend_service.yaml
sed -i "s/\${COMMIT_SHA}/$COMMIT_SHA/g" sensemap-backend_service.yaml
