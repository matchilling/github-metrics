[![Build Status](https://travis-ci.org/matchilling/github-metrics.svg?branch=master)](https://travis-ci.org/matchilling/github-metrics)

# Github Pull Request Metrics

[![Grafana Example](./data/github-pr-metrics.png)](./data/github-pr-metrics.png)

## Available Metrics

| Tables        |                                                                  Description                                                                   |                                              Graphite Path |
| ------------- | :--------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------: |
| Time to merge | The exported data points represent the number of seconds elapsed between the creation of the pull request and the merging of the pull request. | `github.{OWNER}.{REPO}.pull_requests.{SIZE}.time_to_merge` |

**Explanation**:

- `OWNER`: the owner of the repo (e.g. facebook)
- `REPO`: the repository name (e.g. react)
- `SIZE`: size calculated based on the total lines of code changed (additions and deletions).

### Pull Request Sizes

The pull request size calculated based on the total lines of code changed (`total additions + total deletions`).

| Name       | Description                              |
| ---------- | ---------------------------------------- |
| `size_XS`  | Denotes a PR that changes 0-9 lines.     |
| `size_S`   | Denotes a PR that changes 10-29 lines.   |
| `size_m`   | Denotes a PR that changes 30-99 lines.   |
| `size_l`   | Denotes a PR that changes 100-499 lines. |
| `size_xl`  | Denotes a PR that changes 500-999 lines. |
| `size_xxl` | Denotes a PR that changes 1000+ lines.   |

## Usage

```sh
# Create a personal access tokens (https://github.com/settings/tokens/new)
$ export GITHUB_TOKEN=github-token

# Path to the SQLite db file to store the collected data
$ export DATABASE_PATH=data/github.db

$ npm install

# Collect data from GitHub
# npm start collect <owner> <repository>
$ npm start collect facebook react

# Push data to graphite
# npm start export <owner> <repository>
$ npm start export:graphite facebook react | nc localhost 2003

# The generated time series will be written to `stdout`.
# github.facebook.react.pull_requests.size_m.time_to_merge 3450 1554125772
# github.facebook.react.pull_requests.size_xxl.time_to_merge 935617 1553187544
# ...
```

You can run the complete stack using [Docker Compose](https://docs.docker.com/compose/), just set your environment variables in the `.env` file in the root project according to the example `.env.example` and run `docker-compose up`.

For example:

```sh
# Note that the `./data` directory is mounted to the docker container, to keep your data persistent place your sqlite database in here
$ cat > .env <<EOL
GITHUB_TOKEN=create a new token here https://github.com/settings/tokens/new
DATABASE_PATH=path to your sqlite3 database e.g. data/github.db
EOL

$ docker-compose up
```
