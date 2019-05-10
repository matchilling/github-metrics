const moment = require('moment');

const toMetricTimeToMerge = (data, metricPath) => {
  const createdAt = moment(data.createdAt);
  const mergedAt = moment(data.mergedAt);
  const differenceInSeconds = mergedAt.diff(createdAt, 's');

  return `${metricPath} ${differenceInSeconds} ${createdAt.unix()}`;
};

const sizeLabel = lineCount => {
  const sizes = {
    s: 10,
    m: 30,
    l: 100,
    xl: 500,
    xxl: 1000,
  };

  if (!Number.isInteger(lineCount)) {
    return undefined;
  } else if (lineCount < 0) {
    return undefined;
  } else if (lineCount < sizes.s) {
    return 'size_xs';
  } else if (lineCount < sizes.m) {
    return 'size_s';
  } else if (lineCount < sizes.l) {
    return 'size_m';
  } else if (lineCount < sizes.xl) {
    return 'size_l';
  } else if (lineCount < sizes.xxl) {
    return 'size_xl';
  }

  return 'size_xxl';
};

const exporter = async (database, githubUserName, githubRepoName) => {
  await database
    .prepare('SELECT * FROM pull_request;')
    .all()
    .map(row => {
      const data = JSON.parse(row.data);
      const size = sizeLabel(data.additions + data.deletions);

      if (size) {
        const metric = toMetricTimeToMerge(
          data,
          `github.${githubUserName}.${githubRepoName}.pull_requests.${size}.time_to_merge`
        );

        process.stdout.write(`${metric}\n`);
      }
    });
};

module.exports = {
  exporter,
  sizeLabel,
  toMetricTimeToMerge,
};
