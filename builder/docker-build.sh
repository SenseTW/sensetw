#docker build -t gcr.io/ggv-notetool/sense-builder sensemap/.
#docker build -t gcr.io/ggv-notetool/api-builder sensemap-backend/.
#docker run -v $(pwd)/workspace:/workspace gcr.io/ggv-notetool/api-builder release test-commit-sha
cd ..
sudo rm -rf sensemap/build sensemap/gcs-build sensemap/node_modules
docker build -t gcr.io/ggv-notetool/sensemap --build-arg ENV=stage COMMIT_SHA=test-commit-sha BRANCH_NAME=master .

#docker build -t gcr.io/ggv-notetool/sensemap-backend sensemap-backend/.

