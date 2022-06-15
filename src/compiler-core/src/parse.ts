import { NodeTypes } from "./ast"

export const baseParse = (content: string) => {
  const context = createParserContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren (context) {
  let nodes: any[] = []

  let node
  if (context.source.startsWith('{{')) {
    // 插值
    node = parseInterpolation(context)
  }
  nodes.push(node)

  return nodes
}

function parseInterpolation (context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  advance(context, openDelimiter)

  const rawContentLength = closeIndex - openDelimiter.length
  const rawContent = context.source.slice(0, rawContentLength)
  const content = rawContent.trim()

  advance(context, rawContentLength + closeDelimiter.length)


  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

function advance (context, openDelimiter) {
  context.source = context.source.slice(openDelimiter.length)
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
