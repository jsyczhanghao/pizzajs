import { PizzaContructor, Pizza, config } from '.';

class WorkerPizza extends Pizza {
  _patch(vnode) {
    return this.$vnode = vnode;
  }

  $mount() {
    if (this.$mounted) return;

    this._render();
    this.$mounted = true;
    this.$emit('hook:mounted');
    this.$emit('hook:$nextTick');
  }
}

export default PizzaContructor.set(WorkerPizza);