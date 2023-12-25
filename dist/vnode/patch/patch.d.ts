import VNode from '../vnode';
declare enum PatchType {
    ADD = 0,
    DEL = 1,
    UPDATE = 2,
    BATCH = 3,
    NONE = 4,
    REPLACE = 5
}
interface Patch {
    type: PatchType;
    vnode: VNode;
}
export { Patch, PatchType, };
