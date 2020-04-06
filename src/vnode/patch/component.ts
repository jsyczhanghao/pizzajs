import {Patch, PatchType} from './patch';
import VNode from '../vnode';
import helper from '../../helper';
import config from '../../config';

function on(instance, events: object = {}) {
  helper.util.map(events, (event, name) => {
    instance.$on(`${config.constructor.$PROPS_EVENT_PREFIX}${name}`, function(...args) {
      this.$invoke(event, ...args);
    });
  });
}

export default function (now: VNode, old: VNode, context: any) : Patch{
  let instance: any = old.componentInstance, type: PatchType;

  if (!instance) {
    now.el = helper.dom.createElement(`${config.logo}-${now.node}`, {
      ...(now.props['slot'] ? {slot: now.props['slot']} : {})
    });
    now.el.$root = now.el.attachShadow({mode: 'open'});
    instance = new config.constructor(now.componentOptions, {
      props: now.props,
      context: context,
      componentName: now.node,
    });
    on(instance, now.events);
    instance.$invokeMount(now.el.$root);

    // if ('adoptedStyleSheets' in now.el.$root) {
    //   now.el.$root.adoptedStyleSheets = [instance.$options.style];
    // } else {
      let style = document.createElement('style');
      style.textContent = instance.$options.style;
      now.el.$root.appendChild(style);
   // }
   
    type = PatchType.ADD;
  } else if (!helper.util.same(now.props, old.props)) {
    now.el = old.el;
    instance.$propsData = now.props;
    instance.$offByPrefix(config.constructor.$PROPS_EVENT_PREFIX);
    on(instance, now.events);
    instance.$invokeUpdate();
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