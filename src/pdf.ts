import { Api, Node, NodeTypes } from 'figma-api'
import { getGroups } from './figma'

export type Pdf = {
  id: string
  name: string
  pages: string[],
  cover: string
}

type Props = {
  accessToken: string
  fileKey: string
  ids: string[]
}

const pagesAreOk = (pages: (string | null)[]): pages is string[] => {
  return pages.find(page => typeof page !== 'string') === undefined
}

export const getPdfs = async ({ accessToken, fileKey, ids = [] }: Props): Promise<Pdf[]> => {

  const api = new Api({
    personalAccessToken: accessToken
  })

  const { document: { children: pages } } = await api.getFile(fileKey, { ids })

  const groups = getGroups(pages)

  return await Promise.all(
    groups.map(
      async group => {
        const frameIds = group.children.map(frame => frame.id)

        const pdfResponse = await api.getImage(fileKey, {
          ids: frameIds.join(','),
          format: 'pdf',
          scale: 1
        })

        if (pdfResponse.err) {
          throw new Error(pdfResponse.err)
        }

        const pages = Object.values(pdfResponse.images)

        if (!pagesAreOk(pages)) {
          throw new Error('Found empty pages!')
        }

        const coverResponse = await api.getImage(fileKey, {
          ids: frameIds[0],
          format: 'jpg',
          scale: 1
        })

        if (coverResponse.err) {
          throw new Error(coverResponse.err)
        }

        const [ cover ] = Object.values(coverResponse.images)

        if (!cover) {
          throw new Error('Cannot create cover!')
        }

        return {
          id: group.id,
          name: group.name,
          pages,
          cover
        }
      }
    )
  )
}
