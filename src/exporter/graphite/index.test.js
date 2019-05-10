const { exporter, sizeLabel, toMetricTimeToMerge } = require('./index');

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
        data:
          '{"createdAt":"2018-03-20T11:02:32Z","mergedAt":"2018-03-20T14:21:36Z","additions":"foo","deletions":"bar"}',
      },
    ]);

    exporter(database, 'bob', 'left-pad');
    expect(process.stdout.write).toHaveBeenCalledTimes(0);
  });
});

describe('#sizeLabel', () => {
  test('returns the correct size label per line count', () => {
    const useCases = [
      {
        lineCount: NaN,
        expectedLabel: undefined,
      },
      {
        lineCount: -1,
        expectedLabel: undefined,
      },
      {
        lineCount: 0,
        expectedLabel: 'size_xs',
      },
      {
        lineCount: 9,
        expectedLabel: 'size_xs',
      },
      {
        lineCount: 10,
        expectedLabel: 'size_s',
      },
      {
        lineCount: 29,
        expectedLabel: 'size_s',
      },
      {
        lineCount: 30,
        expectedLabel: 'size_m',
      },
      {
        lineCount: 99,
        expectedLabel: 'size_m',
      },
      {
        lineCount: 100,
        expectedLabel: 'size_l',
      },
      {
        lineCount: 499,
        expectedLabel: 'size_l',
      },
      {
        lineCount: 500,
        expectedLabel: 'size_xl',
      },
      {
        lineCount: 999,
        expectedLabel: 'size_xl',
      },
      {
        lineCount: 1000,
        expectedLabel: 'size_xxl',
      },
    ];

    useCases.forEach(useCase => {
      expect(sizeLabel(useCase.lineCount)).toEqual(useCase.expectedLabel);
    });
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
        `path.to.metric ${useCase.differenceSeconds} 1556791200`
      );
    });
  });
});
