const playerProductionDomain = 'https://player.serato.com/'

let playerURL = ''
const iframe = document.getElementsByTagName('iframe')[0]

// Text boxes that define the embed dimensions
Array.from(document.getElementsByClassName('embed-size')).forEach(ele => {
  ele.addEventListener('keyup', setEmbedSize)
  ele.addEventListener('change', setEmbedSize)
  ele.addEventListener('focus', setFrameborder)
  ele.addEventListener('blur', setFrameborder)
})

// Radio buttons that specify the video source
document.getElementsByName('vid-src').forEach(ele => ele.addEventListener('click', setPlayerUrl))

// Text boxes that provide video source
Array.from(document.getElementsByClassName('vid-src-text')).forEach(ele => {
  ele.addEventListener('keyup', setPlayerUrl)
  ele.addEventListener('change', setPlayerUrl)
})

// Radio buttons that specify the HTML document
document.getElementsByName('html-src').forEach(ele => ele.addEventListener('click', setPlayerUrl))

function setEmbedSize() {
  document.getElementById('iframe-container').style.width = document.getElementById('embed-width').value + 'px'
  document.getElementById('iframe-container').style.height = document.getElementById('embed-height').value + 'px'
  iframe.width = document.getElementById('embed-width').value
  iframe.height = document.getElementById('embed-height').value
  setEmbedHtmlSnippet()
  setFrameborder()
}

function setPlayerUrl() {
  const params = getPlayerUrlParams()
  if (params.length > 0) {
    const playerHtmlDoc = getPlayerHtmlDoc()
    if (playerURL !== playerHtmlDoc + '?' + params.join('&')) {
      playerURL = playerHtmlDoc + '?' + params.join('&')
      iframe.src = playerURL
      document.getElementById('embed-url').innerHTML = playerURL
      setEmbedHtmlSnippet()
    }
  }
  setFrameborder()
}

function setEmbedHtmlSnippet() {
  if (playerURL !== '') {
    document.getElementById('embed-html').innerHTML = htmlencode(iframe.outerHTML)
  }
}

function setFrameborder() {
  let show = playerURL === '' ||
              document.activeElement.id === 'embed-width' ||
              document.activeElement.id === 'embed-height'
  document.getElementById('iframe-container').style.borderColor = show ? 'rgb(245, 118, 196)' : '#000'
}

function getPlayerUrlParams() {
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

function getPlayerHtmlDoc() {
  const radios = document.getElementsByName('html-src')
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].dataset.src
    }
  }
}

function htmlencode(html) {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(html))
  return div.innerHTML
}