[![Build Status](https://travis-ci.org/matchilling/github-metrics.svg?branch=master)](https://travis-ci.org/matchilling/github-metrics)

# Github Pull Request Metrics

[![Grafana Example](./data/github-pr-metrics.png)](./data/github-pr-metrics.png)

This exporter converts raw GitHub pull request data to time series. The exported data points represent the number of seconds elapsed between the creation of the pull request and the merging of the pull request.

The timestamp is the creation time of the PR.

Exposed metrics name: `github.{GITHUB_USER_NAME}.{GITHUB_REPO_NAME}.pull_requests.time_to_merge`

## Usage

```sh
# The user and repo name you want to collect and display metrics
#   e.g. https://github.com/facebook/react
#   GITHUB_USER_NAME=facebook
#   GITHUB_REPO_NAME=react
$ export GITHUB_USER_NAME=github-user-name
$ export GITHUB_REPO_NAME=github-repo-name

# Create a personal access tokens (https://github.com/settings/tokens/new)
$ export GITHUB_TOKEN=github-token

# Path to the SQLite db file to store the collected data
$ export DATABASE_PATH=data/github.db

$ npm install

# Collect data from GitHub
$ npm start collect

# Push data to graphite
$ npm start export | nc localhost 2003

# The generated time series will be written to `stdout`.
# github.github-user-name.repository-name.pull_requests.time_to_merge 3450 1554125772
# github.github-user-name.repository-name.pull_requests.time_to_merge 935617 1553187544
# ...
```

You can run the complete stack using [Docker Compose](https://docs.docker.com/compose/), just set your environment variables in the `.env` file in the root project according to the example `.env.example` and run `docker-compose up`.

For example:
```sh
# Note that the `./data` directory is mounted to the docker container, to keep your data persistent place your sqlite database in here
$ cat > .env <<EOL
GITHUB_USER_NAME=facebook
GITHUB_REPO_NAME=react
GITHUB_TOKEN=create a new token here https://github.com/settings/tokens/new
DATABASE_PATH=path to your sqlite3 database e.g. data/github.db
EOL

$ docker-compose up
```
