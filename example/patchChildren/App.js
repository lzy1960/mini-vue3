import { h } from "../../lib/guide-mini-vue3.esm.js";
import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export const App = {
  setup () {
    return {}
  },
  render () {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // 老的是array，新的是text
      // h(ArrayToText),
      // 老的是text，新的是text
      // h(TextToText),
      // 老的是text，新的是array
      // h(TextToArray),
      // 老的是array，新的是array
      h(ArrayToArray),
    ])
  }
};
