
import Options, { OptionsData } from "../options";
import Pizza from "../pizza";

export default interface VNode {
  readonly key?: string | number;
  readonly node?: string;
  readonly text?: string;
  readonly props?: object;
  readonly children?: VNode[];
  readonly events?: object;
  readonly componentOptions?: OptionsData;
  componentInstance?: Pizza;
  readonly context?: Pizza;
  readonly isComment?: boolean;
  el?: any;
}

export const EMPTY_VNODE = {};