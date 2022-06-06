import { createVNode } from './vnode';

// 整体流程
// createApp -> app.mount() -> 
// render -> patch -> 判断vnode类型 ->
// 如果是component -> mountComponent -> setupComponent+setupRenderEffect
export const createAppAPI = (render) => {
  return function createApp (rootComponent, parentComponent) {
    return {
      mount (rootContainer) {
        // 先转化成 vnode
        // 所有的逻辑操作都会基于 vnode
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer, parentComponent)
      }
    }
  };
}
