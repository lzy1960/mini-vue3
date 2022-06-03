import { h } from "../../lib/guide-mini-vue3.esm.js"

export const Foo = {
  setup (props, { emit }) {
    // props.count
    console.log(props)
    // readonly
    props.count++
    console.log(props)

    const emitAdd = () => {
      console.log('emit add')
      emit('add', 1, 2)
      emit('addFoo')
    }
    return {
      emitAdd
    }
  },
  render () {
    const btn = h('button', {
      onClick: this.emitAdd
    }, 'emitAdd')
    const foo = h('p', {}, 'foo: ' + this.count)
    return h('div', {}, [foo, btn])
  }
}
