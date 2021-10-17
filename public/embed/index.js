const playerProductionDomain = 'https://player.serato.com/'

let playerHtmlDoc = '/index.html'
// let playerHtmlDoc = '/dist/player.html'
let playerURL = ''

// Text boxes that define the embed dimensions
Array.from(document.getElementsByClassName('embed-size')).forEach(ele => {
  ele.addEventListener('keyup', setEmbedSize)
  ele.addEventListener('change', setEmbedSize)
})
// Radio buttons that specify the video source
document.getElementsByName('vid-src').forEach(ele => ele.addEventListener('click', setPlayerUrl))
// Text boxes that provide video source
Array.from(document.getElementsByClassName('vid-src-text')).forEach(ele => {
  ele.addEventListener('keyup', setPlayerUrl)
  ele.addEventListener('change', setPlayerUrl)
})

function setEmbedSize() {
  const iframes = document.getElementsByTagName('iframe')
  iframes[0].width = document.getElementById('embed-width').value
  iframes[0].height = document.getElementById('embed-height').value
}

function setPlayerUrl() {
  const params = getVidParams()
  if (params.length > 0) {
    console.log([playerURL, playerHtmlDoc + '?' + params.join('&')])
    if (playerURL !== playerHtmlDoc + '?' + params.join('&')) {
      playerURL = playerHtmlDoc + '?' + params.join('&')
      const iframes = document.getElementsByTagName('iframe')
      iframes[0].src = playerURL
    }
  }
}

function getVidParams() {
  const radios = document.getElementsByName('vid-src')
  const params = []
  Array.from(document.getElementsByClassName('vid-src-text')).forEach(ele => {
    ele.disabled = true
  })
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      if (radios[i].id === 'vid-src-serato-id') {
        document.getElementById('vid-src-serato-id-val').disabled = false
        const vidoeId = document.getElementById('vid-src-serato-id-val').value
        if (vidoeId && vidoeId !== '') {
          params.push('id=' + encodeURIComponent(vidoeId))
        }
      } else if (radios[i].id === 'vid-src-url') {
        document.getElementById('vid-src-url-val').disabled = false
        const url = document.getElementById('vid-src-url-val').value
        if (url && url !== '') {
          params.push('src=' + encodeURIComponent(url))
        }
      } else if (radios[i].dataset.src) {
        params.push('src=' + encodeURIComponent(radios[i].dataset.src))
      }
    }
  }
  return params
}