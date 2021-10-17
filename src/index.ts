import videojs, { VideoJsPlayer } from 'video.js'
import '!style-loader!css-loader!video.js/dist/video-js.css'
import './style.css'

const player: VideoJsPlayer = videojs(
  'player', {
    // https://docs.videojs.com/tutorial-options.html
    controls: true,
    autoplay: true,
    preload: 'auto',
    // Layout options explained here:
    // https://docs.videojs.com/tutorial-layout.html
    fill: true,
    responsive: true,
  }
)

player.src({
  src: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8',
  // src: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  // src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  type: 'application/x-mpegURL',
})

player.ready(() => {
  console.log('ready')
})

// WDS
// - Why font data URI in output?

// Serato videos
//  - id URL arg
//  - Poster image

// src URL arg (useful for testing)

// Events for analytics (only for Serato vids)
//  - `timeupdate` event (can't find in docs)

// Build process for `player.html`

// `embed.html` test page
//  - serve from WDS
//  - Uses `player.html` in an IFRAME
//  - UI and Javascript
//      - Set size of IFRAME.
//      - Set Serato video ID, or
//      - Set src URL, or
//      - Choose from hardcoded test src URLs.
