The builder is used to build sensemap.

# Build sensemap using Docker
```
cd sensetw/builder/
./docker-build.sh
```

# Install builder to google cloud container registry
```
cd sensetw/builder/
./gcloud-installse.sh [PROJECT NAME]
```
And you can find the images in gcr.io/[PROJECT NAME]/sense-builder

# License
MIT.
