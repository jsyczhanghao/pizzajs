import Options from "./options";
import Pizza from "../pizza";
export default interface VNode {
    readonly key?: string | number;
    readonly node?: string;
    readonly text?: string;
    readonly props?: object;
    readonly children?: VNode[];
    readonly events?: object;
    readonly componentOptions?: Options;
    componentInstance?: Pizza;
    readonly isComment?: boolean;
    readonly isCopy?: boolean;
    el?: any;
}
export declare const EMPTY_VNODE: {};
