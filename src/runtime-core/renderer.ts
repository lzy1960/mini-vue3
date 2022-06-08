import { createComponentInstance, setupComponent } from './component';
import { isObject, EMPTY_OBJ } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { Fragment, Text } from './vnode';
import { createAppAPI } from './createApp';
import { effect } from '../reactivity/effect';

export const createRenderer = (options) => {
  const {
    patchProp: hostPatchProp,
    insert: hostInsert,
    createElement: hostCreateElement,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  const render = (vnode, container, parentComponent) => {
    patch(null, vnode, container, parentComponent)
  }

  // n1 -> 老的
  // n2 -> 新的
  const patch = (n1, n2, container, parentComponent) => {
    //ShapeFlags 
    // vnode -> flag

    // 判断是不是element
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染所有的children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;

      case Text:
        processText(n1, n2, container)
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  };

  function processFragment (n1, n2: any, container: any, parentComponent: any) {
    mountChildren(n2, container, parentComponent)
  }

  function processText (n1, n2: any, container: any) {
    const { children } = n2
    const textNode = n2.el = document.createTextNode(children)
    container.append(textNode)
  }

  function processElement (n1, n2: any, container: any, parentComponent: any) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement (n1, n2, container, parentComponent) {
    console.log('patchElement')
    console.log(n1)
    console.log(n2)

    const el = n2.el = n1.el

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren (n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag } = n2
    const c2 = n2.children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //   // 1. 把老的children清空
      //   unmountChildren(n1.children)
      //   // 2. 设置text
      //   hostSetElementText(container, c2)
      // } else {
      //   if (c1 !== c2) {
      //     hostSetElementText(container, c2)
      //   }
      // }
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的children清空
        unmountChildren(n1.children)
      }
      // 2. 设置text
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren (children) {
    for (const child of children) {
      const el = child.el
      hostRemove(el)
    }
  }

  function patchProps (el, oldProps, newProps) {
    if (oldProps === newProps) return

    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]
      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    if (oldProps === EMPTY_OBJ) return

    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  function processComponent (n1, n2: any, container: any, parentComponent: any) {
    mountComponent(n2, container, parentComponent)
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
      mountChildren(vnode.children, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container)
  }

  function mountComponent (initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log('init')
        const { proxy } = instance
        const subTree = instance.subTree = instance.render.call(proxy)
        console.log(subTree)

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance)

        // element -> mount
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        console.log('current', subTree)
        console.log('prev', prevSubTree)

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  function mountChildren (children, container, parentComponent) {
    children.forEach(child => {
      patch(null, child, container, parentComponent)
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
