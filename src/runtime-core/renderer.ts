import { createComponentInstance, setupConponent } from './component';
export const render = (vnode, container) => {
  patch(vnode, container)
}

export const patch = (vnode, container) => {
  // 处理组件

  // 判断是不是element
  processComponent(vnode, container)
};

function processComponent (vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent (vnode, container) {
  const instance = createComponentInstance(vnode)
  setupConponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect (instance, container) {
  const subTree = instance.render()

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}
