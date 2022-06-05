import { h, getCurrentInstance } from "../../lib/guide-mini-vue3.esm.js"
import { Foo } from "./Foo.js"

export const App = {
  name: 'App',
  render () {
    return h('div', {}, [h(Foo)])
  },
  setup () {
    let instance = getCurrentInstance()
    console.log(instance)
    return {}
  }
}
