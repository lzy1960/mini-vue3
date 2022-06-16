import { NodeTypes } from "./ast"

const enum TagType {
  START,
  END
}

export const baseParse = (content: string) => {
  const context = createParserContext(content)

  return createRoot(parseChildren(context, []))
}

function parseChildren (context, ancestors) {
  let nodes: any[] = []

  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      // 插值
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      // element
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
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

function isEnd (context, ancestors) {
  const s = context.source

  if (s.startsWith('</')) {
    for (let i = 0; i < ancestors.length; i++) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }

  // if (ancestors && s.startsWith(`</${ancestors}>`)) {
  //   return true
  // }
  return !s
}

function parseText (context) {
  let endIndex = context.source.length
  const endTokens = ['{{', '<']
  let index = 0
  for (let i = 0; i < endTokens.length; i++) {
    index = context.source.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
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

function parseElement (context, ancestors) {
  // 1. 解析tag
  const element: any = parseTag(context, TagType.START)

  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.END)
  } else {
    throw new Error('缺少结束标签: ' + element.tag)
  }

  console.log('----------', context.source)

  return element
}

function startsWithEndTagOpen (source, tag) {
  return source.slice(2, 2 + tag.length) === tag
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
