import util from './util';

export default {
  createElement(node: string, ...args) {
    return this.updateElement(document.createElement(node), ...args);
  },

  updateElement(node: HTMLElement, attrs?: object, listeners?: object) {
    //@ts-ignore
    attrs && util.each(attrs, (val, key) => key == 'value' ? (node.value = val) : this.setAttr(node, key, val));
    listeners && util.each(listeners, (fn, key) => this.on(node, key, fn));
    return node;
  },

  setAttr(node, name, value) {
    node.setAttribute(name, value);
  },

  on(node: HTMLElement, name: string, fn: Function) {
    let $$listeners = node['$$listeners'] || {};

    $$listeners[name] = fn;
    node.addEventListener(name, (e) => {
      $$listeners[name] && $$listeners[name].call(node, e);
    }, false);
    node['$$listeners'] = $$listeners;
  },

  off(node: HTMLElement, name: string) {
    let $$listeners = node['$$listeners'] || {};
    delete $$listeners[name];
    node['$$listeners'] = $$listeners;
  },

  fragment(): DocumentFragment {
    return document.createDocumentFragment();
  },

  createText(text: string) {
    return document.createTextNode(text);
  },

  createComment(comment: string = '') {
    return document.createComment(comment);
  },

  insert(parent: HTMLElement, el: any, index: number) {
    let children = parent.childNodes;
    return children.length == 0 || children.length < index ? parent.appendChild(el) : parent.insertBefore(el, children[index]);
  },

  remove(el?: HTMLElement | Text | Comment) {
    el && el.remove();
  }
}