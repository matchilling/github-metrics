# Github PR metrics graphite exporter

### Description
Converts raw github PR data to time series.

The data point is the number of seconds elapsed between the creation of the PR and the merging of the PR.

The timestamp is the creation time of the PR.

Metrics name: `prs.time_to_merge`

### Example output:

```
prs.time_to_merge 3450 1554125772
prs.time_to_merge 935617 1553187544
```

### Requirements
Node v10+

### Installation
`npm install`

### Required environment variables
`PULL_REQUESTS_DATABASE_PATH`: path to the SQLite db file containing the PR data retrieved from GitHub. 

###Usage
```
PULL_REQUESTS_DATABASE_PATH=sample.db node ./node_modules/ts-node/dist/bin.js src/index.ts
```

The generated time series will be written to `stdout`.