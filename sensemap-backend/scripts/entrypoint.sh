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

if [ "$1" != "release" ] && [ "$1" != "master" ]; then
    echo "Checking Database Exists ..."
    yarn --silent run db:create
fi

#if [ "$1" != "release" ] && [ "$1" != "master" ]; then
if [ "$1" != "master" ]; then
    echo "Running Database Migration ..."
    yarn run migrate up
fi

echo "Start Service ..."
yarn start
