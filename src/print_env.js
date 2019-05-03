Object.keys(process.env)
  .sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  })
  .map(key => {
    process.stdout.write(`${key}: ${process.env[key]}\n`);
  });
