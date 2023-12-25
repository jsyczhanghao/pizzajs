import { Patch, PatchType } from './patch';
import VNode, { EMPTY_VNODE } from '../vnode';
import helper from '../../helper';
import patchComponent from './component';
import patchNode from './node';
import patchText from './text';
import patchComment from './comment';

function del(old) {
  if (!old) return false;

  if (helper.dom.isFragment(old.el)) {
    old.children.forEach(del);
  } else {
    helper.dom.remove(old.el);
  }

  old.componentInstance && old.componentInstance.$destroy();
  old.el = old.componentInstance = null;
  return old;
}

function children2keys(children): object | VNode[] {
  let first = children[0], keysChildren = {};

  if (!first || first.key == null) return children.slice(0);

  children.forEach((child: VNode) => {
    keysChildren[child.key] = child;
  });

  return keysChildren;
}

function pick(children, key: string | number) {
  let child = children[key];
  children[key] = null;
  return child;
}

function patchChildren(now: VNode, old: VNode, context: any) {
  let elIndex = 0, oldChildren = children2keys(old?.children || []);

  helper.util.map(now.children, (child: VNode, i: number) => {
    let oldChild = pick(oldChildren, child.key || i);
    let patch: Patch = patchVNode(child, oldChild, context);

    switch (patch.type) {
      case PatchType.BATCH:
        // if empty, by fragment create
        if (!oldChild?.children?.length) {
          let len = child.children.length;
          helper.dom.insert(now.el, child.el, elIndex);
          elIndex += len;
        } else {
          // else insert one by one
          child.children.forEach((item) => {
            helper.dom.insert(now.el, item.el, elIndex++);
          });
        }

        return;

      case PatchType.REPLACE:
        if (helper.dom.isFragment(oldChild.el)) {
          helper.dom.insert(now.el, child.el, elIndex);
          elIndex -= oldChild.children.length;
          del(oldChild);
        } else {
          
          helper.dom.replace(oldChild.el, child.el);
          del(oldChild);
        }

        break;

      case PatchType.DEL:
        del(oldChild);
        return;

      case PatchType.ADD:
        helper.dom.insert(now.el, child.el, elIndex);
        break;

      default:
        break;
    }

    elIndex++;
  });
  
  helper.util.map(oldChildren, del);
}

function patchVNode(now: VNode, old: VNode = {}, context: any): Patch {
  let patch: Patch;

  do {
    if (now.componentOptions) {
      patch = patchComponent(now, old, context);
      now.componentInstance.$children = now.children;
    } else if (now.node) {
      patch = patchNode(now, old, context);
    } else if (now.isComment) {
      patch = patchComment(now, old);
      break;
    } else if (now.text) {
      patch = patchText(now, old);
      break;
    } else if (now == EMPTY_VNODE) {
      patch = { vnode: old, type: PatchType.DEL };
      break;
    } else if (!now.el && now.children) {
      now.el = helper.dom.fragment();
      patch = { vnode: now, type: PatchType.BATCH };
    } else {
      patch = { vnode: now, type: PatchType.NONE };
    }

    patchChildren(now, patch.type === PatchType.REPLACE ? {} : old, context);
  } while (0);

  return patch;
}

export default function (now: VNode, old: VNode = {}, context: any): VNode {
  return patchVNode(now, old, context).vnode;
}