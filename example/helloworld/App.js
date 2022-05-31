import { h } from "../../lib/guide-mini-vue3.esm.js"

window.self = null
export const App = {
  render () {
    window.self = this
    return h('div',
      {
        id: 'root',
        class: ['red']
      },
      // 'hello, ' + this.msg
      [
        h('p', { class: ['red', 'hard'] }, 'hi'),
        h('p', { class: 'blue' }, this.msg)
      ]
    )
  },
  setup () {
    return {
      msg: 'mini-vue3'
    }
  }
}
