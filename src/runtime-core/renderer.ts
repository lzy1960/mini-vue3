import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';

export const render = (vnode, container) => {
  patch(vnode, container)
}

export const patch = (vnode, container) => {
  //ShapeFlags 
  // vnode -> flag

  // 判断是不是element
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
};

function processElement (vnode: any, container: any) {
  mountElement(vnode, container)
}

function processComponent (vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountElement (vnode: any, container: any) {
  // string array
  const { props, children, shapeFlag } = vnode
  const el = vnode.el = document.createElement(vnode.type)
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(children, el)
  }

  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, Array.isArray(val) ? val.join(' ') : val)
    }
  }

  container.append(el)
}

function mountComponent (initialVNode, container) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect (instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)

  // element -> mount
  initialVNode.el = subTree.el
}

function mountChildren (vnode, container) {
  vnode.forEach(child => {
    patch(child, container)
  })
}

