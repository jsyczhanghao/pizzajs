import { OptionsData } from '../options';
import Pizza from '../pizza';
import { VNode } from '../vnode';
import config from '../config';

let instances = {};
let $$id = 0;
let worker;

class MiniClientPizza extends Pizza {
  $$id: number;

  _init() {
    super._init();
    instances[this.$$id = $$id++] = this;

    MiniClientPizza.send(this, 'COMPONENT_CREATED', {
      props: this.$propsData,
      context: this.$context ? this.$context['$$id'] : 0,
      component: this.$componentName,
    }); 
  }

  $invoke(method: string, ...args: []) {
    MiniClientPizza.send(this, 'COMPONENT_INVOKE', [method, ...args]);
  }

  $invokeUpdate() {
    MiniClientPizza.send(this, 'UPDATE_COMPONENT', {
      props: this.$propsData,
      context: this.$context ? this.$context['$$id'] : 0,
    }); 
  }

  $invokeMount(element?: HTMLElement) {
    this._mountElement = element;
  }

  static listen = listen;

  static send(instance: MiniClientPizza, type: string, data?: any) {
    worker.postMessage({
      id: instance.$$id, 
      data: data ? JSON.stringify(data) : null,
      type
    }, void 0);
  }
}

function listen(_) {
  worker = _;
  worker.addEventListener('message', (event) => {
    let {id, type, data} = event.data;
    let instance = instances[id];
    data = data ? JSON.parse(data) : null;
    
    switch (type) {
      case 'CREATE_PAGE':
        instance = new MiniClientPizza({
          render: () => data
        });
        instance.$mount(document.getElementById('app'));
        break;

      case 'UPDATE_COMPONENT':
        instance.$render = () => data;
        instance.$mounted && instance.$update();
        break;

      case 'MOUNT_COMPONENT':
        instance.$render = () => data;
        instance.$mount();
    }
  });
}

export default config.constructor = MiniClientPizza;