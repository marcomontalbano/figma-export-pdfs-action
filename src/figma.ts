import { Node, NodeType, NodeTypes } from 'figma-api'

const keepOnlyChildren = (node: Node<keyof NodeTypes>, type: NodeType) => ({
  ...node,
  children: 'children' in node ? node.children
    .filter(child => child.type === type)
    .reverse() : []
})

export function getGroups(canvases: Node<keyof NodeTypes>[] = []) {
  return canvases
    .map(node => keepOnlyChildren(node, 'GROUP'))
    .map(canvas => canvas.children).flat()
    .map(node => keepOnlyChildren(node, 'FRAME'))
    .filter(node => node.children.length > 0)
}
