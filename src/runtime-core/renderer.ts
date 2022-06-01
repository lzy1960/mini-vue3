import { createComponentInstance, setupComponent } from './component';
import { isObject } from '../shared/index';

export const render = (vnode, container) => {
  patch(vnode, container)
}

export const patch = (vnode, container) => {
  // 处理组件

  // TODO:
  // 判断是不是element
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
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
  const { props, children } = vnode
  const el = vnode.el = document.createElement(vnode.type)
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }

  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, Array.isArray(val) ? val.join(' ') : val)
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

