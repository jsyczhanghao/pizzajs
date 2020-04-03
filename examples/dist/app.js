(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var EMPTY_VNODE = {};
    //# sourceMappingURL=vnode.js.map

    var PatchType;
    (function (PatchType) {
        PatchType[PatchType["ADD"] = 0] = "ADD";
        PatchType[PatchType["DEL"] = 1] = "DEL";
        PatchType[PatchType["UPDATE"] = 2] = "UPDATE";
        PatchType[PatchType["BATCH"] = 3] = "BATCH";
        PatchType[PatchType["NONE"] = 4] = "NONE";
    })(PatchType || (PatchType = {}));
    //# sourceMappingURL=patch.js.map

    var util = {
        proxy: function (context, object, getter, setter) {
            this.keys(object).forEach(function (key) {
                Object.defineProperty(context, key, __assign({ get: function () { return getter.call(context, key); } }, (setter ? { set: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return setter.call.apply(setter, __spreadArrays([context, key], args));
                    } } : {})));
            });
        },
        debounce: function (fn, wait) {
            var timer;
            return function () {
                var _this = this;
                var args = arguments;
                if (timer)
                    clearTimeout(timer);
                timer = setTimeout(function () { return fn.apply(_this, args); }, wait);
            };
        },
        obj2str: function (obj) {
            return '{' + Object.keys(obj).map(function (key) { return "\"" + key + "\": " + obj[key]; }).join(',') + '}';
        },
        each: function (obj, fn) {
            if (obj === void 0) { obj = []; }
            if ('length' in obj) {
                [].forEach.call(obj, fn);
            }
            else {
                for (var key in obj) {
                    fn.call(obj, obj[key], key);
                }
            }
        },
        keys: function (object) {
            if (object === void 0) { object = {}; }
            return Object.keys(object);
        },
        camel2ul: function (str) {
            return str.replace(/[A-Z]/, function (all, index) { return (index == 0 ? '' : '-') + all.toLowerCase(); });
        },
        camelKeys2ul: function (object) {
            if (object === void 0) { object = {}; }
            var _ = {};
            for (var key in object) {
                _[this.camel2ul(key)] = object[key];
            }
            return _;
        },
        same: function (a, b) {
            if (b === void 0) { b = {}; }
            for (var key in a) {
                if (a[key] !== b[key])
                    return false;
            }
            return true;
        }
    };
    //# sourceMappingURL=util.js.map

    var dom = {
        createElement: function (node) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.updateElement.apply(this, __spreadArrays([document.createElement(node)], args));
        },
        updateElement: function (node, attrs, listeners) {
            var _this = this;
            //@ts-ignore
            attrs && util.each(attrs, function (val, key) { return key == 'value' ? (node.value = val) : _this.setAttr(node, key, val); });
            listeners && util.each(listeners, function (fn, key) { return _this.on(node, key, fn); });
            return node;
        },
        setAttr: function (node, name, value) {
            node.setAttribute(name, value);
        },
        on: function (node, name, fn) {
            var $$listeners = node['$$listeners'] || {};
            $$listeners[name] = fn;
            node.addEventListener(name, function (e) {
                $$listeners[name] && $$listeners[name].call(node, e);
            }, false);
            node['$$listeners'] = $$listeners;
        },
        off: function (node, name) {
            var $$listeners = node['$$listeners'] || {};
            delete $$listeners[name];
            node['$$listeners'] = $$listeners;
        },
        fragment: function () {
            return document.createDocumentFragment();
        },
        createText: function (text) {
            return document.createTextNode(text);
        },
        createComment: function (comment) {
            if (comment === void 0) { comment = ''; }
            return document.createComment(comment);
        },
        insert: function (parent, el, index) {
            var children = parent.childNodes;
            return children.length == 0 || children.length < index ? parent.appendChild(el) : parent.insertBefore(el, children[index]);
        },
        remove: function (el) {
            el && el.remove();
        }
    };
    //# sourceMappingURL=dom.js.map

    var Helper = {
        util: util,
        dom: dom,
    };
    //# sourceMappingURL=index.js.map

    var Compiler = /** @class */ (function () {
        function Compiler(html) {
            this.now = { children: [] };
            this.html = html;
            this.stack = [this.now];
        }
        Compiler.prototype.analyse = function () {
            if (!this.html)
                return null;
            var match;
            while (match = Compiler.REGEXP.exec(this.html)) {
                if (!this.collect.apply(this, match.slice(1))) {
                    throw new Error("template parsing error, not a valid structure ~\r\n[" + match.index + "]: " + match[0] + "\r\n" + this.html);
                }
            }
            return this.now;
        };
        Compiler.prototype.collect = function (comment, node, props, single, close, text) {
            do {
                if (node) {
                    var vnode = {
                        node: node.toLocaleLowerCase(),
                        props: this.collectAttrs(props),
                        children: [],
                    };
                    !single && this.stack.push(vnode);
                    this.now.children.push(vnode);
                }
                else if (close) {
                    if (close.toLocaleLowerCase() != this.now.node) {
                        break;
                    }
                    else {
                        this.stack.pop();
                    }
                }
                else if (comment) {
                    this.now.children.push({
                        isComment: true,
                        text: comment || ' ',
                    });
                }
                else if (text.trim()) {
                    this.now.children.push({
                        text: text,
                    });
                }
                this.now = this.stack[this.stack.length - 1];
                return true;
            } while (0);
            return false;
        };
        Compiler.prototype.collectAttrs = function (str) {
            var attrs = {};
            if (str) {
                var match = void 0;
                while (match = Compiler.ATTR_REPEXP.exec(str)) {
                    attrs[match[1].toLocaleLowerCase()] = match[2];
                }
            }
            return attrs;
        };
        Compiler.REGEXP = /<!--((?:(?!-->)[\s\S])*?)-->|<([a-z]+(?:(?:-[a-z]+)+)?)([^<>]+?)?(\s*\/)?>|<\/([a-z]+(?:(?:-[a-z]+)+)?)>|([\s\S]+?)(?=<|$)/ig;
        Compiler.ATTR_REPEXP = /\s*(\S+?)="([^"]+)"/g;
        return Compiler;
    }());
    //# sourceMappingURL=compiler.js.map

    var COMPONENT_NAME_TEST = /[a-z][a-z0-9]*(-[a-z]+)+/;
    var COMPONENTS = {};
    function register (name, options) {
        if (!options)
            return COMPONENTS[name];
        if (!COMPONENT_NAME_TEST.test(name))
            throw new Error("Component[" + name + "] is not valid, please register a correct component such as [xx-xx]");
        var Component = COMPONENTS[name] = options;
        if (Component.template) {
            Component.render = makeVNodeFn(Component.template, Component);
        }
    }
    //# sourceMappingURL=register.js.map

    var LOGICS = ['v-if', 'v-else-if', 'v-else', 'v-for', 'v-for-index', 'v-for-item', 'v-key'];
    var EVENT_PREFIX = /^(?:v-on:|@)/;
    var BIND_PREFIX = /^(?:v-bind)?:/;
    var COMPONENT_PREFIX = 'pizza-';
    var DELIMITTER = {
        start: /{{/g,
        end: /}}/g
    };
    function $l(obj, fn) {
        return {
            isCopy: true,
            children: [].map.call(obj, fn).filter(function (vnode) { return vnode !== EMPTY_VNODE; })
        };
    }
    function $n(node, options, children) {
        var component = this.$components[node] || register(node);
        if (component && !component.render) {
            component.render = makeVNodeFn(component.template, component);
        }
        return __assign(__assign({ node: component ? "" + COMPONENT_PREFIX + node : node }, options), { children: children, componentOptions: component });
    }
    function $t(text) {
        return {
            text: text,
        };
    }
    function $m(comment) {
        return {
            isComment: true,
            text: comment,
        };
    }
    function pick(vnode) {
        var logics = {}, events = {}, props = {};
        for (var key in vnode.props) {
            var val = vnode.props[key];
            if (LOGICS.indexOf(key) > -1) {
                logics[key] = val;
            }
            else if (EVENT_PREFIX.test(key)) {
                events[key.replace(EVENT_PREFIX, '')] = val;
            }
            else if (BIND_PREFIX.test(key)) {
                props[key.replace(BIND_PREFIX, '')] = val;
            }
            else {
                props[key] = JSON.stringify(val);
            }
        }
        return {
            logics: logics,
            events: events,
            props: props
        };
    }
    function stringify(str) {
        return str.replace(/[\s]+/g, ' ').replace(DELIMITTER.start, '" + (').replace(DELIMITTER.end, ') + "');
    }
    function nodeSerialize(vnode) {
        var expression;
        var _a = pick(vnode), logics = _a.logics, events = _a.events, props = _a.props;
        var _for = logics['v-for'], _if = logics['v-if'], _elseif = logics['v-else-if'], _else = logics['v-else'];
        var index = logics['v-for-index'] || '$index', item = logics['v-for-item'] || '$item';
        expression = "_$n(\"" + vnode.node + "\", {\n      " + (_for && logics['v-key'] ? 'key: ' + logics['v-key'] + ',' : '') + "\n      props: " + Helper.util.obj2str(props) + ",\n      events: " + Helper.util.obj2str(events) + ",\n    }, [" + vnode.children.map(function (child, i) { return serialize(child); }) + "])";
        if (_if) {
            expression = _if + " ? " + expression + " : _$e";
        }
        else if (_elseif) {
            expression = " && " + _elseif + " ? " + expression + " : _$e";
        }
        else if (_else) {
            expression = " && " + expression;
        }
        if (_for) {
            expression = "_$l(" + _for + ", function(" + item + ", " + index + ") { return " + expression + "; })";
        }
        return expression;
    }
    function serialize(vnode) {
        var expression;
        if (vnode.node) {
            expression = nodeSerialize(vnode);
        }
        else if (vnode.isComment) {
            expression = "_$m(" + JSON.stringify(vnode.text) + ")";
        }
        else if (vnode.text) {
            expression = "_$t(\"" + stringify(vnode.text) + "\")";
        }
        return expression;
    }
    function makeVNodeFn(template, context) {
        if (context.render)
            return context.render;
        var compiler = new Compiler(template);
        var data = compiler.analyse();
        compiler = null;
        if (!data || data.children.length == 0) {
            throw new Error('instance must be a root element!');
        }
        else if (data.children.length > 1) {
            throw new Error("template's root must be only one !\r\n " + template);
        }
        var vars = ['props', 'data', 'methods']
            .reduce(function (a, b) {
            return a.concat(Helper.util.keys(context[b]));
        }, [])
            .map(function (key) { return key + " = this." + key; }).join(', ');
        context.render = (new Function('_$l', '_$n', '_$t', '_$m', '_$e', '_$cs', "\n    return function() {\n      " + (vars != '' ? "var " + vars + ";" : '') + ";\n      _$n = _$n.bind(this);\n      return " + serialize(data.children[0]) + ";\n    };\n  "))($l, $n, $t, $m, EMPTY_VNODE);
        return context.render;
    }
    //# sourceMappingURL=fn.js.map

    function on(instance, events) {
        if (events === void 0) { events = {}; }
        Helper.util.each(events, function (event, name) {
            instance.$on("props:" + name, event);
        });
    }
    function patchComponent (now, old) {
        var instance = old.componentInstance, type;
        if (!instance) {
            now.el = Helper.dom.createElement(now.node, __assign({}, (now.props.slot ? { slot: now.props.slot } : {})));
            now.el.$root = now.el.attachShadow({ mode: 'closed' });
            instance = new Pizza(__assign(__assign({}, now.componentOptions), { propsData: now.props }));
            on(instance, now.events);
            instance.$mount(now.el.$root);
            type = PatchType.ADD;
        }
        else if (!Helper.util.same(now.props, old.props)) {
            now.el = old.el;
            instance.$propsData = now.props;
            instance.$off('props:');
            on(instance, now.events);
            instance.$update();
            type = PatchType.UPDATE;
        }
        else {
            now.el = old.el;
            type = PatchType.NONE;
        }
        now.componentInstance = instance;
        return {
            type: type,
            vnode: now,
        };
    }
    //# sourceMappingURL=component.js.map

    function patchNode (now, old) {
        var type;
        if (!old.el) {
            now.el = Helper.dom.createElement(now.node, now.props, now.events);
            type = PatchType.ADD;
        }
        else if (!Helper.util.same(now.props, old.props)) {
            now.el = Helper.dom.updateElement(old.el, now.props, now.events);
            type = PatchType.UPDATE;
        }
        else {
            now.el = old.el;
            type = PatchType.NONE;
        }
        return {
            type: type,
            vnode: now,
        };
    }
    //# sourceMappingURL=node.js.map

    function patchText (now, old) {
        var type;
        if (old.el) {
            now.el = old.el;
            now.text != old.text && (now.el.textContent = now.text);
            type = PatchType.UPDATE;
        }
        else {
            now.el = Helper.dom.createText(now.text);
            type = PatchType.ADD;
        }
        return {
            type: type,
            vnode: now,
        };
    }
    //# sourceMappingURL=text.js.map

    function patchComment (now, old) {
        var type;
        if (!old.el) {
            now.el = Helper.dom.createComment(now.text);
            type = PatchType.ADD;
        }
        else {
            now.el = old.el;
            type = PatchType.NONE;
        }
        return {
            type: type,
            vnode: now,
        };
    }
    //# sourceMappingURL=comment.js.map

    function del(old) {
        if (!old)
            return false;
        old.componentInstance && old.componentInstance.$destroy();
        Helper.dom.remove(old.el);
        old.el = null;
        return old;
    }
    function children2keys(children) {
        var first = children[0], keysChildren = {};
        if (!first || first.key == null)
            return children;
        children.forEach(function (child) {
            keysChildren[child.key] = child;
        });
        return keysChildren;
    }
    function pick$1(children, key) {
        var child = children[key];
        delete children[key];
        return child;
    }
    function patchChildren(now, old) {
        var elIndex = 0, oldChildren = children2keys(old.children || []);
        Helper.util.each(now.children, function (child, i) {
            var oldChild = pick$1(oldChildren, child.key || i);
            var patch = patchVNode(child, oldChild);
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
                    return;
            }
            elIndex++;
        });
        Helper.util.each(oldChildren, del);
    }
    function patchVNode(now, old) {
        if (old === void 0) { old = {}; }
        var patch;
        do {
            if (now.componentOptions) {
                patch = patchComponent(now, old);
            }
            else if (now.node) {
                patch = patchNode(now, old);
            }
            else if (now.isComment) {
                patch = patchComment(now, old);
                break;
            }
            else if (now.text) {
                patch = patchText(now, old);
                break;
            }
            else if (now.isCopy) {
                now.el = Helper.dom.fragment();
                patch = { vnode: now, type: PatchType.BATCH };
            }
            else if (now == EMPTY_VNODE) {
                patch = { vnode: old, type: PatchType.DEL };
                break;
            }
            else {
                patch = { vnode: now, type: PatchType.NONE };
            }
            patchChildren(now, old);
        } while (0);
        return patch;
    }
    function vnodePatch (now, old) {
        if (old === void 0) { old = {}; }
        return patchVNode(now, old).vnode;
    }
    //# sourceMappingURL=index.js.map

    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.$events = {};
        }
        EventEmitter.prototype.$on = function (name, fn) {
            var _a;
            var events = (_a = this.$events[name]) !== null && _a !== void 0 ? _a : [];
            events.push(fn);
            this.$events[name] = events;
        };
        EventEmitter.prototype.$emit = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (this.$events[name] || []).forEach(function (fn) { return fn.apply(_this, args); });
        };
        EventEmitter.prototype.$off = function (name) {
            var _this = this;
            if (/:$/.test(name)) {
                Helper.util.each(this.$events, function (events, key) {
                    key.indexOf(name) == 0 && delete _this.$events[key];
                });
            }
            else {
                delete this.$events[name];
            }
        };
        return EventEmitter;
    }());
    //# sourceMappingURL=event.js.map

    var Pizza = /** @class */ (function (_super) {
        __extends(Pizza, _super);
        function Pizza(options) {
            var _this = _super.call(this) || this;
            _this.$mounted = false;
            _this.$destroyed = false;
            _this._nextFns = [];
            _this.$update = Helper.util.debounce(function () {
                if (!this.$mounted || this.$destroyed)
                    return false;
                this._render();
                this.$emit('hook:updated');
            }, 10);
            _this.$options = options || {};
            _this.$propsData = options.propsData || {};
            _this.$data = options.data || {};
            _this.$methods = options.methods || {};
            _this.$components = Helper.util.camelKeys2ul(options.components);
            _this._init();
            return _this;
        }
        Pizza.prototype._init = function () {
            //inject lifecycles hook
            this._injectHooks();
            //proxy methods and data
            Helper.util.proxy(this, this.$options.props, this.$get);
            Helper.util.proxy(this, this.$methods, this.$get);
            Helper.util.proxy(this, this.$data, this.$get, this.$set);
            //create renderFn
            this._vnodeFn = this.$options.render ? this.$options.render : makeVNodeFn(this.$options.template, this.$options);
            this.$emit('hook:created');
        };
        Pizza.prototype.$set = function (key, value) {
            if (!(key in this.$data) || value === this.$data[key])
                return;
            this.$data[key] = value;
            this.$update();
        };
        Pizza.prototype.$get = function (key, _default) {
            var _this = this;
            var _a, _b;
            if (this.$methods[key]) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.$invoke.apply(_this, __spreadArrays([key], args));
                };
            }
            return (_b = (_a = this.$propsData[key]) !== null && _a !== void 0 ? _a : this.$data[key]) !== null && _b !== void 0 ? _b : _default;
        };
        Pizza.prototype._injectHooks = function () {
            var _this = this;
            Helper.util.each(this.$options.lifecyles, function (fn, lifecycle) { return _this.$on("hook:" + lifecycle, fn); });
        };
        Pizza.prototype.$emit = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _super.prototype.$emit.apply(this, __spreadArrays([name], args));
            _super.prototype.$emit.apply(this, __spreadArrays(["props:" + name], args));
        };
        Pizza.prototype.$invoke = function (key) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.$methods[key]).call.apply(_a, __spreadArrays([this], args));
        };
        Pizza.prototype.$nextTick = function (fn) {
            this._nextFns.push(fn);
        };
        Pizza.prototype._render = function () {
            var _this = this;
            var vnode = this._vnodeFn();
            if (this._mountElement) {
                vnode = { el: this._mountElement, children: [vnode] };
            }
            this._vnode = vnodePatch(vnode, this._vnode);
            this._nextFns.forEach(function (fn) { return fn.call(_this); });
            this._nextFns.length = 0;
        };
        Pizza.prototype.$mount = function (element) {
            if (this.$mounted)
                return false;
            if (element) {
                element.innerHTML = '';
                this._mountElement = element;
            }
            this._render();
            this.$el = this._vnode.el;
            this.$mounted = true;
            this.$emit('hook:mounted');
        };
        Pizza.prototype.$destroy = function () {
            this.$destroyed = true;
            this.$emit('hook:destroyed');
        };
        Pizza.register = register;
        return Pizza;
    }(EventEmitter));
    //# sourceMappingURL=pizza.js.map

    var template = "<users :list=\"users\" @click:item=\"onUserItemClick\"></users>";

    var arr = [
      {
        name: 'A',
        fav: ['eat', 'sex']
      },

      {
        name: 'B',
        fav: ['eat', 'play']
      },

      {
        name: 'C',
        fav: ['sex', 'play']
      },

      {
        name: 'D',
        fav: ['eat', 'sex', 'play']
      },
    ];

    let _ = [];

    for (let i = 0; i < 5000; i++) {
      arr.forEach((item, j) => {
        _.push({
          key: 'i' + i + 'j' + j,
          name: item.name,
          fav: item.fav,
        });
      });
    }

    var template$1 = "<user v-for=\"list\" :info=\"$item\" v-for-index=\"index\" v-key=\"$item.key\" @click=\"onClickItem($item)\">\n  <!-- <span slot=\"name\">{{$item.name}}</span>\n  {{JSON.stringify($item.fav)}} -->\n</user>";

    var template$2 = "<div class=\"user\" @click=\"onClick\">\n  <div>\n    {{info.name}} {{info.fav}}\n  </div>\n  <!-- <slot name=\"name\">{{info.name}}</slot>\n  <slot>{{info.fav}}</slot> -->\n</div>";

    var User = {
        template: template$2,
        props: {
            info: {}
        },
        methods: {
            onClick: function (e) {
                this.$emit('click', e);
            }
        }
    };
    //# sourceMappingURL=user.js.map

    var Users = {
        template: template$1,
        components: { User: User },
        props: {
            list: []
        },
        lifecyles: {
            mounted: function () {
                this.$emit('click');
            }
        },
        methods: {
            onClickItem: function (item) {
                return this.onClick.bind(this, item);
            },
            onClick: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.$emit.apply(this, __spreadArrays(['click:item'], args));
            }
        }
    };
    //# sourceMappingURL=index.js.map

    var App = {
        template: template,
        components: {
            Users: Users
        },
        data: {
            users: _
        },
        methods: {
            onUserItemClick: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log(args);
            }
        }
    };
    //# sourceMappingURL=index.js.map

    var instance = new Pizza({
        components: {
            App: App,
        },
        template: '<app />'
    });
    instance.$mount(document.getElementById('app'));
    //# sourceMappingURL=app.js.map

})));
