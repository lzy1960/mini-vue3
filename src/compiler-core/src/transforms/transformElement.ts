import { NodeTypes } from "../ast"
import { CREATE_ELEMENT_VNODE } from '../runtimeHelpers';

export const transformElement = (node, context) => {
  if (node.type === NodeTypes.ELEMENT) {
    context.helper(CREATE_ELEMENT_VNODE)
  }
}
