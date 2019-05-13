const { sizeLabel } = require('./sizeLabel');

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
