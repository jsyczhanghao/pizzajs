import { OptionsData } from '../options';
import Pizza from '../pizza';

const instances = {};
let $$id = 0;

class MiniPizza extends Pizza {
  $$id: number;

  _init() {
    super._init();
    instances[this.$$id = $$id++] = this;
  }

  _render() {
    this._vnode = this.$options.render.call(this);
    this.$emit('hook:patched', this._vnode);
  }

  $destroy() {
    delete instances[this.$$id];
  }
}

function Page(options: OptionsData) {
  return new Pizza(options);
}

function Component(options: OptionsData) {
  return options;
}