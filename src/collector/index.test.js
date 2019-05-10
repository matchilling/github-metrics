const { composeQuery, setupDatabase } = require('./index');

describe('#setupDatabase', () => {
  let database = undefined;

  beforeEach(() => {
    database = {
      exec: jest.fn(),
    };
  });

  test('creates the database schema', () => {
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

    setupDatabase(database);
    expect(database.exec).toHaveBeenCalledTimes(1);
    expect(database.exec).toHaveBeenCalledWith(sql);
  });
});

describe('#composeQuery', () => {
  test('composes graphql query to retrieve pull request data', () => {
    const query = composeQuery().replace(/ /g, '');
    const expected = `query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        pullRequests(first: 50, states: MERGED, orderBy: { field: UPDATED_AT, direction: ASC }) {
          edges {
            node { createdAt, closedAt, updatedAt, mergedAt, id, title, url, comments {
              totalCount
            }, additions, changedFiles, deletions },
            cursor
          }
        }
      }
    }`.replace(/ /g, '');

    expect(query).toEqual(expected);
  });

  test('composes graphql query to retrieve pull request data with after cursor', () => {
    const query = composeQuery(
      'Y3Vyc29yOnYyOpK5MjAxOS0wNS0wOFQxODozNTowNCswMjowMM4Qgrmo'
    ).replace(/ /g, '');
    const expected = `query($owner: String!, $name: String!, $after: String!) {
      repository(owner: $owner, name: $name) {
        pullRequests(first: 50, states: MERGED, orderBy: { field: UPDATED_AT, direction: ASC }, after: $after) {
          edges {
            node { createdAt, closedAt, updatedAt, mergedAt, id, title, url, comments {
              totalCount
            }, additions, changedFiles, deletions },
            cursor
          }
        }
      }
    }`.replace(/ /g, '');

    expect(query).toEqual(expected);
  });
});
