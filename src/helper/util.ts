export default {
  proxy(context: object, object: object, getter: Function, setter?: Function) {
    this.keys(object).forEach((key: string) => {
      Object.defineProperty(context, key, {
        get: () => getter.call(context, key),
        set: setter ? (...args) => setter.call(context, key, ...args) : function () { }
      });
    });
  },

  debounce(fn: Function, wait: number) {
    let timer;

    return function () {
      let context = this, args = arguments;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  },

  obj2str(obj: any) {
    if (typeof obj == 'object') {
      return '{' + Object.keys(obj).map((key: string) => `"${key}": ${this.obj2str(obj[key])}`).join(',') + '}';
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

  keys(object: object = {}) {
    return Object.keys(object);
  },

  camel2ul(str: string): string {
    return str.replace(/[A-Z]/, (all: string, index: number) => (index == 0 ? '' : '-') + all.toLowerCase());
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
  }
}