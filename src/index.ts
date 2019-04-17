import * as sqlite from 'sqlite';
import * as moment from 'moment';
import { durationInSecondsExcludingWeekends } from './weekend';

class PullRequestData {
  differenceInSeconds: number;

  constructor(
    private createdAt: moment.Moment,
    private closedAt: moment.Moment,
    private updatedAt: moment.Moment,
    private mergedAt: moment.Moment
  ) {
    this.differenceInSeconds = durationInSecondsExcludingWeekends(
      createdAt,
      mergedAt,
      true
    );
  }

  static from(
    createdAt: string,
    closedAt: string,
    updatedAt: string,
    mergedAt: string
  ): PullRequestData {
    return new PullRequestData(
      moment(createdAt),
      moment(closedAt),
      moment(updatedAt),
      moment(mergedAt)
    );
  }

  toGraphite(): string {
    return `prs.time_to_merge ${
      this.differenceInSeconds
    } ${this.createdAt.unix()}\n`;
  }
}

async function queryDb(dbFileName: string): Promise<PullRequestData[]> {
  const db = await sqlite.open(dbFileName);
  const results = await db.all('SELECT * FROM pull_requests');
  return results.map(result => {
    const data = JSON.parse(result.data);
    return PullRequestData.from(
      data.createdAt,
      data.closedAt,
      data.updatedAt,
      data.mergedAt
    );
  });
}

if (!process.env.PULL_REQUESTS_DATABASE_PATH) {
  console.error(
    'Env var PULL_REQUESTS_DATABASE_PATH must be defined and' +
      ' point to the db file'
  );
  process.exit(1);
}

(async () => {
  const results = await queryDb(process.env.PULL_REQUESTS_DATABASE_PATH);
  results.forEach(result => {
    process.stdout.write(result.toGraphite());
  });
})().catch(e => {
  console.error(e);
});
