const sizeLabel = lineCount => {
  const sizes = {
    s: 10,
    m: 30,
    l: 100,
    xl: 500,
    xxl: 1000,
  };

  if (!Number.isInteger(lineCount)) {
    return undefined;
  } else if (lineCount < 0) {
    return undefined;
  } else if (lineCount < sizes.s) {
    return 'size_xs';
  } else if (lineCount < sizes.m) {
    return 'size_s';
  } else if (lineCount < sizes.l) {
    return 'size_m';
  } else if (lineCount < sizes.xl) {
    return 'size_l';
  } else if (lineCount < sizes.xxl) {
    return 'size_xl';
  }

  return 'size_xxl';
};

module.exports = {
  sizeLabel,
};
