#!/bin/bash

URL=sense.tw

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
    URL=${branch}.stage.sense.tw

    if [ "$2" = "master" ]; then
        URL=stage.sense.tw
    fi
fi

echo "${URL}" >> ./gcs-build/build-url

yarn
#PUBLIC_URL=https://${URL}/ yarn run build
PUBLIC_URL="" yarn run build
cp -r ./build/* ./gcs-build/
