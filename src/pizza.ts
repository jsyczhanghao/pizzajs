import EventEmitter from './event';
import helper from './helper';
import Options, { OptionsData } from './options';
import { VNode, patchVNode } from './vnode';

class Pizza extends EventEmitter {
  $options: Options;
  $propsData: object;
  protected _vnode: VNode;
  protected _nextFns = [];
  protected _mountElement?: HTMLElement;
  $mounted: boolean = false;
  $destroyed: boolean = false;
  $el?: HTMLElement | Text | Comment | DocumentFragment;

  constructor(options: OptionsData, propsData: object = {}) {
    super();
    this.$options = new Options(options);
    this.$propsData = propsData;
    this._init();
  }

  protected _init() {
    //inject lifecycles hook
    this._injectHooks();
    //proxy methods and data
    helper.util.proxy(this, {
      ...this.$options.props,
      ...this.$options.methods
    }, this.$get);
    helper.util.proxy(this, this.$options.data, this.$get, this.$set);
    this.$emit('hook:created');
  }

  get $data() {
    return this.$options.data;
  }

  get $methods() {
    return this.$options.methods;
  }

  get $components() {
    return this.$options.components;
  }

  $set(key: string, value: any) {
    if (!(key in this.$data) || value === this.$data[key]) return;
    this.$data[key] = value;
    this.$update();
  }

  $get(key: string, _default?: any) {
    if (this.$methods[key]) {
      return (...args: []) => this.$invoke(key, ...args);
    }

    return this.$propsData[key] ?? this.$data[key] ?? _default;
  }

  protected _injectHooks() {
    helper.util.map(this.$options.lifetimes, (fn: Function, lifetime) => this.$on(`hook:${lifetime}`, fn));
  }

  $emit(name, ...args) {
    super.$emit(name, ...args);
    super.$emit(`props:${name}`, ...args);
  }

  $invoke(key, ...args) {
    return this.$methods[key].call(this, ...args);
  }

  $nextTick(fn: Function) {
    this._nextFns.push(fn);
  }

  $update = helper.util.debounce(function () {
    if (!this.$mounted || this.$destroyed) return false;
    this._render();
    this.$emit('hook:updated');
  }, 10)

  _render() {
    let vnode: VNode = this.$options.render.call(this);

    if (this._mountElement) {
      vnode = { el: this._mountElement, children: [vnode] };
    }

    this._vnode = patchVNode(vnode, this._vnode);
    this._nextFns.forEach((fn) => fn.call(this));
    this._nextFns.length = 0;
  }

  $mount(element?: HTMLElement) {
    if (this.$mounted) return false;

    if (element) {
      element.innerHTML = '';
      this._mountElement = element;
    }

    this._render();
    this.$el = this._vnode.el;
    this.$mounted = true;
    this.$emit('hook:mounted');
  }

  $destroy() {
    this.$destroyed = true;
    this.$emit('hook:destroyed');
  }
}

export default Pizza;