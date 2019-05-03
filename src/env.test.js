const { getOrFail } = require('./env');

describe('#getOrFail', () => {
  test('throws an error if environment variable does not exist', () => {
    expect(() => getOrFail('DOES_NOT_EXIST')).toThrow(
      new Error('Environment "DOES_NOT_EXIST" does not exist.')
    );
  });

  test('returns the environment variable value if it does exist', () => {
    process.env.DOES_EXIST = 'DOES_EXIST';
    expect(getOrFail('DOES_EXIST')).toEqual('DOES_EXIST');
  });
});
