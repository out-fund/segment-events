"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(segmentKey) {
    const analytics = window.analytics || [];
    window.analytics = analytics;
    if (!analytics.initialize)
        if (analytics.invoked)
            window.console && console.error && console.error('Segment snippet included twice.');
        else {
            analytics.invoked = !0;
            analytics.methods = [
                // "trackSubmit",
                // "trackClick",
                // "trackLink",
                // "trackForm",
                // "pageview",
                'identify',
                'reset',
                'group',
                'track',
                'ready',
                'alias',
                'debug',
                'page',
                'once',
                'off',
                'on',
                // 'addSourceMiddleware', <-- uncomment this line to enable semgment.com source middleware for the cookie managment tool. Then comment out the analytics.load line at the bottom.
            ];
            analytics.factory = function (t) {
                return function (...args) {
                    const e = Array.prototype.slice.call(args);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics;
                };
            };
            for (let t = 0; t < analytics.methods.length; t++) {
                const e = analytics.methods[t];
                analytics[e] = analytics.factory(e);
            }
            analytics.load = function (t, e) {
                const n = document.createElement('script');
                n.type = 'text/javascript';
                n.async = !0;
                n.src = 'https://cdn.segment.com/analytics.js/v1/' + t + '/analytics.min.js';
                const a = document.getElementsByTagName('script')[0];
                if (a && a.parentNode) {
                    a.parentNode.insertBefore(n, a);
                }
                analytics._loadOptions = e;
            };
            analytics._writeKey = segmentKey;
            analytics.SNIPPET_VERSION = '4.15.3';
            analytics.load(segmentKey); // comment out this line if you want to use the semgment.com source middleware for the cookie managment tool.
        }
}
exports.default = default_1;