import { VNode, Patch, PatchType } from '../../interface';
import Helper from '../../helper';

export default function (now: VNode, old: VNode) : Patch{
  let type;

  if (!old.el) {
    now.el = Helper.dom.createElement(now.node, now.props, now.events);
    type = PatchType.ADD;
  } else if (!Helper.util.same(now.props, old.props)) {
    now.el = Helper.dom.updateElement(old.el, now.props, now.events);
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