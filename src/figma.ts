import type { Node } from '@figma/rest-api-spec'

const keepOnlyChildren = (node: Node, type: Node['type']) => ({
  ...node,
  children: 'children' in node ? node.children
    .filter(child => child.type === type)
    .reverse() : []
})

export function getGroups(canvases: Node[] = []) {
  return canvases
    .map(node => keepOnlyChildren(node, 'GROUP'))
    .map(canvas => canvas.children).flat()
    .map(node => keepOnlyChildren(node, 'FRAME'))
    .filter(node => node.children.length > 0)
}
