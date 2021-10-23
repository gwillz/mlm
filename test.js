
import { run } from './assert.js';
import { getDayRange, nextDay, timeAgo } from './lib.js';

run('#output', test => {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    function UTC(year, month, day) {
        return new Date(Date.UTC(year, month - 1, day));
    }

    test('nextDay()', assert => {
        let actual, expected;

        // June - from Tuesday, looking for the next Thursday.
        actual = nextDay(5, UTC(2021, 6, 8));
        expected = UTC(2021, 6, 10);
        assert.equals(expected, actual);

        // October - Saturday, looking for the next Monday.
        actual = nextDay(2, UTC(2021, 10, 23));
        expected = UTC(2021, 10, 25);
        assert.equals(expected, actual);

        // December - Wednesday, looking for the next Tuesday.
        actual = nextDay(3, UTC(2021, 12, 1));
        expected = UTC(2021, 12, 7);
        assert.equals(expected, actual);
    });

    test('timeAgo()', assert => {
        let actual, expected;

        // seconds.
        actual = timeAgo(new Date(Date.now() + SECOND), new Date());
        expected = '1 second';
        assert.equals(expected, actual);

        // minutes.
        actual = timeAgo(new Date(Date.now() + MINUTE + 35 * SECOND), new Date());
        expected = '1 minute, 35 seconds';
        assert.equals(expected, actual);

        // hours.
        actual = timeAgo(new Date(Date.now() + 4 * HOUR + SECOND), new Date());
        expected = '4 hours, 1 second';
        assert.equals(expected, actual);

        // days.
        actual = timeAgo(new Date(Date.now() + 2 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND), new Date());
        expected = '2 days, 3 hours, 4 minutes, 5 seconds';
        assert.equals(expected, actual);
    });

    test('getDayRange()', assert => {
        let actual, expected;

        actual = getDayRange(new Date());
        expected = {
            start: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            end: new Date(new Date().setUTCHours(23, 59, 59, 0)),
        };

        assert(actual.start instanceof Date, 'range.start is a date');
        assert.equals(expected.start, actual.start);

        assert(actual.end instanceof Date, 'range.end is a date');
        assert.equals(expected.end, actual.end);
    });
});
