import { VNode, PatchType } from "../../interface";
export default function (now: VNode, old: VNode): {
    type: PatchType.ADD | PatchType.UPDATE;
    vnode: VNode;
};
