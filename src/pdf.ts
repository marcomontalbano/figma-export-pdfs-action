import { Api, Node, NodeTypes } from 'figma-api'
import { getGroups } from './figma'

export type Pdf = {
  id: string
  name: string
  pages: string[]
}

export const getPdfs = async ({ accessToken, fileKey, pageNames = [] }: { accessToken: string, fileKey: string, pageNames: string[] }): Promise<Pdf[]> => {

  const api = new Api({
    personalAccessToken: accessToken
  })

  const { document: { children: pages } } = await api.getFile(fileKey)

  const selectedPages = (page: Node<keyof NodeTypes>) => {
    return pageNames.length > 0 ? pageNames.includes(page.name) : true
  }

  const filteredPages = pages.filter(selectedPages)

  const groups = getGroups(filteredPages)

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
