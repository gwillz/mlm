import add from 'https://unpkg.com/date-fns/esm/add?module';
import getISODay from 'https://unpkg.com/date-fns/esm/getISODay?module';
import differenceInDays from 'https://unpkg.com/date-fns/esm/differenceInDays?module';
import differenceInHours from 'https://unpkg.com/date-fns/esm/differenceInHours?module';
import differenceInMinutes from 'https://unpkg.com/date-fns/esm/differenceInMinutes?module';
import differenceInSeconds from 'https://unpkg.com/date-fns/esm/differenceInSeconds?module';

/**
 * Find the next day of week.
 *
 * @param {number} dayOfWeek
 * @param {Date} from
 * @returns {Date}
 */
export function nextDay(dayOfWeek, from) {
    from = new Date(+from);
    from.setUTCHours(0, 0, 0, 0);
    const offsetDays = (6 - getISODay(from) + dayOfWeek) % 7;
    return add(from, { days: offsetDays });
}

/**
 * Get a human string of time until this date.
 *
 * @param {Date} target
 * @param {Date} from
 * @returns {string}
 */
export function timeAgo(target, from) {
    const days = differenceInDays(target, from);

    from = add(from, { days });
    const hours = differenceInHours(target, from);

    from = add(from, { hours });
    const minutes = differenceInMinutes(target, from);

    from = add(from, { minutes });
    const seconds = differenceInSeconds(target, from);

    let out = [];

    if (days > 0) {
        out.push(`${days} days`);
    }
    if (hours > 0) {
        out.push(`${hours} hours`);
    }
    if (minutes > 0) {
        out.push(`${minutes} minutes`);
    }

    out.push(`${seconds} seconds`);

    return out.join(', ');
}

/**
 * Get a start/end date range of a UTC single day.
 *
 * @param {Date} date
 * @returns {{start: Date, end: Date}}
 */
export function getDayRange(date) {
    const start = new Date(+date);
    const end = new Date(+date);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 0);

    return { start, end };
}
