import { h } from "../../lib/guide-mini-vue3.esm.js"

window.self = null
export const App = {
  render () {
    window.self = this
    return h('div',
      {
        id: 'root',
        class: ['red'],
        onClick: () => {
          console.log('点击了外面的div')
        }
      },
      // 'hello, ' + this.msg
      [
        h('p', {
          class: ['red', 'hard'],
          onClick: () => {
            console.log('点击了p标签')
          },
          onMousedown: () => {
            console.log('鼠标点下去了')
          }
        }, 'hi'),
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
