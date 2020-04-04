import VNode from '../vnode';

enum PatchType {
  ADD,
  DEL,
  UPDATE,
  BATCH,
  NONE,
}

interface Patch {
  type: PatchType,
  vnode: VNode,
}

export {
  Patch,
  PatchType,
}