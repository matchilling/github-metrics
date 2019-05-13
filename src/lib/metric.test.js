const { timeToMerge } = require('./metric');

describe('#timeToMerge', () => {
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
      const result = timeToMerge(useCase.data, 'path.to.metric');
      expect(result).toEqual(
        `path.to.metric ${useCase.differenceSeconds} 1556791200`
      );
    });
  });
});
