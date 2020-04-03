import { VNode, PatchType } from "../../interface";
import Helper from '../../helper';

export default function (now: VNode, old: VNode) {
  let type: PatchType;
  
  if (old.el) {
    now.el = old.el;
    now.text != old.text && (now.el.textContent = now.text);
    type = PatchType.UPDATE;
  } else {
    now.el = Helper.dom.createText(now.text);
    type = PatchType.ADD;
  }

  return {
    type,
    vnode: now,
  };
}