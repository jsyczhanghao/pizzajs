import EventEmitter from './event';
import helper from './helper';
import Options, { OptionsData } from './options';
import { VNode, patchVNode } from './vnode';

const COMPONENTS = {};
const $update = helper.util.throttle(function(){
  this.$forceUpdate();
}, 0)

class Pizza extends EventEmitter {
  $componentId: any;
  $options: Options;
  $propsData: object;
  $data: object;
  $vnode: VNode;
  $render: Function;
  $context: Pizza;
  $children: any[];
  $componentName: string;
  $mounted: boolean = false;
  $destroyed: boolean = false;
  $el?: HTMLElement | DocumentFragment;
  protected _mountElement?: HTMLElement;
  static $$id = 0;

  constructor(componentOptions: OptionsData = {}, options: any = {}) {
    super();
    this.$options = new Options(componentOptions);
    this.$render = this.$options.render;
    this.$propsData = options.props || {};
    this.$context = options.context;
    this.$componentName = options.componentName;
    this.$componentId = options.componentId ? options.componentId : Pizza.$$id++;
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
    helper.util.proxy(this, this.$options.computed, this.$get);
    this.$emit('hook:created');
  }

  get $methods() {
    return this.$options.methods;
  }

  get $components() {
    return {
      ...COMPONENTS,
      ...this.$options.components
    };
  }

  $set(key: string, value: any) {
    if (!(key in this.$data) || value === this.$data[key]) return;
    let old = this.$data[key];
    this.$data[key] = value;
    this._invokeWatch(key, value, old);
    this.$update();
  }

  $get(key: string, _default?: any) {
    if (this.$options.computed[key]) {
      return this.$options.computed[key].call(this);
    }

    return this.$methods[key] ?? this.$propsData[key] ?? this.$data[key] ?? this.$options.props[key] ?? _default;
  }

  $setPropsData(data: object) {
    helper.util.map(data, (val, key) => {
      let old = this.$propsData[key];
      key in this.$options.props && old !== val && this._invokeWatch(key, this.$propsData[key] = val, old);
    });
    this.$update();
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

  private _invokeWatch(key: string, now: any, old: any) {
    let fn = this.$options.watch[key];
    fn && fn.call(this, now, old);
  }

  $update() {
    $update.call(this);
  }

  $forceUpdate() {
    if (!this.$mounted || this.$destroyed) return false;
    this._render();
    this.$emit('hook:updated');
    this.$emit('hook:$nextTick');
  }

  $nextTick(fn: Function) {
    this.$once('hook:$nextTick', fn);
  }

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

  $mount(element?: HTMLElement) {
    if (this.$mounted) return;

    if (element) {
      this._mountElement = element;
    }

    this._render();
    this.$mounted = true;
    this.$emit('hook:mounted');
    this.$emit('hook:$nextTick');
    helper.dom.injectStyle(this.$el, this.$options.style);
  }

  $destroy() {
    this.$destroyed = true;
    this.$emit('hook:destroyed');
  }
  
  static $PROPS_EVENT_PREFIX = 'PROPS_EVENT:';
  static register(name: string, options?: OptionsData): OptionsData {
    if (!options) return COMPONENTS[name];
    return COMPONENTS[name] = options;
  };
}

export default Pizza;