#!/bin/bash

cd /workspace

echo "Checking Database Connection ..."
while true; do
    CHECK_RESULT=$( yarn --silent run dbms:verify )
    if [ "$CHECK_RESULT" == "connected" ]
    then
      echo "$CHECK_RESULT"
      break
    fi
    sleep 1s
done

echo "Checking Database Exists ..."
yarn --silent run db:create

if [ "$1" != "release" ] && [ "$1" != "master" ]; then
    yarn --silent run db:create
fi

echo "Running Database Migration ..."
if [ "$1" != "release" ] && [ "$1" != "master" ]; then
    yarn run migrate up
fi

yarn start
