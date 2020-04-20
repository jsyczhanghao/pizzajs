export default {
  proxy(context: object, object: object, getter: Function, setter?: Function) {
    if (typeof object == 'object') {
      this.keys(object).forEach((key: string) => this.proxy(context, key, getter, setter));
    } else {
      Object.defineProperty(context, object, {
        get: () => getter.call(context, object),
        set: setter ? (...args) => setter.call(context, object, ...args) : function () { }
      });
    }
  },

  throttle(fn: Function, wait: number) {
    let timer;

    return function () {
      let context = this, args = arguments;

      if (timer == null) {
        timer = setTimeout(() => {
          fn.apply(this, args);
          timer = null;
        }, wait);
      }
    };
  },

  obj2str(obj: any) {
    if (typeof obj == 'object') {
      return '{' + Object.keys(obj).map((key: string) => `'${key}': ${this.obj2str(obj[key])}`).join(',') + '}';
    } else {
      return obj;
    }
  },

  map(obj: [] | object | number = [], fn: Function): any[] {
    if (typeof obj == 'number') {
      let _ = [], i = 0;
      while (i++ < obj) _.push(i);
      return _;
    } else if ('length' in obj) {
      return [].map.call(obj, fn);
    } else {
      return this.keys(obj).map((key) => {
        return fn(obj[key], key);
      });
    }
  },

  pick(obj: object = {}, keys: string[]) {
    let _ = {};

    keys.forEach((key) => {
      key in obj && (_[key] = obj[key]);
    });

    return _;
  },

  keys(object: object = {}) {
    return Object.keys(object);
  },

  camel2ul(str: string): string {
    return str.replace(/[A-Z]/g, (all: string, index: number) => (index == 0 ? '' : '-') + all.toLowerCase());
  },

  camelKeys2ul(object: object = {}): object {
    let _ = {};

    for (let key in object) {
      _[this.camel2ul(key)] = object[key];
    }

    return _;
  },

  same(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  },

  clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}