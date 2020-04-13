import { PatchType } from './patch';
import VNode from '../vnode';
export default function (now: VNode, old: VNode): {
    type: PatchType.ADD | PatchType.UPDATE;
    vnode: VNode;
};
