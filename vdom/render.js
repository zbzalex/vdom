import { filter } from "rxjs";
import { createDom, updateDom } from "./vdom"
import { isFunctionComponent } from './utils'

export function createFunctionComponent(virtualElement) {
    const component = new virtualElement.type(virtualElement.props)

    virtualElement = component.render()
    virtualElement.component = component
    virtualElement.subscriptions = []

    Object.keys(component).filter(prop =>
        prop.match(/\$$/) !== null).forEach(prop => {

            // set default value
            component[prop + '$'] = undefined

            const observable$ = component[prop].pipe(filter(result => result !== null))
            const observableSubscription = observable$.subscribe((result) => {

                // update actual value
                component[prop + '$'] = result

                const newVirtualElement = component.render()

                patch(virtualElement, newVirtualElement)

            })

            virtualElement.subscriptions.push(observableSubscription)
        });

    return virtualElement
}

export function create(virtualElement) {
    if (isFunctionComponent(virtualElement)) {
        virtualElement = createFunctionComponent(virtualElement)
    }

    virtualElement.dom = createDom(virtualElement)
    virtualElement.props.children = virtualElement.props.children.map(child => create(child))
    virtualElement.props.children.forEach(child => mount(child, virtualElement.dom))

    return virtualElement;
}

export function mount(virtualElement, container) {
    virtualElement = create(virtualElement)

    container.appendChild(virtualElement.dom)

    if (virtualElement.component) {
        virtualElement.component.didMount()
    }
}

export function unmount(virtualElement) {
    if (virtualElement.component) {
        virtualElement.subscriptions.forEach(subscription => subscription.unsubscribe())
        virtualElement.component.didUnmount()
    }
}

export function patch(oldVirtualElement, newVirtualElement, parent, index = 0) {
    if (oldVirtualElement.type !== newVirtualElement.type) {

        // create new virtual element
        newVirtualElement = create(newVirtualElement)

        if (   oldVirtualElement.component !== null
            && newVirtualElement.component !== null) {
            
            // if (oldVirtualElement.props.children.length
            //         !== newVirtualElement.props.children.length) {
                
            // } else {

            // }

            const oldProps = oldVirtualElement.props
            const newProps = newVirtualElement.props

        }

        parent.props.children[index] = newVirtualElement

        parent.dom.replaceChild(
            newVirtualElement.dom,
            parent.dom.childNodes[index]
        )

        if (newVirtualElement.component) {
            newVirtualElement.component.didMount()
        }

        unmount(oldVirtualElement)
    }
    else {
        if (oldVirtualElement.type === 'TEXT_ELEMENT') {
            updateDom(
                oldVirtualElement.dom,
                oldVirtualElement.props,
                newVirtualElement.props
            )

            oldVirtualElement.props = newVirtualElement.props
        }
        else {
            const oldChildren = oldVirtualElement.props.children
            const newChildren = newVirtualElement.props.children
            const minChildren = Math.min(oldChildren.length, newChildren.length)

            // Patch the children
            for (let i = 0; i < minChildren; i++) {
                patch(oldChildren[i], newChildren[i], oldVirtualElement, i)
            }

            // Old children was longer
            // Remove children that are not
            if (oldChildren.length > newChildren.length) {

                oldVirtualElement.props.children =
                    oldChildren.props.children.slice(newChildren.length)

                oldChildren.slice(newChildren.length)
                    .forEach(child => {

                        child.dom.remove()

                        unmount(child)

                    })
            }
            // Old children was shorter
            // Add the newly added children
            else {
                newChildren.slice(oldChildren.length)
                    .forEach(child => {

                        child = create(child)

                        mount(child, oldVirtualElement.dom)

                        oldVirtualElement.props.children.push(child)

                    })
            }
        }
    }
}
