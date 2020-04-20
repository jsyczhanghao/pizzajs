import { Patch, PatchType } from './patch';
import VNode from '../vnode';
import helper from '../../helper';
import config from '../../config';
import constructor from '../../contructor';

function on(instance, events: object = {}) {
  helper.util.map(events, (event, name) => {
    instance.$on(`${constructor.get().$PROPS_EVENT_PREFIX}${name}`, function (...args) {
      this.$invoke(event, ...args);
    });
  });
}

export default function (now: VNode, old: VNode, context: any): Patch {
  let instance: any = old?.componentInstance, type: PatchType;
  let nodeAttrs = helper.util.pick(now.props, ['slot', 'style', 'class']);

  if (!instance) {
    let node = `${config.prefixs.component || ''}${now.node}`;
    now.el = helper.dom.createElement(node, nodeAttrs);
    
    try {
      now.el.$root = now.el.attachShadow({ mode: 'closed' });
    } catch (e) {
      throw new Error(`Component[${node}] is not valid, the name must be like [xx-xx]`);
    }
    
    instance = new (constructor.get())(now.componentOptions, {
      props: helper.util.clone(now.props),
      context: context,
      componentName: now.node,
    });
    on(instance, now.events);
    instance.$mount(now.el.$root);
    type = PatchType.ADD;
  } else if (!helper.util.same(now.props, instance.$propsData)) {
    now.el = old.el;
    helper.dom.updateElement(now.el, nodeAttrs);
    instance.$setPropsData(helper.util.clone(now.props));
    instance.$offByPrefix(constructor.get().$PROPS_EVENT_PREFIX);
    on(instance, now.events);
    instance.$update();
    type = PatchType.UPDATE;
  } else {
    now.el = old.el;
    type = PatchType.NONE;
  }

  now.componentInstance = instance;

  return {
    type,
    vnode: now,
  };
}