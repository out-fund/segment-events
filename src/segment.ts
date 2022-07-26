declare global {
  interface Window {
    analytics?: any
  }
}

export interface SegmentOptions {
  methods?: string[]
  useDefault?: boolean
}

export default function (segmentKey: string, options: SegmentOptions) {
  const { methods = [], useDefault = true } = options
  const analytics = (window as Window).analytics || []
  const defaultMethods = useDefault
    ? [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
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
        'user',
      ]
    : []
  window.analytics = analytics
  if (!analytics.initialize)
    if (analytics.invoked) window.console && console.error && console.error('Segment snippet included twice.')
    else {
      analytics.invoked = !0
      analytics.methods = [...defaultMethods, ...methods]
      analytics.factory = function (t: any) {
        return function (...args: any[]) {
          const e = Array.prototype.slice.call(args)
          e.unshift(t)
          analytics.push(e)
          return analytics
        }
      }
      for (let t = 0; t < analytics.methods.length; t++) {
        const e = analytics.methods[t]
        analytics[e] = analytics.factory(e)
      }

      analytics.load = function (t: string, e: any) {
        const n = document.createElement('script')
        n.type = 'text/javascript'
        n.async = !0
        n.src = 'https://cdn.segment.com/analytics.js/v1/' + t + '/analytics.min.js'
        const a = document.getElementsByTagName('script')[0]
        if (a && a.parentNode) {
          a.parentNode.insertBefore(n, a)
        }
        analytics._loadOptions = e
      }
      analytics._writeKey = segmentKey
      analytics.SNIPPET_VERSION = '4.15.3'
      !methods.includes('addSourceMiddleware') && analytics.load(segmentKey)
    }
}
