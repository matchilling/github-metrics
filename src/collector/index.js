const githubRequestConfig = {
  MAX_ITEMS: 50,
};

const collector = async (
  database,
  githubClient,
  githubUserName,
  githubRepoName
) => {
  setupDatabase(database);
  return await update(database, githubClient, githubUserName, githubRepoName);
};

const composeQuery = after => {
  const vars = ['$owner: String!', '$name: String!'];
  const opts = [
    `first: ${githubRequestConfig.MAX_ITEMS}`,
    'states: MERGED',
    'orderBy: { field: UPDATED_AT, direction: ASC }',
  ];
  if (after) {
    vars.push('$after: String!');
    opts.push('after: $after');
  }
  return `query(${vars.join(', ')}) {
    repository(owner: $owner, name: $name) {
      pullRequests(${opts.join(', ')}) {
        edges {
          node { createdAt, closedAt, updatedAt, mergedAt, id, title, url, comments {
            totalCount
          }, additions, changedFiles, deletions },
          cursor
        }
      }
    }
  }`;
};

const queryGitHub = async (githubClient, query, queryParams) => {
  try {
    return await githubClient.query(query, queryParams);
  } catch (error) {
    process.stderr.write('Error while querying GitHub:\n');
    process.stderr.write(JSON.stringify(error, 0, 2) + '\n');
    process.exit(1);
  }
};

const update = async (
  database,
  githubClient,
  githubUserName,
  githubRepoName,
  acc = {
    numberOfPullRequestProcessed: 0,
    lastCursor: '',
  }
) => {
  const repository = `${githubUserName}/${githubRepoName}`;
  const stmt = database.prepare(
    `SELECT value FROM pull_request_cursor WHERE repository = ?;`
  );
  const lastCursor = stmt.get(repository);

  const queryParams = {
    owner: githubUserName,
    name: githubRepoName,
  };

  let query = undefined;
  if (lastCursor) {
    queryParams.after = lastCursor.value;
    query = composeQuery(lastCursor.value);
  } else {
    query = composeQuery();
  }

  const response = await queryGitHub(githubClient, query, queryParams);
  const edges = response.repository.pullRequests.edges;

  acc.numberOfPullRequestProcessed += edges.length;

  if (edges.length > 0) {
    edges.forEach(({ node }) => {
      const stmt = database.prepare(
        'INSERT OR REPLACE INTO pull_request (pull_request_id, repository, data) VALUES (?, ?, ?)'
      );
      stmt.run(node.id, repository, JSON.stringify(node));
    });

    const stmt = database.prepare(
      'INSERT OR REPLACE INTO pull_request_cursor (repository, value) VALUES (?, ?)'
    );
    acc.lastCursor = edges[edges.length - 1].cursor;
    stmt.run(repository, acc.lastCursor);
  }

  if (edges.length >= githubRequestConfig.MAX_ITEMS) {
    return await update(
      database,
      githubClient,
      githubUserName,
      githubRepoName,
      acc
    );
  }

  return acc;
};

const setupDatabase = database => {
  const sql = `
    CREATE TABLE IF NOT EXISTS pull_request(
      pull_request_id TEXT PRIMARY KEY,
      repository TEXT NOT NULL,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pull_request_cursor(
      repository TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;
  database.exec(sql);
};

module.exports = {
  collector,
  composeQuery,
  setupDatabase,
  update,
};
