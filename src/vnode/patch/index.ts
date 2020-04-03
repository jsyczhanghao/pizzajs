import { VNode, Patch, PatchType, EMPTY_VNODE } from '../../interface';
import Helper from '../../helper';
import patchComponent from './component';
import patchNode from './node';
import patchText from './text';
import patchComment from './comment';

function del(old) {
  if (!old) return false;
  old.componentInstance && old.componentInstance.$destroy();
  Helper.dom.remove(old.el);
  old.el = null;
  return old;
}

function children2keys(children) : object | VNode[] {
  let first = children[0], keysChildren = {};

  if (!first || first.key == null) return children;

  children.forEach((child: VNode) => {
    keysChildren[child.key] = child;
  });

  return keysChildren;
}

function pick(children, key: string | number) {
  let child = children[key];
  delete children[key];
  return child;
}

function patchChildren(now: VNode, old: VNode) {
  let elIndex = 0, oldChildren = children2keys(old.children || []), template: any;

  Helper.util.each(now.children, (child: VNode, i: number) => {
    let oldChild = pick(oldChildren, child.key || i);
    let patch: Patch = patchVNode(child, oldChild);

    switch (patch.type) {
      case PatchType.ADD:
        Helper.dom.insert(now.el, child.el, elIndex);
        break;

      case PatchType.BATCH:
        Helper.dom.insert(now.el, child.el, elIndex);
        elIndex += child.el.childNodes.length;
       return;

      case PatchType.DEL:
        del(oldChild);
        return ;
    }

    elIndex++;
  });

  Helper.util.each(oldChildren, del);
}

function patchVNode(now: VNode, old: VNode = {}): Patch {
  let patch: Patch;

  do {
    if (now.componentOptions) {
      patch = patchComponent(now, old);
    } else if (now.node) {
      patch = patchNode(now, old);
    } else if (now.isComment) {
      patch = patchComment(now, old);
      break;
    } else if (now.text) {
      patch = patchText(now, old);
      break;
    } else if (now.isCopy) {
      now.el = Helper.dom.fragment();
      patch = { vnode: now, type: PatchType.BATCH };
    } else if (now == EMPTY_VNODE) {
      patch = { vnode: old, type: PatchType.DEL };
      break;
    } else {
      patch = { vnode: now, type: PatchType.NONE};
    }

    patchChildren(now, old);
  } while (0);

  return patch;
}

export default function (now: VNode, old: VNode = {}): VNode {
  return patchVNode(now, old).vnode;
}