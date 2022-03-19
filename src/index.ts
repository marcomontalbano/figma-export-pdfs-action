import * as core from '@actions/core'
import path from 'path'

import { run } from './runner'

const distFolder = 'dist'
const [_bin, _sourcePath, outDir = path.resolve(__dirname, '..', distFolder)] = process.argv

const jsonParse = <T>(text: string): T | false => {
  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) {
      return false
    }

    throw error
  }
}

const accessToken = core.getInput('accessToken', { required: true })
const fileKey = core.getInput('fileKey', { required: true })
const pageNames = jsonParse<string[]>(core.getInput('pageNames', { required: false }) || '[]')

;(async function() {

  if (pageNames === false) {
    core.setFailed('"pageNames" must be a stringified array of strings.')
    return;
  }

  core.startGroup('Export pdfs')
  const pdfs = await run({ accessToken, fileKey, pageNames, outDir })
  core.endGroup()

  core.setOutput('pdfs', pdfs);
  core.setOutput('outDir', `./${distFolder}/`)
})()
