import { VNode } from './vnode';
declare class Compiler {
    readonly html: string;
    stack: VNode[];
    now: VNode;
    private static REGEXP;
    private static ATTR_REPEXP;
    constructor(html: string);
    analyse(): VNode;
    protected collect(comment?: string, node?: string, props?: string, single?: string, close?: string, text?: string): boolean;
    protected collectAttrs(str: string): object;
}
export default Compiler;
