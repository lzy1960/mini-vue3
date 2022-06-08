import { h, ref } from "../../lib/guide-mini-vue3.esm.js"

const nextChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
const prevChildren = 'prevChildren'

export default {
  name: 'TextToArray',
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