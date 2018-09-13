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

GA_ID="$3"
COMMIT_SHA="$2"
BRANCH="$1"

if [ "$1" != "release" ]; then
    URL=${BRANCH}.staging.sense.tw
    API_URL=${BRANCH}.staging.api.sense.tw
fi

if [ "$1" = "master" ]; then
    URL=staging.sense.tw
    API_URL=staging.api.sense.tw
fi

export REACT_APP_SENSEMAP_API_ROOT=https://${API_URL}
export REACT_APP_SENSEMAP_GRAPHQL_ROOT=https://${API_URL}/graphql
export REACT_APP_TRACKING_ID=${GA_ID}

if [ "$1" = "_docker_test" ]; then
    URL="$2"
    API_URL="$3"
    GA_ID=""
    export REACT_APP_SENSEMAP_API_ROOT=http://${API_URL}
    export REACT_APP_SENSEMAP_GRAPHQL_ROOT=http://${API_URL}/graphql
    export REACT_APP_TRACKING_ID=${GA_ID}
fi

yarn
PUBLIC_URL="" yarn run build
