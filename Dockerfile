FROM zefciu/dnsaas-base
MAINTAINER Pylabs <pylabs@allegro.pl>
RUN apt-get update && apt-get install -y libsasl2-dev python3.4-dev libldap2-dev libssl-dev
RUN mkdir dnsaas
ADD dnsaas dnsaas/dnsaas
ADD powerdns dnsaas/powerdns
ADD ui dnsaas/ui
ADD docker dnsaas/docker
ADD setup.py dnsaas/setup.py
ADD manage.py dnsaas/manage.py
ADD MANIFEST.in dnsaas/MANIFEST.in
ADD README.rst dnsaas/README.rst
ADD version.json dnsaas/version.json
RUN pip install ./dnsaas
CMD bin/bash dnsaas/docker/startup.sh
