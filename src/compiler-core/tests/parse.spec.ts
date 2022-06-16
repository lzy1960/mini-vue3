import { NodeTypes } from '../src/ast';
import { baseParse } from '../src/parse';

describe('Parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast: any = baseParse('{{ message }}')

      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    });
  });
  describe('element', () => {
    it('simple element div', () => {
      const ast: any = baseParse('<div></div>')

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: []
      })
    });
  });
  describe('text', () => {
    it('simple text', () => {
      const ast: any = baseParse('some text')

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'some text'
      })
    });
  });
  test('hello world', () => {
    const ast: any = baseParse('<div>h1,{{ message }}</div>')

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [{
        type: NodeTypes.TEXT,
        content: 'h1,'
      }, {
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      }]
    })
  })
  // 边缘case
  test('nested element', () => {
    const ast: any = baseParse('<div><p>h1</p>{{ message }}</div>')

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [{
        type: NodeTypes.ELEMENT,
        tag: 'p',
        children: [{
          type: NodeTypes.TEXT,
          content: 'h1',
        }]
      }, {
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      }]
    })
  })
  test('should throw error when lack end tag', () => {
    expect(() => {
      baseParse('<div><span></div>')
    }).toThrow('缺少结束标签: span')
  })
});