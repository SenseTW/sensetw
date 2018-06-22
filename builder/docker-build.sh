docker build -t gcr.io/ggv-notetool/sense-builder sensemap/.
docker build -t gcr.io/ggv-notetool/api-builder sensemap-backend/.
#docker run -v $(pwd)/workspace:/workspace gcr.io/ggv-notetool/api-builder release test-commit-sha
cd ..
sudo rm -rf sensemap/build sensemap/gcs-build sensemap/node_modules
docker run -v $(pwd)/sensemap:/workspace gcr.io/ggv-notetool/sense-builder release test-commit-sha

docker build -t gcr.io/ggv-notetool/sensemap-backend sensemap-backend/.

