import { VNode } from './vnode';

class Compiler {
  readonly html: string;
  stack: VNode[];
  now: VNode = { children: [] };

  private static REGEXP: RegExp = /<!--((?:(?!-->)[\s\S])*?)-->|<([a-z]+(?:(?:-[a-z]+)+)?)(\s[\s\S]+?)?(\s*\/)?>|<\/([a-z]+(?:(?:-[a-z]+)+)?)>|([\s\S]+?)(?=<|$)/ig;
  private static ATTR_REPEXP: RegExp = /\s*([^\s"=>\/]+)(?:="([^"]+)")?/g;

  constructor(html: string) {
    this.html = html;
    this.stack = [this.now];
  }

  analyse(): VNode {
    if (!this.html) return null;

    var match: RegExpExecArray;

    while (match = Compiler.REGEXP.exec(this.html)) {
      if (!this.collect(...match.slice(1))) {
        throw new Error(`template parsing error, not a valid structure ~\r\n[${match.index}]: ${match[0]}\r\n${this.html}`);
      }
    }

    return this.now;
  }

  protected collect(comment?: string, node?: string, props?: string, single?: string, close?: string, text?: string): boolean {
    do {
      if (node) {
        let vnode: VNode = {
          node: node.toLocaleLowerCase(),
          props: this.collectAttrs(props),
          children: [],
        };

        !single && this.stack.push(vnode);
        this.now.children.push(vnode);
      } else if (close) {
        if (close.toLocaleLowerCase() != this.now.node) {
          break;
        } else {
          this.stack.pop();
        }
      } else if (comment) {
        this.now.children.push({
          isComment: true,
          text: comment
        });
      } else if (text.trim()) {
        this.now.children.push({
          text: text,
        });
      }

      this.now = this.stack[this.stack.length - 1];
      return true;
    } while (0);

    return false;
  }

  protected collectAttrs(str: string): object {
    var attrs: object = {};

    if (str) {
      let match: RegExpExecArray;

      while (match = Compiler.ATTR_REPEXP.exec(str)) {
        attrs[match[1]] = match[2] == null ? match[1] : match[2];
      }
    }

    return attrs;
  }
}

export default Compiler;