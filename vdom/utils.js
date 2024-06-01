export function isFunctionComponent(vnode) {
    return typeof vnode.type === 'function';
}
