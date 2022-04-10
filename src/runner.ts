import * as core from '@actions/core'
import { mkdirSync } from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import PDFMerger from 'pdf-merger-js'

import { getPdfs, Pdf } from './pdf'

type Options = {
  accessToken: string
  fileKey: string
  ids: string[]
  outDir: string
}

type Result = {
  id: string
  name: string
  basename: string
  filepath: string
}

export async function run({ accessToken, fileKey, ids, outDir }: Options): Promise<Result[]> {

  const pdfs = await getPdfs({
    accessToken,
    fileKey,
    ids,
  })

  const result: Result[] = []

  for (const pdf of pdfs) {
    const pdfMerger = new PDFMerger();

    const pages = await Promise.all(
      pdf.pages.map(
        async page => Buffer.from(await fetch(page).then(r => r.arrayBuffer()))
      )
    )

    pages.forEach(page => pdfMerger.add(page))

    const filename = `${pdf.name}.pdf`
    const filepath = path.resolve(outDir, filename)
    const dirname = path.dirname(pdf.name)
    const basename = path.basename(filename)

    mkdirSync(path.dirname(filepath), { recursive: true })

    core.info(basename)

    await pdfMerger.save(path.resolve(outDir, filename))

    result.push({
      id: pdf.id,
      name: path.basename(pdf.name),
      basename,
      filepath: `./${ path.relative('.', filepath) }`
    })
  }

  return result
}
