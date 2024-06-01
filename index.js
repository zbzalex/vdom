import { createElement } from './vdom/vdom.js'
import { mount } from './vdom/render.js'
import { BehaviorSubject, filter, tap } from 'rxjs'
import _ from 'lodash'

class Header {
    constructor(props) {
        this.props = props;
    }
    
    didMount() {
        console.log('header did mount')
    }

    didUnmount() {
        console.log('header did unmount')
    }

    render() {
        return createElement('div', {
            onClick: this.props.onClick,
        },
            "This is header",
        )
    }
}

class App {
    constructor() {

        this.popup$ = new BehaviorSubject(null)
            .pipe(
                filter(result => result !== null),
                tap((result) => {
                    //console.log(result)
                })
            )

        this.counter$ = new BehaviorSubject(0)
    }

    didMount() {
        console.log('component did mount')

        // interval(1000).pipe(
        //     tap((result) => this.counter$.next(result))
        // ).subscribe()
    }

    didUnmount() {
        console.log('component did unmount')
    }

    render() {
        return createElement('div', {
            className: "canvas"
        },
            this.popup$$ ? createElement(Header, {
                onClick: () => {
                    console.log('you are clicked on header')
                }
            }) : undefined,
            this.popup$$ ? this.popup$$ : undefined,
            createElement('div', {
                className: "layout"
            },
                createElement('button', {
                    onClick: () => {

                        this.popup$.next(
                            this.popup$$
                                ? undefined
                                : createElement('div', {
                                    className: "popup"
                                }, "this is popup")
                        )

                    },
                },
                    this.popup$$ ? "Clicked" : "Click me"
                )
            ),
            this.popup$$ ? this.popup$$ : undefined,
            `counter ${this.counter$$}`,
        )
    }
}

mount(createElement(App), document.getElementById('app'))
