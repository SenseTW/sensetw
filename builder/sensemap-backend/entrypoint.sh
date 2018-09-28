#!/bin/bash

CMD=$1

cd /workspace

if [ "$CMD" = "cloudbuild-staging" ]; then
    echo "Waiting for Database prepare process"
    while true; do
        if [[ -f "/tmp/pod/main-terminated" ]]; then
	    rm /tmp/pod/main-terminated
	    break
        fi;
	sleep 1;
    done
fi

echo "Checking Database Connection ..."
while ! pg_isready -d $DATABASE_URL > /dev/null 2> /dev/null; do
    echo "Connecting to database Failed."
    sleep 1
done

echo "Running Database Migration ..."
yarn run migrate up

echo "Start Service ..."
yarn start
