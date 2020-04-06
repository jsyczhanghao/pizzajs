import { OptionsData } from '../options';
import Pizza from '../pizza';
import { VNode } from '../vnode';
import config from '../config';

class MiniPizza extends Pizza {
  $$id: number;

  protected _patch(vnode: VNode) {
    this.$vnode = vnode;
    this.$mounted && MiniPizza.send(this, 'UPDATE_COMPONENT', vnode);
  }

  static send(instance: any, type: string, data?: any) {
    self.postMessage({
      id: instance.$$id,
      data: data ? JSON.stringify(data) : null,
      type
    }, void 0);
  }
}

let instances = {};

self.addEventListener('message', (event) => {
  let {id, type, data} = event.data;
  let instance = instances[id];
  data = data ? JSON.parse(data) : null;

  switch (type) {
    case 'COMPONENT_CREATED':
      if (id == 0) return;

      let context: MiniPizza = instances[data.context];
      instance = new MiniPizza(context.$components[data.component], {
        props: data.props,
        componentName: data.component
      });
      instances[instance.$$id = event.data.id] = instance;
      instance.$mount();
      MiniPizza.send(instance, 'MOUNT_COMPONENT', instance.$vnode);
      break;  

    case 'UPDATE_COMPONENT':
      instance.$propsData = data.props;
      instance.$update();
      break;

    case 'COMPONENT_INVOKE':
      instance.$invoke(...data);
  }
});

config.constructor = MiniPizza;

export const Page = function (options: OptionsData) {
  let instance: any = new MiniPizza(options);
  instances[instance.$$id = 0] = instance;
  instance.$mount();
  MiniPizza.send(instance, 'CREATE_PAGE', {
    ...instance.$vnode,
    context: null,
  });
};

export const Component = function (options: OptionsData) {
  return options;
};