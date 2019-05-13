const { exporter, toMetricTimeToMerge } = require('./index');

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

  test('writes to std out the correct metric', () => {
    const database = composeDatabaseMock([
      {
        repository: 'bob/left-pad',
        data:
          '{"createdAt":"2018-03-20T11:02:32Z","mergedAt":"2018-03-20T14:21:36Z","additions":369,"deletions":174}',
      },
    ]);

    exporter(database, 'bob', 'left-pad');
    expect(process.stdout.write).toHaveBeenCalledWith(
      'github.bob.left-pad.pull_requests.size_xl.time_to_merge 11944 1521543752\n'
    );
  });

  test('ignores input if size label can not be determined', () => {
    const database = composeDatabaseMock([
      {
        repository: 'bob/left-pad',
        data:
          '{"createdAt":"2018-03-20T11:02:32Z","mergedAt":"2018-03-20T14:21:36Z","additions":"foo","deletions":"bar"}',
      },
    ]);

    exporter(database, 'bob', 'left-pad');
    expect(process.stdout.write).toHaveBeenCalledTimes(0);
  });
});
