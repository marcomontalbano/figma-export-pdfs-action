import * as core from '@actions/core'
import { mkdirSync } from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import PDFMerger from 'pdf-merger-js'

import { getPdfs, Pdf } from './pdf'

type Options = {
  accessToken: string
  fileKey: string
  pageNames: string[]
  outDir: string
}

export async function run({ accessToken, fileKey, pageNames, outDir }: Options): Promise<Pdf[]> {

  const pdfs = await getPdfs({
    accessToken,
    fileKey,
    pageNames
  })

  for (const pdf of pdfs) {
    const pdfMerger = new PDFMerger();

    const pages = await Promise.all(
      pdf.pages.map(
        async page => Buffer.from(await fetch(page).then(r => r.arrayBuffer()))
      )
    )

    pages.forEach(page => pdfMerger.add(page))

    mkdirSync(outDir, { recursive: true })

    const filename = `${pdf.name}.pdf`
    core.info(filename)
    await pdfMerger.save(path.resolve(outDir, filename))
  }

  return pdfs
}
