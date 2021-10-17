// Have to use commonJS imports because this script is run by npm and *reasons*
// const path = require('path')
// const fs = require('fs')

import * as path from 'path'
import * as fs from 'fs'

interface Script {
  tag: string
  src: string
}

function createPlayerHtml() {
  let html: string = fs.readFileSync(path.resolve('./dist/index.html'), 'utf8')

  const re = new RegExp('<script.*?src="(.*?)".*?<\/script>', 'gi')
  const scripts: Script[] = Array.from(html.matchAll(re), (v: any[]) => ({ tag: v[0], src: v[1] }))

  html = replaceScriptTags(html, scripts, path.resolve('./dist'))
  
  // TODO: write file
  console.log(html)
}

function replaceScriptTags(html: string, scripts: Script[], scriptDir: string): string {
  for (let i = 0; i < scripts.length; i++) {
    try {
      const js = fs.readFileSync(scriptDir + '/' + scripts[i].src, 'utf8')
      // TODO: add nonce
      html = html.replace(scripts[i].tag, '<script>' + js + '</script>')  
    } catch (e) {
      // Ignore ENOENT (file doesn't exist)
      if (e.code !== 'ENOENT') {
        throw e
      }
    }
  }

  return html
}

createPlayerHtml()
