import { h } from "../../lib/guide-mini-vue3.esm.js"
import { Foo } from "./Foo.js"

export const App = {
  render () {
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, {
      header: ({ age }) => h('p', {}, 'header' + age),
      footer: () => h('p', {}, 'footer')
    })

    return h('div', {}, [app, foo])
  },
  setup () {
    return {}
  }
}
