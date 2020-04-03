import { VNode, Patch, PatchType } from '../../interface';
import Helper from '../../helper';
import Pizza from '../../pizza';

function on(instance, events: object = {}) {
  Helper.util.each(events, (event, name) => {
    instance.$on(`props:${name}`, event);
  });
}

export default function (now: VNode, old: VNode) : Patch{
  let instance: Pizza = old.componentInstance, type: PatchType;

  if (!instance) {
    now.el = Helper.dom.createElement(now.node, {
      //@ts-ignore
      ...(now.props.slot ? {slot: now.props.slot} : {})
    });
    now.el.$root = now.el.attachShadow({mode: 'closed'});
    instance = new Pizza({
      ...now.componentOptions,
      propsData: now.props
    });
    on(instance, now.events);
    instance.$mount(now.el.$root);
    type = PatchType.ADD;
  } else if (!Helper.util.same(now.props, old.props)) {
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