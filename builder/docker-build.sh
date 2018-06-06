docker build -t asia.gcr.io/ggv-notetool/sense-builder .
cd ..
sudo rm -rf sensemap/build sensemap/gcs-build sensemap/node_modules
docker run -v $(pwd)/sensemap:/workspace asia.gcr.io/ggv-notetool/sense-builder release test-commit-sha
