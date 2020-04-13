import VNode, { EMPTY_VNODE } from './vnode';
import Compiler from '../compiler';
import helper from '../helper';
import config from '../config';

function $l(obj: any, fn: Function): VNode {
  return {
    children: helper.util.map(obj, fn).filter((vnode) => vnode !== EMPTY_VNODE)
  };
}

function $n(node: string, options: VNode, children: VNode[]): VNode {
  let component = this.$components[node];

  return {
    node,
    ...options,
    children: children,
    componentOptions: component,
  };
}

function $t(text: string) {
  return {
    text
  };
}

function $m(comment: string) {
  return {
    isComment: true,
    text: comment
  };
}

function pick(vnode: VNode) {
  let logics = {}, events = {}, props = {}, dataset = {};

  for (let key in vnode.props) {
    let val = vnode.props[key];

    if (key.indexOf(config.logo + '-') == 0) {
      logics[key.substr(config.logo.length + 1)] = val;
    } else if (key.indexOf(config.prefixs.event) == 0) {
      events[key.substr(config.prefixs.event.length)] = `"${val}"`;
    } else if (key.indexOf(config.prefixs.bind) == 0) {
      props[key.substr(config.prefixs.bind.length)] = val;
    } else if (key.indexOf(config.prefixs.data) == 0) {
      dataset[key.substr(config.prefixs.data.length)] = val;
    } else {
      props[key] = JSON.stringify(val);
    }
  }

  props['dataset'] = dataset;
  
  return {
    logics,
    events,
    props,
  };
}

function stringify(str: string, format: boolean = false): string {
  return str
          .replace(/[\s]+/g, ' ')
          .replace(new RegExp(config.delimitter[0], 'g'), `" + ${format ? 'JSON.stringify' : ''}(`)
          .replace(new RegExp(config.delimitter[1], 'g'), ') + "');
}

function nodeSerialize(vnode: VNode) {
  let expression: string;
  let { logics, events, props } = pick(vnode);
  let _for = logics['for'], _if = logics['if'], _elseif = logics['elseif'] || logics['else-if'], _else = logics['else'];
  let index = logics['for-index'] || '$index', item = logics['for-item'] || '$item';

  expression = `_$n("${vnode.node}", {
      ${_for && logics['key'] ? 'key: ' + logics['key'] + ',' : ''}
      props: ${helper.util.obj2str(props)},
      events: ${helper.util.obj2str(events)},
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
  let expression: string;

  if (vnode.node) {
    expression = nodeSerialize(vnode);
  } else if (vnode.isComment) {
    expression = `_$m(${JSON.stringify(vnode.text)})`;
  } else if (vnode.text) {
    expression = `_$t("${stringify(vnode.text, true)}")`;
  }

  return expression;
}

export default function makeVNodeFn(template: string, context: any): any {
  if (!template) return function() {};

  let compiler = new Compiler(template);
  let data: VNode = compiler.analyse();

  compiler = null;

  if (!data || data.children.length == 0) {
    throw new Error(`instance must be a root element!\r\n ${template}`);
  } else if (data.children.length > 1) {
    throw new Error(`template\'s root must be only one !\r\n ${template}`);
  }

  let props = helper.util.keys(context.props);
  let methods = helper.util.keys(context.methods);
  let computed = helper.util.keys(context.computed);
  let datas = helper.util.keys(typeof context.data == 'function' ? context.data.call({}) : (context.data || {}));
  let vars: string = props.concat(methods, datas, computed).map((key) => `${key} = this.${key}`).join(', ');

  return (new Function('_$l', '_$n', '_$t', '_$m', '_$e', `
    return function() {
      ${vars != '' ? `var ${vars};` : ''};
      _$n = _$n.bind(this);
      return ${serialize(data.children[0])};
    };
  `))($l, $n, $t, $m, EMPTY_VNODE);
}