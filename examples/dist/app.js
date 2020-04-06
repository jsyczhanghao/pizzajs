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

    var util = {
        proxy: function (context, object, getter, setter) {
            this.keys(object).forEach(function (key) {
                Object.defineProperty(context, key, {
                    get: function () { return getter.call(context, key); },
                    set: setter ? function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return setter.call.apply(setter, __spreadArrays([context, key], args));
                    } : function () { }
                });
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
            var _this = this;
            if (typeof obj == 'object') {
                return '{' + Object.keys(obj).map(function (key) { return "\"" + key + "\": " + _this.obj2str(obj[key]); }).join(',') + '}';
            }
            else {
                return obj;
            }
        },
        map: function (obj, fn) {
            if (obj === void 0) { obj = []; }
            if (typeof obj == 'number') {
                var _ = [], i = 0;
                while (i++ < obj)
                    _.push(i);
                return _;
            }
            else if ('length' in obj) {
                return [].map.call(obj, fn);
            }
            else {
                return this.keys(obj).map(function (key) {
                    return fn(obj[key], key);
                });
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
            return JSON.stringify(a) === JSON.stringify(b);
        }
    };

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
            attrs && util.map(attrs, function (val, key) {
                if (key == 'value') {
                    node[key] = val;
                }
                else if (key == 'dataset') {
                    node['$dataset'] = val;
                }
                else {
                    _this.setAttr(node, key, val);
                }
            });
            listeners && util.map(listeners, function (fn, key) { return _this.on(node, key, fn); });
            return node;
        },
        setAttr: function (node, name, value) {
            node.setAttribute(name, value);
        },
        on: function (node, name, fn) {
            var $$listeners = node['$$listeners'] || {};
            $$listeners[name] = fn;
            node.addEventListener(name, function (e) {
                e.dataset = node.$dataset;
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

    var helper = {
        util: util,
        dom: dom,
    };

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
            (this.$events[name] || []).slice(0).forEach(function (fn) { return fn.call.apply(fn, __spreadArrays([_this], args)); });
        };
        EventEmitter.prototype.$off = function (name, fn) {
            if (!fn) {
                delete this.$events[name];
            }
            else {
                var i = this.$events[name].indexOf(fn);
                i > -1 && this.$events[name].splice(i, 1);
            }
        };
        EventEmitter.prototype.$offByPrefix = function (name) {
            var _this = this;
            helper.util.map(this.$events, function (events, key) {
                key.indexOf(name) == 0 && _this.$off(key);
            });
        };
        EventEmitter.prototype.$once = function (name, fn) {
            var _this = this;
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                fn.call.apply(fn, __spreadArrays([_this], args));
                _this.$off(name, f);
            };
            this.$on(name, f);
        };
        return EventEmitter;
    }());

    var EMPTY_VNODE = {};

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
                        text: comment
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

    var config = {
        logo: 'v',
        prefixs: {
            event: '@',
            bind: ':',
            data: 'data-',
        },
        delimitter: ['{{', '}}'],
        constructor: Pizza
    };

    var COMPONENT_NAME_TEST = /[a-z][a-z0-9]*(-[a-z]+)+/;
    var COMPONENTS = {};
    function register (name, options) {
        if (!options)
            return COMPONENTS[name];
        if (!COMPONENT_NAME_TEST.test(name))
            throw new Error("Component[" + name + "] is not valid, please register a correct component such as [xx-xx]");
        return COMPONENTS[name] = options;
    }

    function $l(obj, fn) {
        return {
            children: helper.util.map(obj, fn).filter(function (vnode) { return vnode !== EMPTY_VNODE; })
        };
    }
    function $n(node, options, children) {
        var component = this.$components[node] || register(node);
        return __assign(__assign({ node: node }, options), { children: children, componentOptions: component });
    }
    function $t(text) {
        return {
            text: text
        };
    }
    function $m(comment) {
        return {
            isComment: true,
            text: comment
        };
    }
    function pick(vnode) {
        var logics = {}, events = {}, props = {}, dataset = {};
        for (var key in vnode.props) {
            var val = vnode.props[key];
            if (key.indexOf(config.logo + '-') == 0) {
                logics[key.substr(config.logo.length + 1)] = val;
            }
            else if (key.indexOf(config.prefixs.event) == 0) {
                events[key.substr(config.prefixs.event.length)] = "\"" + val + "\"";
            }
            else if (key.indexOf(config.prefixs.bind) == 0) {
                props[key.substr(config.prefixs.bind.length)] = val;
            }
            else if (key.indexOf(config.prefixs.data) == 0) {
                dataset[key.substr(config.prefixs.data.length)] = val;
            }
            else {
                props[key] = JSON.stringify(val);
            }
        }
        props['dataset'] = dataset;
        return {
            logics: logics,
            events: events,
            props: props,
        };
    }
    function stringify(str) {
        return str
            .replace(/[\s]+/g, ' ')
            .replace(new RegExp(config.delimitter[0], 'g'), '" + (')
            .replace(new RegExp(config.delimitter[1], 'g'), ') + "');
    }
    function nodeSerialize(vnode) {
        var expression;
        var _a = pick(vnode), logics = _a.logics, events = _a.events, props = _a.props;
        var _for = logics['for'], _if = logics['if'], _elseif = logics['elseif'] || logics['else-if'], _else = logics['else'];
        var index = logics['for-index'] || '$index', item = logics['for-item'] || '$item';
        expression = "_$n(\"" + vnode.node + "\", {\n      " + (_for && logics['key'] ? 'key: ' + logics['key'] + ',' : '') + "\n      props: " + helper.util.obj2str(props) + ",\n      events: " + helper.util.obj2str(events) + ",\n    }, [" + vnode.children.map(function (child, i) { return serialize(child); }) + "])";
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
        if (!template)
            return function () { };
        var compiler = new Compiler(template);
        var data = compiler.analyse();
        compiler = null;
        if (!data || data.children.length == 0) {
            throw new Error('instance must be a root element!');
        }
        else if (data.children.length > 1) {
            throw new Error("template's root must be only one !\r\n " + template);
        }
        var props = helper.util.keys(context.props);
        var methods = helper.util.keys(context.methods);
        var datas = helper.util.keys(typeof context.data == 'function' ? context.data.call({}) : (context.data || {}));
        var vars = props.concat(methods, datas).map(function (key) { return key + " = this." + key; }).join(', ');
        return (new Function('_$l', '_$n', '_$t', '_$m', '_$e', "\n    return function() {\n      " + (vars != '' ? "var " + vars + ";" : '') + ";\n      _$n = _$n.bind(this);\n      return " + serialize(data.children[0]) + ";\n    };\n  "))($l, $n, $t, $m, EMPTY_VNODE);
    }

    var Options = /** @class */ (function () {
        function Options(options) {
            this._ = options;
            this.props = options.props || {};
            this.data = options.data || {};
            this.lifetimes = options.lifetimes || {};
            this.methods = options.methods || {};
            this.watch = options.watch || {};
            //  this.methodsKeys = Object.keys(options.methods);
            this.components = options.components = helper.util.camelKeys2ul(options.components);
            this.render = options.render = options.render || makeVNodeFn(options.template, options);
        }
        Object.defineProperty(Options.prototype, "style", {
            get: function () {
                // if ('CSSStyleSheet' in window) {
                //   if (!this._.$$styleSheet) {
                //     this._.$$styleSheet = new CSSStyleSheet();
                //     this._.$$styleSheet.replaceSync(this._.style);
                //   }
                //   return this._.$$styleSheet;
                // }
                return this._.style;
            },
            enumerable: true,
            configurable: true
        });
        return Options;
    }());

    var PatchType;
    (function (PatchType) {
        PatchType[PatchType["ADD"] = 0] = "ADD";
        PatchType[PatchType["DEL"] = 1] = "DEL";
        PatchType[PatchType["UPDATE"] = 2] = "UPDATE";
        PatchType[PatchType["BATCH"] = 3] = "BATCH";
        PatchType[PatchType["NONE"] = 4] = "NONE";
    })(PatchType || (PatchType = {}));

    function on(instance, events) {
        if (events === void 0) { events = {}; }
        helper.util.map(events, function (event, name) {
            instance.$on("" + config.constructor.$PROPS_EVENT_PREFIX + name, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.$invoke.apply(this, __spreadArrays([event], args));
            });
        });
    }
    function patchComponent (now, old, context) {
        var instance = old.componentInstance, type;
        if (!instance) {
            now.el = helper.dom.createElement(config.logo + "-" + now.node, __assign({}, (now.props['slot'] ? { slot: now.props['slot'] } : {})));
            now.el.$root = now.el.attachShadow({ mode: 'open' });
            instance = new config.constructor(now.componentOptions, {
                props: now.props,
                context: context,
                componentName: now.node,
            });
            on(instance, now.events);
            instance.$invokeMount(now.el.$root);
            // if ('adoptedStyleSheets' in now.el.$root) {
            //   now.el.$root.adoptedStyleSheets = [instance.$options.style];
            // } else {
            var style = document.createElement('style');
            style.textContent = instance.$options.style;
            now.el.$root.appendChild(style);
            // }
            type = PatchType.ADD;
        }
        else if (!helper.util.same(now.props, old.props)) {
            now.el = old.el;
            instance.$propsData = now.props;
            instance.$offByPrefix(config.constructor.$PROPS_EVENT_PREFIX);
            on(instance, now.events);
            instance.$invokeUpdate();
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

    function patchNode (now, old, context) {
        var type;
        var events = {};
        helper.util.map(now.events || {}, function (event, key) {
            events[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                context.$invoke.apply(context, __spreadArrays([event], args));
            };
        });
        if (!old.el) {
            now.el = helper.dom.createElement(now.node, now.props, events);
            type = PatchType.ADD;
        }
        else if (!helper.util.same(now.props, old.props)) {
            now.el = helper.dom.updateElement(old.el, now.props, event);
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

    function patchText (now, old) {
        var type;
        if (old.el) {
            now.el = old.el;
            now.text != old.text && (now.el.textContent = now.text);
            type = PatchType.UPDATE;
        }
        else {
            now.el = helper.dom.createText(now.text);
            type = PatchType.ADD;
        }
        return {
            type: type,
            vnode: now,
        };
    }

    function patchComment (now, old) {
        var type;
        if (!old.el) {
            now.el = helper.dom.createComment(now.text);
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

    function del(old) {
        if (!old)
            return false;
        old.componentInstance && old.componentInstance.$destroy();
        helper.dom.remove(old.el);
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
    function patchChildren(now, old, context) {
        var elIndex = 0, oldChildren = children2keys(old.children || []);
        helper.util.map(now.children, function (child, i) {
            var oldChild = pick$1(oldChildren, child.key || i);
            var patch = patchVNode(child, oldChild, context);
            switch (patch.type) {
                case PatchType.ADD:
                    helper.dom.insert(now.el, child.el, elIndex);
                    break;
                case PatchType.BATCH:
                    helper.dom.insert(now.el, child.el, elIndex);
                    elIndex += child.el.childNodes.length;
                    return;
                case PatchType.DEL:
                    del(oldChild);
                    return;
            }
            elIndex++;
        });
        helper.util.map(oldChildren, del);
    }
    function patchVNode(now, old, context) {
        if (old === void 0) { old = {}; }
        var patch;
        do {
            if (now.componentOptions) {
                patch = patchComponent(now, old, context);
            }
            else if (now.node) {
                patch = patchNode(now, old, context);
            }
            else if (now.isComment) {
                patch = patchComment(now, old);
                break;
            }
            else if (now.text) {
                patch = patchText(now, old);
                break;
            }
            else if (now == EMPTY_VNODE) {
                patch = { vnode: old, type: PatchType.DEL };
                break;
            }
            else if (!now.el && now.children) {
                now.el = helper.dom.fragment();
                patch = { vnode: now, type: PatchType.BATCH };
            }
            else {
                patch = { vnode: now, type: PatchType.NONE };
            }
            patchChildren(now, old, context);
        } while (0);
        return patch;
    }
    function patchVNode$1 (now, old, context) {
        if (old === void 0) { old = {}; }
        return patchVNode(now, old, context).vnode;
    }

    var Pizza = /** @class */ (function (_super) {
        __extends(Pizza, _super);
        function Pizza(componentOptions, options) {
            if (componentOptions === void 0) { componentOptions = {}; }
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.$mounted = false;
            _this.$destroyed = false;
            _this.$update = helper.util.debounce(function () {
                if (!this.$mounted || this.$destroyed)
                    return false;
                this._render();
                this.$emit('hook:updated');
                this.$emit('hook:$nextTick');
            }, 10);
            _this.$options = new Options(componentOptions);
            _this.$render = _this.$options.render;
            _this.$propsData = options.props;
            _this.$context = options.context;
            _this.$componentName = options.componentName;
            _this._init();
            return _this;
        }
        Pizza.prototype._init = function () {
            //inject lifecycles hook
            this._injectHooks();
            //proxy methods and data
            helper.util.proxy(this, __assign(__assign({}, this.$options.props), this.$options.methods), this.$get);
            if (typeof this.$options.data == 'function') {
                this.$data = this.$options.data.call(this);
            }
            else {
                this.$data = this.$options.data;
            }
            helper.util.proxy(this, this.$data, this.$get, this.$set);
            this.$emit('hook:created');
        };
        Object.defineProperty(Pizza.prototype, "$methods", {
            get: function () {
                return this.$options.methods;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pizza.prototype, "$components", {
            get: function () {
                return this.$options.components;
            },
            enumerable: true,
            configurable: true
        });
        Pizza.prototype.$set = function (key, value) {
            if (!(key in this.$data) || value === this.$data[key])
                return;
            this.$data[key] = value;
            this.$update();
        };
        Pizza.prototype.$get = function (key, _default) {
            var _a, _b, _c;
            return (_c = (_b = (_a = this.$methods[key]) !== null && _a !== void 0 ? _a : this.$propsData[key]) !== null && _b !== void 0 ? _b : this.$data[key]) !== null && _c !== void 0 ? _c : _default;
        };
        Pizza.prototype._injectHooks = function () {
            var _this = this;
            helper.util.map(this.$options.lifetimes, function (fn, lifetime) { return _this.$on("hook:" + lifetime, fn); });
        };
        Pizza.prototype.$emit = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _super.prototype.$emit.apply(this, __spreadArrays([name], args));
            _super.prototype.$emit.apply(this, __spreadArrays(["" + Pizza.$PROPS_EVENT_PREFIX + name], args));
        };
        Pizza.prototype.$invoke = function (method) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this[method]).call.apply(_a, __spreadArrays([this], args));
        };
        Pizza.prototype.$nextTick = function (fn) {
            this.$once('hook:$nextTick', fn);
        };
        Pizza.prototype.$invokeUpdate = function () {
            this.$update();
        };
        Pizza.prototype._render = function () {
            var vnode = this.$render.call(this);
            if (!vnode)
                return false;
            if (this._mountElement) {
                vnode = { el: this._mountElement, children: [vnode] };
            }
            this._patch(vnode);
        };
        Pizza.prototype._patch = function (vnode) {
            this.$vnode = patchVNode$1(vnode, this.$vnode, this);
            this.$el = this.$vnode.el;
        };
        Pizza.prototype.$invokeMount = function (element) {
            this.$mount(element);
        };
        Pizza.prototype.$mount = function (element) {
            if (this.$mounted)
                return;
            if (element) {
                this._mountElement = element;
            }
            this._render();
            this.$mounted = true;
            this.$emit('hook:mounted');
            this.$emit('hook:$nextTick');
        };
        Pizza.prototype.$destroy = function () {
            this.$destroyed = true;
            this.$emit('hook:destroyed');
        };
        Pizza.$PROPS_EVENT_PREFIX = 'PROPS_EVENT:';
        return Pizza;
    }(EventEmitter));

    var instances = {};
    var $$id = 0;
    var worker;
    var MiniClientPizza = /** @class */ (function (_super) {
        __extends(MiniClientPizza, _super);
        function MiniClientPizza() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MiniClientPizza.prototype._init = function () {
            _super.prototype._init.call(this);
            instances[this.$$id = $$id++] = this;
            MiniClientPizza.send(this, 'COMPONENT_CREATED', {
                props: this.$propsData,
                context: this.$context ? this.$context['$$id'] : 0,
                component: this.$componentName,
            });
        };
        MiniClientPizza.prototype.$invoke = function (method) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            MiniClientPizza.send(this, 'COMPONENT_INVOKE', __spreadArrays([method], args));
        };
        MiniClientPizza.prototype.$invokeUpdate = function () {
            MiniClientPizza.send(this, 'UPDATE_COMPONENT', {
                props: this.$propsData,
                context: this.$context ? this.$context['$$id'] : 0,
            });
        };
        MiniClientPizza.prototype.$invokeMount = function (element) {
            this._mountElement = element;
        };
        MiniClientPizza.send = function (instance, type, data) {
            worker.postMessage({
                id: instance.$$id,
                data: data ? JSON.stringify(data) : null,
                type: type
            }, void 0);
        };
        MiniClientPizza.listen = listen;
        return MiniClientPizza;
    }(Pizza));
    function listen(_) {
        worker = _;
        worker.addEventListener('message', function (event) {
            var _a = event.data, id = _a.id, type = _a.type, data = _a.data;
            var instance = instances[id];
            data = data ? JSON.parse(data) : null;
            switch (type) {
                case 'CREATE_PAGE':
                    instance = new MiniClientPizza({
                        render: function () { return data; }
                    });
                    instance.$mount(document.getElementById('app'));
                    break;
                case 'UPDATE_COMPONENT':
                    instance.$render = function () { return data; };
                    instance.$mounted && instance.$update();
                    break;
                case 'MOUNT_COMPONENT':
                    instance.$render = function () { return data; };
                    instance.$mount();
            }
        });
    }
    var MiniClientPizza$1 = config.constructor = MiniClientPizza;

    MiniClientPizza$1.listen(new Worker('./background.js'));

})));
