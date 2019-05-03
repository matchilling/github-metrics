const moment = require('moment');

const toMetricTimeToMerge = (data, metricPath) => {
  const createdAt = moment(data.createdAt);
  const mergedAt = moment(data.mergedAt);
  const differenceInSeconds = mergedAt.diff(createdAt, 's');

  return `${metricPath} ${differenceInSeconds} ${createdAt.unix()}\n`;
};

const exporter = async (database, githubUserName, githubRepoName) => {
  console.log(database);
  await database
    .prepare('SELECT * FROM pull_request;')
    .all()
    .map(row => {
      process.stdout.write(
        toMetricTimeToMerge(
          JSON.parse(row.data),
          `github.${githubUserName}.${githubRepoName}.pull_requests.time_to_merge`
        )
      );
    });
};

module.exports = {
  exporter,
  toMetricTimeToMerge,
};
