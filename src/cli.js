const { collector } = require('./collector');
const { exporter: graphiteExporter } = require('./exporter/graphite');
const Database = require('better-sqlite3');
const { getOrFail } = require('./env');
const { GitHub } = require('github-graphql-api');
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('collect <owner> <repository>')
  .action(async (owner, repository) => {
    const database = new Database(getOrFail('DATABASE_PATH'), {
      fileMustExist: true,
    });
    const githubClient = new GitHub({
      token: getOrFail('GITHUB_TOKEN'),
    });

    const { numberOfPullRequestProcessed, lastCursor } = await collector(
      database,
      githubClient,
      owner,
      repository
    );

    process.stdout.write(
      `Stats for "${owner}-${repository}":\n` +
        `  Url "https://github.com/${owner}/${repository}/pulls?utf8=✓&q=is%3Apr+is%3Amerged":\n` +
        `  Number of processed pull requests: ${numberOfPullRequestProcessed}\n` +
        `  Last cursor: ${lastCursor}\n`
    );

    if (database.open) {
      database.close();
    }
  });

program
  .version(pkg.version)
  .command('export:toGraphite <owner> <repository>')
  .action(async (owner, repository) => {
    const database = new Database(getOrFail('DATABASE_PATH'), {
      fileMustExist: true,
    });

    await graphiteExporter(database, owner, repository);

    if (database.open) {
      database.close();
    }
  });

program.parse(process.argv);
