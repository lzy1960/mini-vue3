import { h, ref } from "../../lib/guide-mini-vue3.esm.js"

const nextChildren = [h('div', {}, 'nextA'), h('div', {}, 'nextB')]
const prevChildren = [h('div', {}, 'prevA'), h('div', {}, 'prevB')]

export default {
  name: 'ArrayToArray',
  setup () {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render () {
    return this.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  }
}