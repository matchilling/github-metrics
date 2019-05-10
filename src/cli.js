const { collector } = require('./collector');
const { exporter: graphiteExporter } = require('./exporter/graphite');
const Database = require('better-sqlite3');
const { getOrFail } = require('./env');
const { GitHub } = require('github-graphql-api');
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('collect')
  .action(async () => {
    const database = new Database(getOrFail('DATABASE_PATH'), {
      fileMustExist: true,
    });
    const githubClient = new GitHub({
      token: getOrFail('GITHUB_TOKEN'),
    });

    const githubUserName = getOrFail('GITHUB_USER_NAME');
    const githubRepoName = getOrFail('GITHUB_REPO_NAME');
    const { numberOfPullRequestProcessed, lastCursor } = await collector(
      database,
      githubClient,
      githubUserName,
      githubRepoName
    );

    process.stdout.write(
      `Stats for "${githubUserName}-${githubRepoName}":\n` +
        `  Url "https://github.com/${githubUserName}/${githubRepoName}/pulls?utf8=✓&q=is%3Apr+is%3Amerged":\n` +
        `  Number of processed pull requests: ${numberOfPullRequestProcessed}\n` +
        `  Last cursor: ${lastCursor}\n`
    );

    if (database.open) {
      database.close();
    }
  });

program
  .version(pkg.version)
  .command('export:toGraphite')
  .action(async () => {
    const database = new Database(getOrFail('DATABASE_PATH'), {
      fileMustExist: true,
    });

    await graphiteExporter(
      database,
      getOrFail('GITHUB_USER_NAME'),
      getOrFail('GITHUB_REPO_NAME')
    );

    if (database.open) {
      database.close();
    }
  });

program.parse(process.argv);
