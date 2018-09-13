The docker builder is used to test sensemap in local environment.

# Build and Running sensemap using Docker-Compose
```
cd sensetw/build/docker
docker-compose up
```

# Access Sensemap
```
FRONT: http://localhost:8888
API: http://localhost:9999
```
# Cleanup
```
docker-compose down --rmi 'all' -v
docker rmi $(docker images -a -q)
```

# License
MIT.
