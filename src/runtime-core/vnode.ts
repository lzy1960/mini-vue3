import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from '../shared/index';

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export {
  createVNode as createElementVNode
}

export const createVNode = (type, props?, children?) => {
  const vnode = {
    type,
    props,
    key: props && props.key,
    children,
    instance: null,
    shapeFlag: getShapeFlag(type),
    el: null,
  }

  // children
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 组件 + children is object 则为slot
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children)) {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
};

export const createTextVNode = (text) => {
  return createVNode(Text, {}, text)
}

function getShapeFlag (type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
