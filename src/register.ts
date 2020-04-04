import { OptionsData } from './options';
import { makeVNodeFn } from './vnode';

const COMPONENT_NAME_TEST = /[a-z][a-z0-9]*(-[a-z]+)+/;
const COMPONENTS = {};

export default function (name: string, options?: OptionsData): OptionsData {
  if (!options) return COMPONENTS[name];
  if (!COMPONENT_NAME_TEST.test(name)) throw new Error(`Component[${name}] is not valid, please register a correct component such as [xx-xx]`);
  return COMPONENTS[name] = options;
};