#!/bin/bash

URL=sense.tw
API_URL=api.sense.tw
cd /workspace

if [ ! -f /workspace/gcs-build/build-date ]; then
    mkdir -p gcs-build
    date >> ./gcs-build/build-date
else
    exit 1
fi

if [ "$1" = "release" ]; then
    commit="$2"
else
    branch="$2"
    commit="$3"
    URL=${branch}.staging.sense.tw
    API_URL=${branch}.staging.api.sense.tw

    if [ "$2" = "master" ]; then
        URL=staging.sense.tw
        API_URL=staging.api.sense.tw
    fi
fi

echo "${URL}" >> ./gcs-build/build-url
export REACT_APP_SENSEMAP_API_ROOT=https://${API_URL}
export REACT_APP_SENSEMAP_GRAPHQL_ROOT=https://${API_URL}/graphql

yarn
PUBLIC_URL="" yarn run build
cp -r ./build/* ./gcs-build/
