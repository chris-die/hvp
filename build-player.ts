import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

interface Script {
  tag: string
  src: string
}

function createPlayerHtml(): string {
  const outputFileName = resolve('./dist') + '/player.html'
  const html: string = readFileSync(resolve('./dist/index.html'), 'utf8')

  const re = new RegExp('<script.*?src="(.*?)".*?<\/script>', 'gi')
  const scripts: Script[] = Array.from(html.matchAll(re), (v: any[]) => ({ tag: v[0], src: v[1] }))

  writeFileSync(
    outputFileName,
    replaceScriptTags(html, scripts, resolve('./dist'))
  )

  return outputFileName
}

function replaceScriptTags(html: string, scripts: Script[], scriptDir: string): string {
  for (let i = 0; i < scripts.length; i++) {
    try {
      const js = readFileSync(scriptDir + '/' + scripts[i].src, 'utf8')
      html = html.replace(scripts[i].tag, '<script>' + js + '</script>')
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

console.log('Player HTML file created at ' + createPlayerHtml())
