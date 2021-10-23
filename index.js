import isWithinInterval from 'https://unpkg.com/date-fns/esm/isWithinInterval?module';
import { getDayRange, nextDay, timeAgo } from './lib.js';

(function(cb) {
   window.addEventListener('load', cb);
})(function() {

    const one = document.querySelector.bind(document);

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
