[![Build Status](https://travis-ci.org/matchilling/github-metrics-graphite-exporter.svg?branch=master)](https://travis-ci.org/matchilling/github-metrics-graphite-exporter)

# Github PR Metrics Graphite Exporter

[![Grafana Example](./data/github-pr-metrics.png)](./data/github-pr-metrics.png)

This exporter converts raw GitHub pull request data to time series. The exported data points represent the number of seconds (⏰ business hours only, Mon-Fri 09:00 - 17:00) elapsed between the creation of the pull request and the merging of the pull request.

The timestamp is the creation time of the PR.

Exposed metrics name: `prs.time_to_merge`

## Usage

```sh
$ npm install

# Path to the SQLite db file containing the PR data retrieved from GitHub.
$ export PULL_REQUESTS_DATABASE_PATH=data/example.db

$ npm start

# The generated time series will be written to `stdout`.
# prs.time_to_merge 3450 1554125772
# prs.time_to_merge 935617 1553187544
# ...
```

If you have docker installed, try `make run` to explore the metric. The target spins up a Graphite stack and injects some [sample data](./data/example.db) which can be explored through the exposed Graphite UI on [localhost:80](http://localhost).

## Todo

- [x] Exclude non-business hours from calculation
- [ ] Exclude public holidays from calculation
