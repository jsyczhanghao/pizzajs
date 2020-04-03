import { VNode, PatchType } from "../../interface";
import Helper from '../../helper';

export default function (now: VNode, old: VNode) {
  let type: PatchType;

  if (!old.el) {
    now.el = Helper.dom.createComment(now.text);
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