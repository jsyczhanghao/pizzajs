import util from './util';

const ATTR_MAPS = {
  'class': 'className',
  'dataset': '$dataset',
};

export default {
  createElement(node: string, ...args: any) {
    return this.updateElement(document.createElement(node), ...args);
  },

  updateElement(node: HTMLElement, attrs?: object, listeners?: object) {
    //@ts-ignore
    attrs && util.map(attrs, (val: any, key: string) => {
      this.setAttr(node, key, val);
    });
    listeners && util.map(listeners, (fn: Function, key: string) => this.on(node, key, fn));
    return node;
  },

  setAttr(node: HTMLElement, name: string, value: any) {
    name = ATTR_MAPS[name] || name;
    node[name] = value;
  },

  on(node: HTMLElement, name: string, fn: Function) {
    let $$listeners = node['$$listeners'] || {};
    let [event, action] = name.split('.');

    $$listeners[event] = fn;
    node.addEventListener(event, (e: any) => {
      e.dataset = node['$dataset'];
      $$listeners[event] && $$listeners[event].call(node, e);
      action == 'stop' ? e.stopPropagation() : action == 'prevent' ? e.preventDefault() : null;
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
    if (index < 0) return false;

    let children = parent.childNodes;
    return children.length == 0 || children.length < index ? parent.appendChild(el) : parent.insertBefore(el, children[index]);
  },

  remove(el?: HTMLElement | Text | Comment) {
    el && el.remove();
  }
}