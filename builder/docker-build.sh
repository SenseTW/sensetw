docker build -t gcr.io/ggv-notetool/sense-builder sensemap/.
cd ..
sudo rm -rf sensemap/build sensemap/gcs-build sensemap/node_modules
docker run -v $(pwd)/sensemap:/workspace gcr.io/ggv-notetool/sense-builder release test-commit-sha
docker build -t gcr.io/ggv-notetool/sensemap-backend sensemap-backend/.
