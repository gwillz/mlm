import addDays from 'https://unpkg.com/date-fns/esm/addDays?module';
import getISODay from 'https://unpkg.com/date-fns/esm/getISODay?module';
import isWithinInterval from 'https://unpkg.com/date-fns/esm/isWithinInterval?module';
import differenceInDays from 'https://unpkg.com/date-fns/esm/differenceInDays?module';
import differenceInHours from 'https://unpkg.com/date-fns/esm/differenceInHours?module';

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
        return addDays(from, offsetDays);
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
        from = addDays(from, days);
        const hours = differenceInHours(target, from);
        return `${days} days, ${hours} hours`;
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

    // Reference date.
    const now = new Date();
    const monday = getDayRange(nextDay(2, now));
    const isActive = isWithinInterval(now, monday);

    // Show active text.
    const $active = one('.js--active');
    $active.innerText = isActive ? 'active' : 'not active';

    // Hide the countdown.
    if (isActive) {
        const $wrap = one('.js--wrap-countdown');
        $wrap.remove();
    }
    // Show the countdown.
    else {
        const $countdown = one('.js--countdown');
        $countdown.innerText = timeAgo(monday.start, now);
    }
});
