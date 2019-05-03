const getOrFail = variableName => {
  if (!process.env.hasOwnProperty(variableName))
    throw new Error(`Environment "${variableName}" does not exist.`);

  return process.env[variableName];
};

module.exports = {
  getOrFail,
};
