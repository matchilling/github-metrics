.PHONY: default
default: help;

include .env

CARBON_PLAINTEXT_PORT :=2003
STACK_SLUG := 'github-metrics'

help:          ## Show this help
	@echo '----------------------------------------------------------------------'
	@echo $(STACK_SLUG)
	@echo '----------------------------------------------------------------------'
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo '----------------------------------------------------------------------'

test:          ## Execute tests
	@npm test

run-collect:
	@docker run \
		--env GITHUB_TOKEN=${GITHUB_TOKEN} \
		--env DATABASE_PATH=${DATABASE_PATH} \
		--volume data:/opt/github-metrics/data \
		--name $(STACK_SLUG)-app \
		${STACK_SLUG}-app npm start collect ${OWNER} ${REPO}

build-collect:
	@docker build . \
		--file Dockerfile \
		--tag ${STACK_SLUG}-app

run-graphite:  ## Builds and runs a graphite container
	@docker run -d \
	  --name $(STACK_SLUG)-graphite \
	  --restart=always\
	  -p 80:80\
	  -p $(CARBON_PLAINTEXT_PORT)-2004:$(CARBON_PLAINTEXT_PORT)-2004\
	  -p 2023-2024:2023-2024\
	  -p 8125:8125/udp\
	  -p 8126:8126\
	  graphiteapp/graphite-statsd
