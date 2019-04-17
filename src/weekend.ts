import * as moment from 'moment';

export function durationInSecondsExcludingWeekends(
  beginning: moment.Moment,
  end: moment.Moment,
  countBusinessHoursOnly?: boolean
): number {
  const dayStart = moment(beginning);
  dayStart.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });

  const dayEnd = moment(end);
  dayEnd.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

  const isSameDay = beginning.format('YYYY-MM-DD') == end.format('YYYY-MM-DD');
  if (isSameDay) {
    if (beginning.isoWeekday() == 6 || beginning.isoWeekday() == 7) {
      return 0;
    }

    if (countBusinessHoursOnly) {
      if (0 < dayStart.diff(beginning)) {
        beginning.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
      }

      if (0 < end.diff(dayEnd)) {
        end.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });
      }
    }

    return moment.duration(moment(end).diff(moment(beginning))).asSeconds();
  }

  const dayBeforeEnd = moment(end).subtract(1, 'days');

  let duration = 0;
  // This is slow and needs to be refactored to some clever calculation.
  // Deemed good enough for the time being.
  for (
    const actualDay = moment(beginning).add(1, 'days');
    actualDay.isBefore(dayBeforeEnd);
    actualDay.add(1, 'days')
  ) {
    if (actualDay.isoWeekday() != 6 && actualDay.isoWeekday() != 7) {
      if (countBusinessHoursOnly) {
        duration += 8 * 60 * 60;
      } else {
        duration += 24 * 60 * 60;
      }
    }
  }

  if (beginning.isoWeekday() != 6 && beginning.isoWeekday() != 7) {
    const endOfFirstDay = countBusinessHoursOnly
      ? dayStart.set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
      : moment.utc(beginning).endOf('day');

    duration += Math.round(
      moment.duration(endOfFirstDay.diff(moment(beginning))).asSeconds()
    );
  }

  if (
    !countBusinessHoursOnly &&
    end.isoWeekday() != 6 &&
    end.isoWeekday() != 7
  ) {
    const beginningOfLastDay = moment.utc(end).startOf('day');
    duration += Math.round(
      moment.duration(moment(end).diff(beginningOfLastDay)).asSeconds()
    );
  }

  return duration;
}
