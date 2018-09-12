kubectl create configmap stage-proxy-config --from-file nginx.conf -o yaml --dry-run > nginx.yaml
