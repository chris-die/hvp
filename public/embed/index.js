const playerProductionDomain = 'https://player.serato.com'

let playerURL = ''
const iframe = document.getElementsByTagName('iframe')[0]

// Radio buttons that specify the video source
document.getElementsByName('vid-src').forEach(ele => ele.addEventListener('click', setPlayerUrl))

// Text boxes that provide video source
Array.from(document.getElementsByClassName('vid-src-text')).forEach(ele => {
  ele.addEventListener('keyup', setPlayerUrl)
  ele.addEventListener('change', setPlayerUrl)
})

// Text boxes that define the embed dimensions
Array.from(document.getElementsByClassName('embed-size')).forEach(ele => {
  ele.addEventListener('keyup', setEmbedSize)
  ele.addEventListener('change', setEmbedSize)
  ele.addEventListener('focus', setFrameborder)
  ele.addEventListener('blur', setFrameborder)
})

// Checkboxes that set options for the embedded player
Array.from(document.getElementsByClassName('embed-options')).forEach(ele => {
  ele.addEventListener('click', setPlayerUrl)
})

// Radio buttons that specify the HTML document to use.
// ie. One that is served from WDS or one that is served from the `dist` directory.
document.getElementsByName('html-src').forEach(ele => ele.addEventListener('click', setPlayerUrl))

// UI elements that allow selecting "preset" options
const eles = [...document.querySelectorAll('.param-presets span')]
eles.forEach(ele => {
  ele.addEventListener('click', () => {
    const checked = JSON.parse(ele.dataset.optionsChecked)
    Array.from(document.getElementsByClassName('embed-options')).forEach(ele => {
      ele.checked = checked.includes(ele.name)
    })
    setPlayerUrl()
  })
})

// UI elements that can copy their innerHTML property to the clipboard
Array.from(document.getElementsByClassName('copy-to-clipboard')).forEach(ele => {
  ele.addEventListener('click', () => {
    navigator.clipboard.writeText(ele.textContent.replace(/src="(.*?)"/, 'src="' + document.getElementById('embed-url').textContent + '"'))
  })
})

function setEmbedSize () {
  document.getElementById('iframe-container').style.width = document.getElementById('embed-width').value + 'px'
  document.getElementById('iframe-container').style.height = document.getElementById('embed-height').value + 'px'
  iframe.width = document.getElementById('embed-width').value
  iframe.height = document.getElementById('embed-height').value
  setEmbedHtmlSnippet()
  setFrameborder()
}

function getEmbedPlayerOptions () {
  const params = []
  Array.from(document.getElementsByClassName('embed-options')).forEach(ele => {
    if (ele.checked === !!parseInt(ele.dataset.checked)) {
      params.push(ele.dataset.urlParam)
    }
  })
  return params
}

function setPlayerUrl () {
  const params = getPlayerSourceUrlParams()
  if (params.length > 0) {
    const url = getPlayerHtmlDoc() + '?' + params.concat(getEmbedPlayerOptions()).join('&')
    if (playerURL !== url) {
      playerURL = url
      iframe.src = playerURL
      document.getElementById('embed-url').innerHTML = playerProductionDomain + playerURL
      setEmbedHtmlSnippet()
    }
  }
  setFrameborder()
}

function setEmbedHtmlSnippet () {
  if (playerURL !== '') {
    const ele = document.getElementById('embed-html')
    ele.innerHTML = htmlencode(iframe.outerHTML.replace(' src="/', ' src="' + playerProductionDomain + '/'))
    ele.style.display = 'inline'
  }
}

function setFrameborder () {
  const show = playerURL === '' ||
              document.activeElement.id === 'embed-width' ||
              document.activeElement.id === 'embed-height'
  document.getElementById('iframe-container').style.borderColor = show ? 'rgb(245, 118, 196)' : '#000'
}

function getPlayerSourceUrlParams () {
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

function getPlayerHtmlDoc () {
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