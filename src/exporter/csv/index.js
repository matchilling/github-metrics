const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const moment = require('moment');
const { sizeLabel } = require('../../lib/sizeLabel');

const fields = {
  OWNER: 'owner',
  REPOSITORY: 'repository',
  ID: 'id',
  SIZE: 'size',
  TIME_TO_MERGE: 'time_to_merge',
  CREATED_AT: 'created_at',
  CLOSED_AT: 'closed_at',
  UPDATED_AT: 'updated_at',
  MERGED_AT: 'merged_at',
  TITLE: 'title',
  URL: 'url',
  COMMENTS: 'comments',
  ADDITIONS: 'additions',
  CHANGED_FILES: 'changed_files',
  DELETIONS: 'deletions',
};

const exporter = async database => {
  const stringifier = createCsvStringifier({
    header: Object.keys(fields).map(key => ({
      id: fields[key],
      title: fields[key],
    })),
  });

  process.stdout.write(stringifier.getHeaderString());

  await database
    .prepare('SELECT * FROM pull_request;')
    .all()
    .map(async row => {
      const { repository } = row;
      const owner = repository.split('/')[0];
      const repo = repository.split('/')[1];

      const data = JSON.parse(row.data);
      const size = sizeLabel(data.additions + data.deletions);

      if (size) {
        const createdAt = moment(data.createdAt);
        const mergedAt = moment(data.mergedAt);
        const timeToMerge = mergedAt.diff(createdAt, 's');

        const record = {
          [fields.OWNER]: owner,
          [fields.REPOSITORY]: repo,
          [fields.ID]: data.id,
          [fields.SIZE]: size,
          [fields.TIME_TO_MERGE]: timeToMerge,
          [fields.CREATED_AT]: data.createdAt,
          [fields.CLOSED_AT]: data.closedAt,
          [fields.UPDATED_AT]: data.updatedAt,
          [fields.MERGED_AT]: data.mergedAt,
          [fields.TITLE]: data.title,
          [fields.URL]: data.url,
          [fields.COMMENTS]: data.comments.totalCount,
          [fields.ADDITIONS]: data.additions,
          [fields.CHANGED_FILES]: data.changedFiles,
          [fields.DELETIONS]: data.deletions,
        };

        process.stdout.write(stringifier.stringifyRecords([record]));
      }
    });
};

module.exports = {
  exporter,
};
