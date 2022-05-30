import { h } from "../../lib/guide-mini-vue3.esm.js"

export const App = {
  render () {
    return h('div',
      {
        id: 'root',
        class: ['red']
      },
      // 'hello, ' + this.msg
      [
        h('p', { class: ['red', 'hard'] }, 'hi'),
        h('p', { class: 'blue' }, 'mini-vue3')
      ]
    )
  },
  setup () {
    return {
      msg: 'mini-vue3'
    }
  }
}
