const { exporter } = require('./index');

describe('#exporter', () => {
  const composeDatabaseMock = payload => {
    return (database = {
      prepare: () => {
        return {
          all: () => payload,
        };
      },
    });
  };

  beforeEach(() => {
    process.stdout.write = jest.fn();
  });

  test('writes pull request data in csv to std out', async () => {
    const database = composeDatabaseMock([
      {
        repository: 'bob/left-pad',
        data:
          '{"createdAt":"2019-04-03T23:55:58Z","closedAt":"2019-04-04T15:55:36Z","updatedAt":"2019-05-03T17:35:13Z","mergedAt":"2019-04-04T15:55:36Z","id":"MDExOlB1bGxSZXF1ZXN0MjY3MjUwMzMy","title":"React events: keyboard press, types, tests","url":"https://github.com/facebook/react/pull/15314","comments":{"totalCount":1},"additions":584,"changedFiles":6,"deletions":241}',
      },
    ]);

    await exporter(database);
    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls).toEqual([
      [
        'owner,repository,id,size,time_to_merge,created_at,closed_at,updated_at,merged_at,title,url,comments,additions,changed_files,deletions\n',
      ],
      [
        'bob,left-pad,MDExOlB1bGxSZXF1ZXN0MjY3MjUwMzMy,size_xl,57578,2019-04-03T23:55:58Z,2019-04-04T15:55:36Z,2019-05-03T17:35:13Z,2019-04-04T15:55:36Z,"React events: keyboard press, types, tests",https://github.com/facebook/react/pull/15314,1,584,6,241\n',
      ],
    ]);
  });
});
