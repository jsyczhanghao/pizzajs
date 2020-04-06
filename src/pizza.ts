import EventEmitter from './event';
import helper from './helper';
import Options, { OptionsData } from './options';
import { VNode, patchVNode } from './vnode';

class Pizza extends EventEmitter {
  $options: Options;
  $propsData: object;
  $data: object;
  $vnode: VNode;
  $render: Function;
  $context: Pizza;
  $componentName: string;
  $mounted: boolean = false;
  $destroyed: boolean = false;
  $el?: HTMLElement | Text | Comment | DocumentFragment;
  protected _mountElement?: HTMLElement;

  constructor(componentOptions: OptionsData = {}, options: any = {}) {
    super();
    this.$options = new Options(componentOptions);
    this.$render = this.$options.render;
    this.$propsData = options.props;
    this.$context = options.context;
    this.$componentName = options.componentName;
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

    if (typeof this.$options.data == 'function') {
      this.$data = this.$options.data.call(this);
    } else {
      this.$data = this.$options.data;
    }

    helper.util.proxy(this, this.$data, this.$get, this.$set);
    this.$emit('hook:created');
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
    return this.$methods[key] ?? this.$propsData[key] ?? this.$data[key] ?? _default;
  }

  protected _injectHooks() {
    helper.util.map(this.$options.lifetimes, (fn: Function, lifetime: string) => this.$on(`hook:${lifetime}`, fn));
  }

  $emit(name: string, ...args: any) {
    super.$emit(name, ...args);
    super.$emit(`${Pizza.$PROPS_EVENT_PREFIX}${name}`, ...args);
  }

  $invoke(method: string, ...args: any) {
    return this[method].call(this, ...args);
  }

  $nextTick(fn: Function) {
    this.$once('hook:$nextTick', fn);
  }

  $invokeUpdate() {
    this.$update();
  }

  $update = helper.util.debounce(function () {
    if (!this.$mounted || this.$destroyed) return false;
    this._render();
    this.$emit('hook:updated');
    this.$emit('hook:$nextTick');
  }, 10)

  protected _render() {
    let vnode: VNode = this.$render.call(this);

    if (!vnode) return false;

    if (this._mountElement) {
      vnode = { el: this._mountElement, children: [vnode] };
    }

    this._patch(vnode);
  }

  protected _patch(vnode: VNode) {
    this.$vnode = patchVNode(vnode, this.$vnode, this);
    this.$el = this.$vnode.el;
  }

  $invokeMount(element?: HTMLElement) {
    this.$mount(element);
  }

  $mount(element?: HTMLElement) {
    if (this.$mounted) return;

    if (element) {
      this._mountElement = element;
    }

    this._render();
    this.$mounted = true;
    this.$emit('hook:mounted');
    this.$emit('hook:$nextTick');
  }

  $destroy() {
    this.$destroyed = true;
    this.$emit('hook:destroyed');
  }
  
  static $PROPS_EVENT_PREFIX = 'PROPS_EVENT:';
}

export default Pizza;