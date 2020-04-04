import {Patch, PatchType} from './patch';
import VNode from '../vnode';
import helper from '../../helper';
import Pizza from '../../pizza';

function on(instance, events: object = {}) {
  helper.util.map(events, (event, name) => {
    instance.$on(`props:${name}`, event);
  });
}

export default function (now: VNode, old: VNode) : Patch{
  let instance: Pizza = old.componentInstance, type: PatchType;

  if (!instance) {
    now.el = helper.dom.createElement(now.node, {
      ...(now.props['slot'] ? {slot: now.props['slot']} : {})
    });
    now.el.$root = now.el.attachShadow({mode: 'open'});
    instance = new Pizza(now.componentOptions, now.props);
    on(instance, now.events);
    instance.$mount(now.el.$root);
    now.el.$root.adoptedStyleSheets = [instance.$options.style];
    type = PatchType.ADD;
  } else if (!helper.util.same(now.props, old.props)) {
    now.el = old.el;
    instance.$propsData = now.props;
    instance.$off('props:');
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