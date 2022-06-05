import { h, getCurrentInstance } from "../../lib/guide-mini-vue3.esm.js"

export const Foo = {
  name: 'Foo',
  render () {
    return h('div', {}, 'Foo')
  },
  setup () {
    const instance = getCurrentInstance()
    console.log(instance)
    return {}
  }
}
