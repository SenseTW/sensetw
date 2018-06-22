#!/bin/bash
# Build Image and Push to GCLOUD
# Usage: ./gcloud-installer.sh [PROJECT_NAME]

PROJECT_NAME="$1"
if [[ $# -eq 0 ]] ; then
    PROJECT_NAME=ggv-notetool
fi

#docker build -t gcr.io/${PROJECT_NAME}/sense-builder sensemap/.
#gcloud docker -- push gcr.io/${PROJECT_NAME}/sense-builder
#gcloud docker -- push gcr.io/${PROJECT_NAME}/sensemap-backend
docker build -t gcr.io/${PROJECT_NAME}/api-builder sensemap-backend/.
gcloud docker -- push gcr.io/${PROJECT_NAME}/api-builder
