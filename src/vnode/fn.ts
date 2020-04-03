import { Options, VNode, EMPTY_VNODE } from '../interface';
import Helper from '../helper';
import Compiler from '../compiler';
import register from '../register';
import Pizza from '../pizza';

const LOGICS = ['v-if', 'v-else-if', 'v-else', 'v-for', 'v-for-index', 'v-for-item', 'v-key'];
const EVENT_PREFIX = /^(?:v-on:|@)/;
const BIND_PREFIX = /^(?:v-bind)?:/;
const COMPONENT_PREFIX = 'pizza-';
const DELIMITTER = {
  start: /{{/g,
  end: /}}/g
};

function $l(obj: any, fn): VNode {
  return {
    isCopy: true,
    children: [].map.call(obj, fn).filter((vnode) => vnode !== EMPTY_VNODE)
  };
}

function $n(node: string, options: VNode | Options, children: VNode[]): VNode | Options {
  let component = this.$components[node] || register(node);

  if (component && !component.render) {
    component.render = makeVNodeFn(component.template, component);
  } 

  return {
    node: component ? `${COMPONENT_PREFIX}${node}` : node,
    ...options,
    children: children,
    componentOptions: component,
  };
}

function $t(text: string) {
  return {
    text,
  };
}

function $m(comment: string) {
  return {
    isComment: true,
    text: comment,
  };
}

function pick(vnode: VNode) {
  let logics = {}, events = {}, props = {};

  for (let key in vnode.props) {
    let val = vnode.props[key];

    if (LOGICS.indexOf(key) > -1) {
      logics[key] = val;
    } else if (EVENT_PREFIX.test(key)) {
      events[key.replace(EVENT_PREFIX, '')] = val;
    } else if (BIND_PREFIX.test(key)) {
      props[key.replace(BIND_PREFIX, '')] = val;
    } else {
      props[key] = JSON.stringify(val);
    }
  }

  return {
    logics,
    events,
    props
  };
}

function stringify(str: string): string {
  return str.replace(/[\s]+/g, ' ').replace(DELIMITTER.start, '" + (').replace(DELIMITTER.end, ') + "');
}

function nodeSerialize(vnode: VNode) {
  let expression: string;
  let { logics, events, props } = pick(vnode);
  let _for = logics['v-for'], _if = logics['v-if'], _elseif = logics['v-else-if'], _else = logics['v-else'];
  let index = logics['v-for-index'] || '$index', item = logics['v-for-item'] || '$item';

  expression = `_$n("${vnode.node}", {
      ${_for && logics['v-key'] ? 'key: ' + logics['v-key'] + ',' : ''}
      props: ${Helper.util.obj2str(props)},
      events: ${Helper.util.obj2str(events)},
    }, [${vnode.children.map((child, i) => serialize(child))}])`;

  if (_if) {
    expression = `${_if} ? ${expression} : _$e`;
  } else if (_elseif) {
    expression = ` && ${_elseif} ? ${expression} : _$e`;
  } else if (_else) {
    expression = ` && ${expression}`;
  }

  if (_for) {
    expression = `_$l(${_for}, function(${item}, ${index}) { return ${expression}; })`;
  }

  return expression;
}

function serialize(vnode: VNode): string {
  let expression;

  if (vnode.node) {
    expression = nodeSerialize(vnode);
  } else if (vnode.isComment) {
    expression = `_$m(${JSON.stringify(vnode.text)})`;
  } else if (vnode.text) {
    expression = `_$t("${stringify(vnode.text)}")`;
  }

  return expression;
}

export default function makeVNodeFn (template: string, context: Options): any {
  if (context.render) return context.render;

  let compiler = new Compiler(template);
  let data: VNode = compiler.analyse();

  compiler = null;
  
  if (!data || data.children.length == 0) {
    throw new Error('instance must be a root element!');
  } else if (data.children.length > 1) {
    throw new Error(`template\'s root must be only one !\r\n ${template}`);
  }

  let vars: string = ['props', 'data', 'methods']
    .reduce((a, b) => {
      return a.concat(Helper.util.keys(context[b]));
    }, [])
    .map((key) => `${key} = this.${key}`).join(', ')
    ;
    
  context.render = (new Function('_$l', '_$n', '_$t', '_$m', '_$e', '_$cs', `
    return function() {
      ${vars != '' ? `var ${vars};` : ''};
      _$n = _$n.bind(this);
      return ${serialize(data.children[0])};
    };
  `))($l, $n, $t, $m, EMPTY_VNODE);

  return context.render;
}