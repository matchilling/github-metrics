import * as moment from "moment";

export function durationInSecondsExcludingWeekends(beginning: moment.Moment, end: moment.Moment): number {
    if (beginning.format("YYYY-MM-DD") == end.format("YYYY-MM-DD")) {
        if (beginning.isoWeekday() == 6 || beginning.isoWeekday() == 7) {
            return 0;
        }
        return moment.duration(moment(end).diff(moment(beginning))).asSeconds();
    }

    const dayBeforeEnd = moment(end).subtract(1, 'days');

    let duration = 0;
    // This is slow and needs to be refactored to some clever calculation. Deemed good enough for the time being.
    for (const actualDay = moment(beginning).add(1, 'days'); actualDay.isBefore(dayBeforeEnd); actualDay.add(1, 'days')) {
        if (actualDay.isoWeekday() != 6 && actualDay.isoWeekday() != 7) {
            duration += 24 * 60 * 60;
        }
    }

    if (beginning.isoWeekday() != 6 && beginning.isoWeekday() != 7) {
        let endOfFirstDay = moment.utc(beginning).endOf('day');
        duration += Math.round(moment.duration(endOfFirstDay.diff(moment(beginning))).asSeconds());
    }

    if (end.isoWeekday() != 6 && end.isoWeekday() != 7) {
        let beginningOfLastDay = moment.utc(end).startOf('day');
        duration += Math.round(moment.duration(moment(end).diff(beginningOfLastDay)).asSeconds())
    }

    return duration;
}