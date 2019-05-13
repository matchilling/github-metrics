const { timeToMerge } = require('../../lib/metric');
const { sizeLabel } = require('../../lib/sizeLabel');

const exporter = async (database, githubUserName, githubRepoName) => {
  await database
    .prepare('SELECT * FROM pull_request WHERE repository = ?;')
    .all(`${githubUserName}/${githubRepoName}`)
    .map(row => {
      const { repository } = row;
      const owner = repository.split('/')[0];
      const repo = repository.split('/')[1];

      const data = JSON.parse(row.data);
      const size = sizeLabel(data.additions + data.deletions);

      if (size) {
        const metric = timeToMerge(
          data,
          `github.${owner}.${repo}.pull_requests.${size}.time_to_merge`
        );

        process.stdout.write(`${metric}\n`);
      }
    });
};

module.exports = {
  exporter,
};
