import videojs, { VideoJsPlayer } from 'video.js'
import '!style-loader!css-loader!video.js/dist/video-js.css'
import './style.css'

const player: VideoJsPlayer = videojs('player')
