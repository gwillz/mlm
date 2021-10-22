import add from 'https://unpkg.com/date-fns/esm/add?module';
import getISODay from 'https://unpkg.com/date-fns/esm/getISODay?module';
import isWithinInterval from 'https://unpkg.com/date-fns/esm/isWithinInterval?module';
import differenceInDays from 'https://unpkg.com/date-fns/esm/differenceInDays?module';
import differenceInHours from 'https://unpkg.com/date-fns/esm/differenceInHours?module';
import differenceInMinutes from 'https://unpkg.com/date-fns/esm/differenceInMinutes?module';
import differenceInSeconds from 'https://unpkg.com/date-fns/esm/differenceInSeconds?module';

(function(cb) {
   window.addEventListener('load', cb);
})(function() {

    const one = document.querySelector.bind(document);

    /**
     * Find the next day of week.
     *
     * @param {number} dayOfWeek
     * @param {Date} from
     * @returns {Date}
     */
    function nextDay(dayOfWeek, from) {
        const offsetDays = 7 - getISODay(from) + dayOfWeek;
        return add(from, { days: offsetDays });
    }

    /**
     * Get a human string of time until this date.
     *
     * @param {Date} target
     * @param {Date} from
     * @returns {string}
     */
    function timeAgo(target, from) {
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
     * Get a start/end date range of a single day.
     *
     * @param {Date} date
     * @returns {{start: Date, end: Date}}
     */
    function getDayRange(date) {
        const start = new Date(+date);
        const end = new Date(+date);

        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 0);

        return { start, end };
    }

    const $active = one('.js--active');
    const $countdown = one('.js--countdown');
    const $mode = one('.js--mode');

    function update() {
        const now = new Date();
        const monday = getDayRange(nextDay(2, now));
        const isActive = isWithinInterval(now, monday);

        // Show active text.
        $active.innerText = isActive ? 'active' : 'not active';

        if (isActive) {
            $countdown.innerText = timeAgo(monday.end, now);
            $mode.innerText = 'MLM will last for another';
        }
        else {
            $countdown.innerText = timeAgo(monday.start, now);
            $mode.innerText = 'MLM will begin in';
        }
    }

    update();
    setInterval(update, 1000);
});
