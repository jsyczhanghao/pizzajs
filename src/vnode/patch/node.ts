import { Patch, PatchType } from './patch';
import VNode from '../vnode';
import helper from '../../helper';

export default function (now: VNode, old: VNode, context: any): Patch {
  let type;
  let events = {};

  helper.util.map(now.events || {}, (event, key) => {
    events[key] = function(...args) {
      context.$invoke(event, ...args);
    };
  });

  if (!old.el) {
    now.el = helper.dom.createElement(now.node, now.props, events);
    type = PatchType.ADD;
  } else if (!helper.util.same(now.props, old.props)) {
    now.el = helper.dom.updateElement(old.el, now.props, event);
    type = PatchType.UPDATE;
  } else {
    now.el = old.el;
    type = PatchType.NONE;
  }

  return {
    type,
    vnode: now,
  };
}