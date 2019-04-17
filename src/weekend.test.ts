import * as moment from 'moment';
import { durationInSecondsExcludingWeekends } from './weekend';

describe('Weekend exclusion', () => {
  it('handles dates on the same weekday', () => {
    const beginning = moment('2019-04-03T08:34:50Z');
    const end = moment('2019-04-03T13:34:50Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(18000);
  });

  it('handles dates without weekends', () => {
    const beginning = moment('2019-04-03T08:34:50Z');
    const end = moment('2019-04-04T13:34:50Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(104400);
  });

  it('handles whole weekends', () => {
    const beginning = moment.utc('2019-04-06T00:00:00Z');
    const end = moment.utc('2019-04-08T00:00:00Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(0);
  });

  it('handles partial weekends', () => {
    const beginning = moment.utc('2019-04-06T08:00:00Z');
    const end = moment.utc('2019-04-07T08:00:00Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(0);
  });

  it('does not exclude weekends from the calculation if the provided range does not contain any weekend days', () => {
    const beginning = moment('2019-04-03T08:34:50Z');
    const end = moment('2019-04-05T13:34:51Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(190801);
  });

  it('excludes weekends if the interval contains one or more whole weekends', () => {
    const beginning = moment('2019-04-03T08:34:50Z');
    const end = moment('2019-04-18T13:34:51Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    // Without exclusion: 1314001 seconds
    // Excluded: two weekends, 96 hours, 172800 seconds
    expect(duration).toEqual(1314001 - 2 * 48 * 60 * 60);
  });

  it('excludes weekends if the interval contains one or more whole weekends and a partial weekend', () => {
    const beginning = moment('2019-04-03T08:34:50Z');
    const end = moment('2019-04-21T13:34:51Z');

    const duration = durationInSecondsExcludingWeekends(beginning, end);

    expect(duration).toEqual(
      1573201 - 2 * 48 * 60 * 60 - 24 * 60 * 60 - (13 * 60 * 60 + 34 * 60 + 51)
    );
  });

  it('accounts for business hours (09:00 - 17:00) only', () => {
    const usesCases = [
      {
        // Same day
        start: moment.utc('2019-04-01T01:00:00Z'),
        end: moment.utc('2019-04-01T23:00:00Z'),
        duration: 8 * 60 * 60,
      },
      {
        // Spans over multiple days
        start: moment.utc('2019-04-01T01:00:00Z'),
        end: moment.utc('2019-04-02T23:00:00Z'),
        duration: 16 * 60 * 60,
      },
      {
        // Spans over multiple weeks
        start: moment.utc('2019-04-01T01:00:00Z'),
        end: moment.utc('2019-04-30T23:00:00Z'),
        duration: 22 * 8 * 60 * 60,
      },
    ];

    usesCases.forEach(usesCase => {
      expect(
        durationInSecondsExcludingWeekends(usesCase.start, usesCase.end, true)
      ).toEqual(usesCase.duration);
    });
  });
});
