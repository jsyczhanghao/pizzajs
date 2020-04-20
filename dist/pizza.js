!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).Pizza={})}(this,function(t){"use strict";var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)};var s=function(){return(s=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)};function c(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;var o=Array(t),i=0;for(e=0;e<n;e++)for(var r=arguments[e],s=0,c=r.length;s<c;s++,i++)o[i]=r[s];return o}var i={proxy:function(n,o,e,i){var r=this;"object"==typeof o?this.keys(o).forEach(function(t){return r.proxy(n,t,e,i)}):Object.defineProperty(n,o,{get:function(){return e.call(n,o)},set:i?function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return i.call.apply(i,c([n,o],t))}:function(){}})},throttle:function(n,o){var i;return function(){var t=this,e=arguments;null==i&&(i=setTimeout(function(){n.apply(t,e),i=null},o))}},obj2str:function(e){var n=this;return"object"==typeof e?"{"+Object.keys(e).map(function(t){return"'"+t+"': "+n.obj2str(e[t])}).join(",")+"}":e},map:function(e,n){if(void 0===e&&(e=[]),"number"!=typeof e)return"length"in e?[].map.call(e,n):this.keys(e).map(function(t){return n(e[t],t)});for(var t=[],o=0;o++<e;)t.push(o);return t},pick:function(e,t){void 0===e&&(e={});var n={};return t.forEach(function(t){t in e&&(n[t]=e[t])}),n},keys:function(t){return void 0===t&&(t={}),Object.keys(t)},camel2ul:function(t){return t.replace(/[A-Z]/g,function(t,e){return(0==e?"":"-")+t.toLowerCase()})},camelKeys2ul:function(t){void 0===t&&(t={});var e={};for(var n in t)e[this.camel2ul(n)]=t[n];return e},same:function(t,e){return JSON.stringify(t)===JSON.stringify(e)},clone:function(t){return JSON.parse(JSON.stringify(t))}},o={class:"className",dataset:"$dataset"},e={createElement:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return this.updateElement.apply(this,c([document.createElement(t)],e))},updateElement:function(n,t,e){var o=this;return t&&i.map(t,function(t,e){o.setAttr(n,e,t)}),e&&i.map(e,function(t,e){return o.on(n,e,t)}),n},setAttr:function(t,e,n){t[e=o[e]||e]=n},on:function(e,t,n){var o=e.$$listeners||{},i=t.split("."),r=i[0],s=i[1];o[r]=n,e.addEventListener(r,function(t){t.dataset=e.$dataset,o[r]&&o[r].call(e,t),"stop"==s?t.stopPropagation():"prevent"==s&&t.preventDefault()},!1),e.$$listeners=o},off:function(t,e){var n=t.$$listeners||{};delete n[e],t.$$listeners=n},fragment:function(){return document.createDocumentFragment()},createText:function(t){return document.createTextNode(t)},createComment:function(t){return void 0===t&&(t=""),document.createComment(t)},insert:function(t,e,n){if(n<0)return!1;var o=t.childNodes;return 0==o.length||o.length<n?t.appendChild(e):t.insertBefore(e,o[n])},remove:function(t){t&&t.remove()},injectStyle:function(t,e){if(!e||!t)return!1;var n=document.createElement("style");n.textContent=e,t.insertBefore(n,t.firstChild)}},f={util:i,dom:e},n=function(){function t(){this.$events={}}return t.prototype.$on=function(t,e){var n,o=null!==(n=this.$events[t])&&void 0!==n?n:[];o.push(e),this.$events[t]=o},t.prototype.$emit=function(t){for(var e=this,n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];(this.$events[t]||[]).slice(0).forEach(function(t){return t.call.apply(t,c([e],n))})},t.prototype.$off=function(t,e){if(e){var n=this.$events[t].indexOf(e);-1<n&&this.$events[t].splice(n,1)}else delete this.$events[t]},t.prototype.$offByPrefix=function(n){var o=this;f.util.map(this.$events,function(t,e){0==e.indexOf(n)&&o.$off(e)})},t.prototype.$once=function(n,o){var i=this,r=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];o.call.apply(o,c([i],t)),i.$off(n,r)};this.$on(n,r)},t}(),l={},p=function(){function o(t){this.now={children:[]},this.html=t,this.stack=[this.now]}return o.prototype.analyse=function(){if(!this.html)return null;for(var t;t=o.REGEXP.exec(this.html);)if(!this.collect.apply(this,t.slice(1)))throw new Error("template parsing error, not a valid structure ~\r\n["+t.index+"]: "+t[0]+"\r\n"+this.html);return this.now},o.prototype.collect=function(t,e,n,o,i,r){do{if(e){var s={node:e.toLocaleLowerCase(),props:this.collectAttrs(n),children:[]};!o&&this.stack.push(s),this.now.children.push(s)}else if(i){if(i.toLocaleLowerCase()!=this.now.node)break;this.stack.pop()}else t?this.now.children.push({isComment:!0,text:t}):r.trim()&&this.now.children.push({text:r});return this.now=this.stack[this.stack.length-1],!0}while(0);return!1},o.prototype.collectAttrs=function(t){var e={};if(t)for(var n=void 0;n=o.ATTR_REPEXP.exec(t);)e[n[1]]=null==n[2]?n[1]:n[2];return e},o.REGEXP=/<!--((?:(?!-->)[\s\S])*?)-->|<([a-z]+(?:(?:-[a-z]+)+)?)(\s[\s\S]+?)?(\s*\/)?>|<\/([a-z]+(?:(?:-[a-z]+)+)?)>|([\s\S]+?)(?=<|$)/gi,o.ATTR_REPEXP=/\s*([^\s"=>\/]+)(?:="([^"]+)")?/g,o}(),h={logo:"v",prefixs:{event:"@",bind:":",data:"data-",component:""},delimitter:["{{","}}"]};function u(t,e){return{children:f.util.map(t,e).filter(function(t){return t!==l})}}function d(t,e,n){var o=this.$components[t];return s(s({node:t},e),{children:n,componentOptions:o})}function m(t){return{text:t}}function $(t){return{isComment:!0,text:t}}function a(t){var e,n=function(t){var e={},n={},o={},i={};for(var r in t.props){var s=t.props[r];0==r.indexOf(h.logo+"-")?e[r.substr(h.logo.length+1)]=s:0==r.indexOf(h.prefixs.event)?n[r.substr(h.prefixs.event.length)]='"'+s+'"':0==r.indexOf(h.prefixs.bind)?o[r.substr(h.prefixs.bind.length)]=s:0==r.indexOf(h.prefixs.data)?i[r.substr(h.prefixs.data.length)]=s:o[r]=JSON.stringify(s)}return o.dataset=i,{logics:e,events:n,props:o}}(t),o=n.logics,i=n.events,r=n.props,s=o.for,c=o.if,a=o.elseif||o["else-if"],l=o.else,p=o["for-index"]||"$index",u=o["for-item"]||"$item";return e='_$n("'+t.node+'", {\n      '+(s&&o.key?"key: "+o.key+",":"")+"\n      props: "+f.util.obj2str(r)+",\n      events: "+f.util.obj2str(i)+",\n    }, ["+t.children.map(function(t,e){return v(t)})+"])",c?e=c+" ? "+e+" : _$e":a?e=" && "+a+" ? "+e+" : _$e":l&&(e=" && "+e),s&&(e="_$l("+s+", function("+u+", "+p+") { return "+e+"; })"),e}function v(t){var e,n,o;return t.node?e=a(t):t.isComment?e="_$m("+JSON.stringify(t.text)+")":t.text&&(e='_$t("'+(n=t.text,void 0===(o=!0)&&(o=!1),n.replace(/[\s]+/g," ").replace(new RegExp(h.delimitter[0],"g"),'" + '+(o?"JSON.stringify":"")+"(").replace(new RegExp(h.delimitter[1],"g"),') + "'))+'")'),e}var y,g,x,E=function(t){this._=t,this.props=t.props||{},this.data=t.data||{},this.lifetimes=t.lifetimes||{},this.methods=t.methods||{},this.watch=t.watch||{},this.computed=t.computed||{},this.style=t.style,this.components=t.components=f.util.camelKeys2ul(t.components),this.render=t.render=t.render||function(t,e){if(!t)return function(){};var n=new p(t),o=n.analyse();if(n=null,!o||0==o.children.length)throw new Error("instance must be a root element!\r\n "+t);if(1<o.children.length)throw new Error("template's root must be only one !\r\n "+t);var i=f.util.keys(e.props),r=f.util.keys(e.methods),s=f.util.keys(e.computed),c=f.util.keys("function"==typeof e.data?e.data.call({}):e.data||{}),a=i.concat(r,c,s).map(function(t){return t+" = this."+t}).join(", ");return new Function("_$l","_$n","_$t","_$m","_$e","\n    return function() {\n      "+(""!=a?"var "+a+";":"")+";\n      _$n = _$n.bind(this);\n      return "+v(o.children[0])+";\n    };\n  ")(u,d,m,$,l)}(t.template,t)};(g=y||(y={}))[g.ADD=0]="ADD",g[g.DEL=1]="DEL",g[g.UPDATE=2]="UPDATE",g[g.BATCH=3]="BATCH",g[g.NONE=4]="NONE";var _={set:function(t){return x=t},get:function(){return x}};function k(e,t){void 0===t&&(t={}),f.util.map(t,function(n,t){e.$on(""+_.get().$PROPS_EVENT_PREFIX+t,function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.$invoke.apply(this,c([n],t))})})}function O(t,e,n){var o,i=null==e?void 0:e.componentInstance,r=f.util.pick(t.props,["slot","style","class"]);if(i)o=f.util.same(t.props,i.$propsData)?(t.el=e.el,y.NONE):(t.el=e.el,f.dom.updateElement(t.el,r),i.$setPropsData(f.util.clone(t.props)),i.$offByPrefix(_.get().$PROPS_EVENT_PREFIX),k(i,t.events),i.$update(),y.UPDATE);else{var s=""+(h.prefixs.component||"")+t.node;t.el=f.dom.createElement(s,r);try{t.el.$root=t.el.attachShadow({mode:"closed"})}catch(t){throw new Error("Component["+s+"] is not valid, the name must be like [xx-xx]")}k(i=new(_.get())(t.componentOptions,{props:f.util.clone(t.props),context:n,componentName:t.node}),t.events),i.$mount(t.el.$root),o=y.ADD}return t.componentInstance=i,{type:o,vnode:t}}function P(t,e,o){var i={};return f.util.map(t.events||{},function(n,t){i[t]=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];o.$invoke.apply(o,c([n],t))}}),{type:e.el?f.util.same(t.props,e.props)?(t.el=e.el,y.NONE):(t.el=f.dom.updateElement(e.el,t.props,event),y.UPDATE):(t.el=f.dom.createElement(t.node,t.props,i),y.ADD),vnode:t}}function b(t){return!!t&&(t.componentInstance&&t.componentInstance.$destroy(),f.dom.remove(t.el),t.el=null,t)}function w(s,t,c){var e,n,o,a=0,l=(e=(null==t?void 0:t.children)||[],n=e[0],o={},n&&null!=n.key?(e.forEach(function(t){o[t.key]=t}),o):e.slice(0));s.el.$$fc=0,f.util.map(s.children,function(t,e){var n,o,i,r=(n=l,o=t.key||e,i=n[o],n[o]=null,i);switch(D(t,r,c).type){case y.BATCH:return a+=t.el.$$fc,f.dom.insert(s.el,t.el,a),void(a+=t.el.childNodes.length);case y.DEL:return void b(r);case y.ADD:f.dom.insert(s.el,t.el,a);break;default:s.el.$$fc++}a++}),f.util.map(l,b)}function D(t,e,n){var o,i,r,s,c;void 0===e&&(e={});do{if(t.componentOptions)o=O(t,e,n),t.componentInstance.$children=t.children;else if(t.node)o=P(t,e,n);else{if(t.isComment){s=t,o={type:(c=e).el?(s.el=c.el,y.NONE):(s.el=f.dom.createComment(s.text),y.ADD),vnode:s};break}if(t.text){i=t,o={type:(r=e).el?(i.el=r.el,i.text!=r.text&&(i.el.textContent=i.text),y.UPDATE):(i.el=f.dom.createText(i.text),y.ADD),vnode:i};break}if(t==l){o={vnode:e,type:y.DEL};break}o=!t.el&&t.children?(t.el=f.dom.fragment(),{vnode:t,type:y.BATCH}):{vnode:t,type:y.NONE}}w(t,e,n)}while(0);return o}var N={},T=f.util.throttle(function(){this.$forceUpdate()},0),A=function(o){function i(t,e){void 0===t&&(t={}),void 0===e&&(e={});var n=o.call(this)||this;return n.$mounted=!1,n.$destroyed=!1,n.$options=new E(t),n.$render=n.$options.render,n.$propsData=e.props||{},n.$context=e.context,n.$componentName=e.componentName,n.$componentId=e.componentId?e.componentId:i.$$id++,n._init(),n}return function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}(i,o),i.prototype._init=function(){this._injectHooks(),f.util.proxy(this,s(s({},this.$options.props),this.$options.methods),this.$get),"function"==typeof this.$options.data?this.$data=this.$options.data.call(this):this.$data=this.$options.data,f.util.proxy(this,this.$data,this.$get,this.$set),f.util.proxy(this,this.$options.computed,this.$get),this.$emit("hook:created")},Object.defineProperty(i.prototype,"$methods",{get:function(){return this.$options.methods},enumerable:!0,configurable:!0}),Object.defineProperty(i.prototype,"$components",{get:function(){return s(s({},N),this.$options.components)},enumerable:!0,configurable:!0}),i.prototype.$set=function(t,e){if(t in this.$data&&e!==this.$data[t]){var n=this.$data[t];this.$data[t]=e,this._invokeWatch(t,e,n),this.$update()}},i.prototype.$get=function(t,e){var n,o,i,r;return this.$options.computed[t]?this.$options.computed[t].call(this):null!==(r=null!==(i=null!==(o=null!==(n=this.$methods[t])&&void 0!==n?n:this.$propsData[t])&&void 0!==o?o:this.$data[t])&&void 0!==i?i:this.$options.props[t])&&void 0!==r?r:e},i.prototype.$setPropsData=function(t){var o=this;f.util.map(t,function(t,e){var n=o.$propsData[e];e in o.$options.props&&n!==t&&o._invokeWatch(e,o.$propsData[e]=t,n)}),this.$update()},i.prototype._injectHooks=function(){var n=this;f.util.map(this.$options.lifetimes,function(t,e){return n.$on("hook:"+e,t)})},i.prototype.$emit=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];o.prototype.$emit.apply(this,c([t],e)),o.prototype.$emit.apply(this,c([""+i.$PROPS_EVENT_PREFIX+t],e))},i.prototype.$invoke=function(t){for(var e,n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];return(e=this[t]).call.apply(e,c([this],n))},i.prototype._invokeWatch=function(t,e,n){var o=this.$options.watch[t];o&&o.call(this,e,n)},i.prototype.$update=function(){T.call(this)},i.prototype.$forceUpdate=function(){if(!this.$mounted||this.$destroyed)return!1;this._render(),this.$emit("hook:updated"),this.$emit("hook:$nextTick")},i.prototype.$nextTick=function(t){this.$once("hook:$nextTick",t)},i.prototype._render=function(){var t=this.$render.call(this);if(!t)return!1;this._mountElement&&(t={el:this._mountElement,children:[t]}),this._patch(t)},i.prototype._patch=function(t){var e,n;this.$vnode=(e=t,void 0===(n=this.$vnode)&&(n={}),D(e,n,this).vnode),this.$el=this.$vnode.el},i.prototype.$mount=function(t){this.$mounted||(t&&(this._mountElement=t),this._render(),this.$mounted=!0,this.$emit("hook:mounted"),this.$emit("hook:$nextTick"),f.dom.injectStyle(this.$el,this.$options.style))},i.prototype.$destroy=function(){this.$destroyed=!0,this.$emit("hook:destroyed")},i.register=function(t,e){return e?N[t]=e:N[t]},i.$$id=0,i.$PROPS_EVENT_PREFIX="PROPS_EVENT:",i}(n);_.set(A),t.Pizza=A,t.PizzaContructor=_,t.config=h,t.default=A,t.helper=f,Object.defineProperty(t,"__esModule",{value:!0})});
