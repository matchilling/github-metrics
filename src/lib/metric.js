const moment = require('moment');

const timeToMerge = (data, metricPath) => {
  const createdAt = moment(data.createdAt);
  const mergedAt = moment(data.mergedAt);
  const differenceInSeconds = mergedAt.diff(createdAt, 's');

  return `${metricPath} ${differenceInSeconds} ${createdAt.unix()}`;
};

module.exports = {
  timeToMerge,
};
