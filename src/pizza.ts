import { VNode, Options, Lifecyles } from './interface';
import { makeVnodeFn, vnodePatch } from './vnode';
import EventEmitter from './event';
import Compiler from './compiler';
import Helper from './helper';
import register from './register';

class Pizza extends EventEmitter {
  $options: Options;
  $propsData: object;
  protected $methods: object;
  protected $data: object;
  protected $components: object;
  $mounted: boolean = false;
  $destroyed: boolean = false;
  protected _vnode: VNode;
  protected _vnodeFn;
  protected _nextFns = [];
  protected _mountElement?: HTMLElement;
  $el?: HTMLElement | Text | Comment | DocumentFragment;

  constructor(options: Options) {
    super();
    this.$options = options || {};
    this.$propsData = options.propsData || {};
    this.$data = options.data || {};
    this.$methods = options.methods || {};
    this.$components = Helper.util.camelKeys2ul(options.components);
    this._init();
  }

  protected _init() {
    //inject lifecycles hook
    this._injectHooks();
    //proxy methods and data
    Helper.util.proxy(this, this.$options.props, this.$get);
    Helper.util.proxy(this, this.$methods, this.$get);
    Helper.util.proxy(this, this.$data, this.$get, this.$set);
    //create renderFn
    this._vnodeFn = this.$options.render ? this.$options.render : makeVnodeFn(this.$options.template, this.$options);
    this.$emit('hook:created');
  }

  $set(key: string, value: any) {
    if (!(key in this.$data) || value === this.$data[key]) return ;
    this.$data[key] = value;
    this.$update();
  }

  $get(key: string, _default?: any) {
    if (this.$methods[key]) {
      return (...args) => this.$invoke(key, ...args);
    }

    return this.$propsData[key] ?? this.$data[key] ?? _default;
  }

  _injectHooks() {
    Helper.util.each(this.$options.lifecyles, (fn, lifecycle) => this.$on(`hook:${lifecycle}`, fn));
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

  $update = Helper.util.debounce(function() {
    if (!this.$mounted || this.$destroyed) return false;
    this._render();
    this.$emit('hook:updated');
  }, 10)

  _render() {
    let vnode: VNode = this._vnodeFn();

    if (this._mountElement) {
      vnode = {el: this._mountElement, children: [vnode]};
    }

    this._vnode = vnodePatch(vnode, this._vnode);
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

  static register = register;
}

export default Pizza;