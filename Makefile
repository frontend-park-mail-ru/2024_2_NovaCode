ENV_FILE = ./docker/.env
include $(ENV_FILE)

DOCKER_COMPOSE_PATH = ./docker/docker-compose.yaml

# use `gawk` on mac os
AWK := awk
ifeq ($(shell uname -s), Darwin)
	AWK = gawk
    ifeq (, $(shell which gawk 2> /dev/null))
        $(error "gawk not found")
    endif
endif

################################################################################
# Miscellaneous
################################################################################

.PHONY: help
## (default) Show help page.
help:
	@echo "$$(tput bold)Available rules:$$(tput sgr0)";echo;sed -ne"/^## /{h;s/.*//;:d" -e"H;n;s/^## //;td" -e"s/:.*//;G;s/\\n## /---/;s/\\n/ /g;p;}" ${MAKEFILE_LIST}|awk -F --- -v n=$$(tput cols) -v i=29 -v a="$$(tput setaf 6)" -v z="$$(tput sgr0)" '{printf"%s%*s%s ",a,-i,$$1,z;m=split($$2,w," ");l=n-i;for(j=1;j<=m;j++){l-=length(w[j])+1;if(l<= 0){l=n-i-length(w[j])-1;printf"\n%*s ",-i," ";}printf"%s ",w[j];}printf"\n\n";}'

################################################################################
# Containers
################################################################################

.PHONY: docker-build
## Build docker container static server.
docker-build:
	docker compose -f $(DOCKER_COMPOSE_PATH) --env-file $(ENV_FILE) build

.PHONY: docker-start
## Start docker compose containers (all by default).
## Format: `docker-start [compose=<docker-compose-service>]`.
## Example: `docker-start`, `docker-stop compose=postgres`.
docker-start:
	@docker compose -f $(DOCKER_COMPOSE_PATH) --env-file $(ENV_FILE) up -d $(compose)

.PHONY: docker-stop
## Stop docker compose containers (all by default).
## Format: `docker-stop [compose=<docker-compose-service>]`.
## Example: `docker-stop`, `docker-stop compose=postgres`.
docker-stop:
	@docker compose -f $(DOCKER_COMPOSE_PATH) stop $(compose)

.PHONY: docker-ash
## Run `ash` in docker container of static server.
docker-ash:
	@docker exec -it $(SERVICE_NAME) /bin/ash

.PHONY: docker-clean
## Remove containers, networks, volumes, and images created by `make docker-start`.
docker-clean:
	@docker compose -f $(DOCKER_COMPOSE_PATH) down

version ?= latest

.PHONY: build-image
## Build docker image of frontend static server with name.
build-image:
	@docker build -f docker/Dockerfile.dev --platform linux/amd64 -t daronenko/$(SERVICE_NAME)-frontend:$(version) .

.PHONY: push-image
## Push docker image of frontend static server to the docker hub.
push-image:
	@docker push daronenko/$(SERVICE_NAME)-frontend:$(version)
