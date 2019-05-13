.PHONY: default
default: help;

include .env

IMAGE := 'matchilling/github-metrics:latest'
CARBON_PLAINTEXT_PORT :=2003
STACK_SLUG := 'github-metrics'

help:                ## Show this help
	@echo '----------------------------------------------------------------------'
	@echo $(STACK_SLUG)
	@echo '----------------------------------------------------------------------'
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo '----------------------------------------------------------------------'

build:               ## Build app
	@docker build \
		--file Dockerfile \
		--tag ${DOCKER_ACCOUNT}/${STACK_SLUG}:latest .

collect:             ## Run collector
	@docker run \
		--env GITHUB_TOKEN=${GITHUB_TOKEN} \
		--env DATABASE_PATH=${DATABASE_PATH} \
		--volume data:/opt/github-metrics/data \
		${IMAGE} npm start --silent collect ${owner} ${repository}

export-csv:          ## Run csv export
	@docker run \
		--env GITHUB_TOKEN=${GITHUB_TOKEN} \
		--env DATABASE_PATH=${DATABASE_PATH} \
		--volume data:/opt/github-metrics/data \
		${IMAGE} npm start --silent export:csv

export-graphite:     ## Run graphite export
	@docker run \
		--env GITHUB_TOKEN=${GITHUB_TOKEN} \
		--env DATABASE_PATH=${DATABASE_PATH} \
		--volume data:/opt/github-metrics/data \
		${IMAGE} npm start --silent export:graphite ${owner} ${repository}

push-image:          ## Release image
	@docker push ${DOCKER_ACCOUNT}/${STACK_SLUG}:latest

graphite:            ## Builds and runs a graphite container
	@docker run -d \
	  --name $(STACK_SLUG)-graphite \
	  --restart=always\
	  -p 80:80\
	  -p $(CARBON_PLAINTEXT_PORT)-2004:$(CARBON_PLAINTEXT_PORT)-2004\
	  -p 2023-2024:2023-2024\
	  -p 8125:8125/udp\
	  -p 8126:8126\
	  graphiteapp/graphite-statsd

test:                ## Execute tests
	@npm test
