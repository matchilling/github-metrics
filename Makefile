.PHONY: default
default: help;

CARBON_PLAINTEXT_PORT :=2003
STACK_SLUG := 'github-pr-metrics-graphite-exporter'

help:     ## Show this help
	@echo '----------------------------------------------------------------------'
	@echo $(STACK_SLUG)
	@echo '----------------------------------------------------------------------'
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo '----------------------------------------------------------------------'

test:     ## Execute tests
	@npm test

run:      ## Builds and runs the graphite stack with some sample data
	@docker run -d \
	  --name $(STACK_SLUG)\
	  --restart=always\
	  -p 80:80\
	  -p $(CARBON_PLAINTEXT_PORT)-2004:$(CARBON_PLAINTEXT_PORT)-2004\
	  -p 2023-2024:2023-2024\
	  -p 8125:8125/udp\
	  -p 8126:8126\
	  graphiteapp/graphite-statsd
	@npm install
	@PULL_REQUESTS_DATABASE_PATH=data/example.db npm start | nc localhost $(CARBON_PLAINTEXT_PORT)
	@open 'http://localhost/?target=prs.time_to_merge&from=00%3A00_20190101&until=23%3A59_20190416'

stop:     ## Stop the graphite stack
	@docker stop github-pr-metrics-graphite-exporter
