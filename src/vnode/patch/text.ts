import { Patch, PatchType } from './patch';
import VNode from '../vnode';
import helper from '../../helper';

export default function (now: VNode, old: VNode) {
  let type: PatchType;

  if (old.el) {
    now.el = old.el;
    now.text != old.text && (now.el.textContent = now.text);
    type = PatchType.UPDATE;
  } else {
    now.el = helper.dom.createText(now.text);
    type = PatchType.ADD;
  }

  return {
    type,
    vnode: now,
  };
}