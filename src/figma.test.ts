import { Node } from 'figma-api'
import { test } from 'uvu'
import assert from 'uvu/assert'

import { getFrames, getGroups } from './figma'

const canvas = (id = '', name = '', children = []) => ({ id, name, type: 'CANVAS', children: [...children] }) as Node<'CANVAS'>
const group = (id = '', name = '', children = []) => ({ id, name, type: 'GROUP', children: [...children] }) as Node<'GROUP'>
const frame = (id = '', name = '', children = []) => ({ id, name, type: 'FRAME', children: [...children] }) as Node<'FRAME'>

const realCanvas = canvas('1:1', 'Page 1', [
  group('2:1', 'Group 1', [
    group('21:1', 'Group 1a', []),
    frame('21:2', 'Frame 1a', []),
    group('21:3', 'Group 2a', []),
    frame('21:4', 'Frame 2a', []),
  ]),
  frame('2:2', 'Frame 1', []),
  group('2:3', 'Group 2', [
    frame('23:1', 'Frame 1b', []),
    group('23:2', 'Group 1b', []),
    group('23:3', 'Group 2b', []),
    frame('23:4', 'Frame 2b', []),
  ]),
  frame('2:4', 'Frame 2', []),
])

test('Figma is able to retrieve frames from a list of pages (layers are reversed)', () => {
  assert.equal(getFrames([realCanvas]), [
    {
      id: "2:4",
      name: "Frame 2",
      type: "FRAME",
      children: []
    },
    {
      id: "2:2",
      name: "Frame 1",
      type: "FRAME",
      children: []
    }
  ])
})

test('Figma is able to retrieve groups from a list of pages (layers are reversed)', () => {
  assert.equal(getGroups([realCanvas]), [
    {
      id: "2:3",
      name: "Group 2",
      type: "GROUP",
      children: [
        {
          id: "23:4",
          name: "Frame 2b",
          type: "FRAME",
          children: []
        },
        {
          id: "23:1",
          name: "Frame 1b",
          type: "FRAME",
          children: []
        }
      ]
    },
    {
      id: "2:1",
      name: "Group 1",
      type: "GROUP",
      children: [
        {
          id: "21:4",
          name: "Frame 2a",
          type: "FRAME",
          children: []
        },
        {
          id: "21:2",
          name: "Frame 1a",
          type: "FRAME",
          children: []
        }
      ]
    }
  ])
})

test.run()