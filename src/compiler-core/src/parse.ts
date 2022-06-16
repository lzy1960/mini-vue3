import { NodeTypes } from "./ast"

const enum TagType {
  START,
  END
}

export const baseParse = (content: string) => {
  const context = createParserContext(content)

  return createRoot(parseChildren(context, ''))
}

function parseChildren (context, parentTag) {
  let nodes: any[] = []

  while (!isEnd(context, parentTag)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      // 插值
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      // element
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context)
      }
    }

    // 处理text
    if (!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }

  return nodes
}

function isEnd (context, parentTag) {
  const s = context.source
  if (parentTag && s.startsWith(`</${parentTag}>`)) {
    return true
  }
  return !s
}

function parseText (context) {
  let endIndex = context.source.length
  const endToken = '{{'
  const index = context.source.indexOf(endToken)

  if (index !== -1) {
    endIndex = index
  }
  // 1. 获取text
  let content = parseTextData(context, endIndex)
  console.log('==============', content)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData (context, length) {
  const content = context.source.slice(0, length)

  advanceBy(context, content.length)

  return content
}

function parseElement (context) {
  // 1. 解析tag
  const element: any = parseTag(context, TagType.START)

  element.children = parseChildren(context, element.tag)

  parseTag(context, TagType.END)
  console.log('----------', context.source)

  return element
}

function parseTag (context, type: TagType) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]
  // 2. 删除处理完成的内容
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.END) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parseInterpolation (context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()

  advanceBy(context, closeDelimiter.length)


  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function advanceBy (context, length) {
  context.source = context.source.slice(length)
}

function createRoot (children) {
  return {
    children
  }
}

function createParserContext (content: string) {
  return {
    source: content
  }
}
