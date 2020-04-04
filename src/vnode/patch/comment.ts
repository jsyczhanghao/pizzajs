import { Patch, PatchType } from './patch';
import VNode from '../vnode';
import helper from '../../helper';

export default function (now: VNode, old: VNode) {
  let type: PatchType;

  if (!old.el) {
    now.el = helper.dom.createComment(now.text);
    type = PatchType.ADD;
  } else {
    now.el = old.el;
    type = PatchType.NONE;
  }

  return {
    type,
    vnode: now,
  };
}