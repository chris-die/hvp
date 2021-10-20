import videojs, { VideoJsPlayer as VideoJsPlayerBase } from 'video.js'
// import '!style-loader!css-loader!video.js/dist/video-js.css'
import 'video.js/dist/video-js.css'
import './style.css'

// Adds missing TS definitions from `@types/video.js`.
// Hopefully we can remove this at some stage when `@types/video.js` is updated.
// Keep watching npm page for new versions (currently on 7.3.27):
// https://www.npmjs.com/package/@types/video.js
interface VideoJsPlayer extends VideoJsPlayerBase {
  /**
   * Disable Picture-in-Picture mode.
   *
   * @param {boolean} value
   *                  - true will disable Picture-in-Picture mode
   *                  - false will enable Picture-in-Picture mode
   */
  disablePictureInPicture(value: boolean): void;
}

interface UrlOptions {
  /** Show controls. Defaults to `true`. */
  controls: boolean;
  /** Autoplay. Defaults to `true`. */
  autoplay: boolean;
  /** Play muted. Defaults to `false`. */
  muted: boolean;
  /** Loop playback of video. Defaults to `false`. */
  loop: boolean;
  /** Allow Picture-in-Picture. Defaults to `true`. */
  pictureInPicture: boolean;
  /** Display the big play button overlay. Defaults to `true`. */
  bigPlayButton: boolean;
  /** Display the loading spinner. Defaults to `true`. */
  loadingSpinner: boolean;
}

const queryStringParams = new URLSearchParams(location.search)

// Get player options that can be set via URL
const urlOptions = ((qs: URLSearchParams): UrlOptions => {
  return {
    controls: qs.get('controls') === null || qs.get('controls') !== '0',
    autoplay: qs.get('autoplay') === null || qs.get('autoplay') !== '0',
    muted: qs.get('muted') === '1',
    loop: qs.get('muted') === '1',
    pictureInPicture: qs.get('pip') === null || qs.get('pip') !== '0',
    bigPlayButton: qs.get('bb') === null || qs.get('bb') !== '0',
    loadingSpinner: qs.get('loading') === null || qs.get('loading') !== '0'
  }
})(queryStringParams)

// Get the source stream
const source = ((qs: URLSearchParams): videojs.Tech.SourceObject => {
  // TODO: build up URL using `id` param.
  return {
    src: qs.get('src'),
    type: 'application/x-mpegURL'
  }
})(queryStringParams)

const player: VideoJsPlayer = <VideoJsPlayer>videojs(
  'player', {
    // https://docs.videojs.com/tutorial-options.html
    controls: urlOptions.controls,
    autoplay: urlOptions.autoplay,
    muted: urlOptions.muted,
    loop: urlOptions.loop,
    controlBar: {
      pictureInPictureToggle: urlOptions.pictureInPicture
    },
    bigPlayButton: urlOptions.bigPlayButton,
    preload: 'auto',
    // Layout options explained here: https://docs.videojs.com/tutorial-layout.html
    fill: true,
    responsive: true
  }
)

// In theory this is configurable when you create player. But the documentation doesn't explain how.
// So this is a bit of a hack.
if (!urlOptions.loadingSpinner) {
  const elem = document.getElementsByClassName('vjs-loading-spinner') as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < elem.length; i++) {
    elem[i].style.display = 'none'
  }
}

// Disable the Picture-in-Picture option on the <video> element.
// This will remove the `Watch in Picture-in-Picture` option in the context menu.
// This seems to only work in Chrome. Firefox and Safari ignore it.
// This means that Firefox will always show that annoying little overlay icon on
// the right side of the video :-(
// FYI, the `controlBar.pictureInPictureToggle` option (set above) removes the PIP UI
// element from player control bar.
player.disablePictureInPicture(!urlOptions.pictureInPicture)

player.src(source)

// App
// - `id` arg
//    - Derive URL to streaming manifest
//    - What about content type of manifest? Hard code as `application/x-mpegURL`?
//      - Maybe `id` value could indicate this. eg `01-abc123` = HLS, `02-abc123` = DASH.
// - Poster image
//    - Only for Serato vids
//    - Derive URL from `id` arg
//    - Use as `poster` in video config
//    - Add as HTML element into web page for loading state and as fallback for unsupported browsers

// HLS test streams
// https://github.com/bengarney/list-of-streams

// Analytics
// - Only for Serato vids
// - Use window.top to get location of embed
// - Useful videojs events
//  - `timeupdate` event (can't find in docs)
// - Do we need a mechanism to allow a parent window to provide a user identifier, or JWT?

// Review Cloudfront URL structure
//  - Can we do something fancy with Cloudfront.?
//  - eg Turn '/index.html?id=abc123&controls=0' into '/123?controls=0' or maybe '/player/123?controls=0'
//  - Needs to work for non-latest versions too. eg '/1.2.3/123?controls=0' or maybe '/1.2.3/player/123?controls=0'

// CSP
/**
 * ** Allow **
 *
 * default-src 'self';
 * script-src 'self';
 * style-src 'self';
 * img-src 'self';
 * connect-src ??? would need for analytics ???;
 * font-src ??? TBD ???;
 * media-src streaming.serato.com;
 * child-src 'self';
 *
 * ** Prevent **
 *
 * object-src 'none';
 * frame-src 'none';
 * form-action 'none';
 */

// - Serve CSP header from WDS
//    - Only for HTML file
//    - Make funcionality reusable by Lambda@Edge function for CDN ??

// --------------------------------
// Polyfill or alternatives needed:
// --------------------------------
// - URLSearchParams
//    https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//
// - Array.forEach
//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
//    Probably OK. Supported in IE9.
