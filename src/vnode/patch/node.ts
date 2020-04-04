import { Patch, PatchType } from './patch';
import VNode from '../vnode';
import helper from '../../helper';

export default function (now: VNode, old: VNode): Patch {
  let type;

  if (!old.el) {
    now.el = helper.dom.createElement(now.node, now.props, now.events);
    type = PatchType.ADD;
  } else if (!helper.util.same(now.props, old.props)) {
    now.el = helper.dom.updateElement(old.el, now.props, now.events);
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