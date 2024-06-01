export function createElement(type, props, ...children) {
  return {
    dom: null,
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child)
      }),
    },
    component: null,
  }
}

export function createTextElement(text) {
  return {
    dom: null,
    type: "TEXT_ELEMENT",
    props: {
      children: [],
      nodeValue: text,
    },
    component: null,
  }
}

export function createDom(vnode) {
  const dom =
    vnode.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(vnode.type)

  updateDom(dom, {}, vnode.props)

  return dom
}

export function updateDom(dom, oldProps, newProps) {
  Object.keys(newProps)
    .filter(it => !Object.keys(newProps).includes(it))
    .map((prop) => {
      dom[prop] = undefined
    })

  Object.keys(newProps)
    .filter(prop => prop.substring(0, 2) !== 'on' && prop !== 'children')
    .map(prop => {
      dom[prop] = newProps[prop]
    })

  Object.keys(newProps)
    .filter(it => it.substring(0, 2) === 'on')
    .forEach((it) => {
      const eventType = it.slice(2).toLowerCase()
      dom.addEventListener(eventType, newProps[it])
    })
}
