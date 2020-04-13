import helper from "./helper";
import makeVNodeFn from "./vnode/fn";

interface Lifetimes {
  created?: Function;
  mounted?: Function;
  updated?: Function;
  destroyed?: Function;
}

interface OptionsData {
  props?: object;
  data?: object | Function;
  lifetimes?: Lifetimes;
  methods?: object;
  watch?: object;
  components?: object;
  template?: string;
  style?: string;
  render?: Function;
}

class Options {
  private _: any;
  props: object;
  data: object | Function;
  lifetimes: Lifetimes;
  methods: object;
  watch: object;
  computed: object;
  components: object;
  template: string;
  style: string;
  render: Function;

  constructor(options: any) {
    this._ = options;
    this.props = options.props || {};
    this.data = options.data || {};
    this.lifetimes = options.lifetimes || {};
    this.methods = options.methods || {};
    this.watch = options.watch || {};
    this.computed = options.computed || {};
    this.style = options.style;
    this.components = options.components = helper.util.camelKeys2ul(options.components);
    this.render = options.render = options.render || makeVNodeFn(options.template, options);
  }
}

export default Options;
export {
  OptionsData,
  Lifetimes,
};