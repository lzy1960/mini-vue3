import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { Fragment, Text } from './vnode';
import { createAppAPI } from './createApp';

export const createRenderer = (options) => {
  const {
    patchProp: hostPatchProp,
    insert: hostInsert,
    createElement: hostCreateElement
  } = options

  const render = (vnode, container, parentComponent) => {
    patch(vnode, container, parentComponent)
  }

  const patch = (vnode, container, parentComponent) => {
    //ShapeFlags 
    // vnode -> flag

    // 判断是不是element
    const { type, shapeFlag } = vnode

    // Fragment -> 只渲染所有的children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;

      case Text:
        processText(vnode, container)
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent)
        }
        break;
    }
  };

  function processFragment (vnode: any, container: any, parentComponent: any) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText (vnode: any, container: any) {
    const { children } = vnode
    const textNode = vnode.el = document.createTextNode(children)
    container.append(textNode)
  }

  function processElement (vnode: any, container: any, parentComponent: any) {
    mountElement(vnode, container, parentComponent)
  }

  function processComponent (vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountElement (vnode: any, container: any, parentComponent: any) {
    // string array
    const { props, children, shapeFlag } = vnode
    const el = vnode.el = hostCreateElement(vnode.type)
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, val)
    }

    hostInsert(el, container)
  }

  function mountComponent (initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container, instance)

    // element -> mount
    initialVNode.el = subTree.el
  }

  function mountChildren (vnode, container, parentComponent) {
    vnode.children.forEach(child => {
      patch(child, container, parentComponent)
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
