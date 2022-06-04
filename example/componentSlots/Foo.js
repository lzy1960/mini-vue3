import { h, renderSlots } from "../../lib/guide-mini-vue3.esm.js"

export const Foo = {
  setup () {
    return {}
  },
  render () {
    const foo = h('p', {}, 'foo')

    console.log(this.$slots)
    // children -> vnode
    // 实现具名插槽
    // 1. 获取要渲染的元素
    // 2. 要获取到渲染的位置
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age: 18
      }),
      foo,
      renderSlots(this.$slots, 'footer')
    ])
  }
}