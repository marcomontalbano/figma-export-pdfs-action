import * as core from '@actions/core'
import { mkdirSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import path, { sep } from 'path'
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
  cover: string
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

    const cover = Buffer.from(await fetch(pdf.cover).then(r => r.arrayBuffer()))

    pages.forEach(page => pdfMerger.add(page))


    const coverFilename = `${pdf.name}.jpg`
    const pdfFilename = `${pdf.name}.pdf`
    const pdfFilepath = path.resolve(outDir, pdfFilename)
    const pdfBasename = path.basename(pdfFilename)

    mkdirSync(path.dirname(pdfFilepath), { recursive: true })

    core.info(pdfBasename)

    await pdfMerger.save(path.resolve(outDir, pdfFilename))
    writeFileSync(path.resolve(outDir, coverFilename), cover)

    result.push({
      id: pdf.id,
      name: path.basename(pdf.name),
      basename: pdfBasename,
      filepath: `.${sep}${path.join(path.basename(outDir), pdfFilename)}`,
      cover: `.${sep}${path.join(path.basename(outDir), coverFilename)}`,
    })
  }

  return result
}
