const { exporter, toMetricTimeToMerge } = require('./index');

describe('#exporter', () => {
  let database = undefined;

  beforeEach(() => {
    const example = [
      {
        data:
          '{"createdAt":"2018-03-20T11:02:32Z","mergedAt":"2018-03-20T14:21:36Z"}',
      },
    ];

    database = {
      prepare: () => {
        return {
          all: () => example,
        };
      },
    };

    process.stdout.write = jest.fn();
  });

  test('writes to std out the correct metric', () => {
    exporter(database, 'bob', 'left-pad');
    expect(process.stdout.write).toHaveBeenCalledWith(
      'github.bob.left-pad.pull_requests.time_to_merge 11944 1521543752\n'
    );
  });
});

describe('#toMetricTimeToMerge', () => {
  test('calculates the elapsed time between the creation of a pull request and the merging of the pull request', () => {
    const useCases = [
      {
        data: {
          createdAt: '2019-05-02T10:00:00Z',
          mergedAt: '2019-05-02T11:00:00Z',
        },
        differenceSeconds: 60 * 60, // one hour
      },
      {
        data: {
          createdAt: '2019-05-02T10:00:00Z',
          mergedAt: '2019-05-03T10:00:00Z',
        },
        differenceSeconds: 60 * 60 * 24, // one day
      },
      {
        data: {
          createdAt: '2019-05-02T10:00:00Z',
          mergedAt: '2019-05-09T10:00:00Z',
        },
        differenceSeconds: 60 * 60 * 24 * 7, // one week
      },
      {
        data: {
          createdAt: '2019-05-02T10:00:00Z',
          mergedAt: '2019-06-02T10:00:00Z',
        },
        differenceSeconds: 60 * 60 * 24 * 31, // a month of 31 days
      },
    ];

    useCases.forEach(useCase => {
      const result = toMetricTimeToMerge(useCase.data, 'path.to.metric');
      expect(result).toEqual(
        `path.to.metric ${useCase.differenceSeconds} 1556791200\n`
      );
    });
  });
});
