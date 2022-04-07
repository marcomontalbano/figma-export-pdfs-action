import { Api, Node, NodeTypes } from 'figma-api'
import { getGroups } from './figma'

export type Pdf = {
  id: string
  name: string
  pages: string[]
}

type Props = {
  accessToken: string
  fileKey: string
  ids: string[]
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
        const pages = await Promise.all(
          group.children.map(
            async frame => {
              const image = await api.getImage(fileKey, {
                ids: frame.id,
                format: 'pdf',
                scale: 1
              })

              if (image.err) {
                // return null
                throw new Error(image.err)
              }

              const svgUrl = image.images[frame.id]

              if (!svgUrl) {
                throw new Error('"svgUrl" is empty!')
              }

              return svgUrl
            }
          )
        )

        return {
          id: group.id,
          name: group.name,
          pages
        }
      }
    )
  )
}
