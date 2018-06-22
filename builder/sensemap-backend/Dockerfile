FROM ubuntu:16.04

RUN mkdir /workspace
RUN mkdir /templates
ADD scripts/build.sh /opt/
ADD templates/* /templates/

ENTRYPOINT ["/opt/build.sh"]
