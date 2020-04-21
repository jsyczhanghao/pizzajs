import helper from './helper';

export default class EventEmitter {
  protected $events = {};
  
  $on(name: string, fn: Function) {
    let events: Function[] = this.$events[name] ?? [];
    events.push(fn);
    this.$events[name] = events;
  }

  $emit(name: string, ...args: any) {
    (this.$events[name] || []).slice(0).forEach((fn: Function) => fn.call(this, ...args));
  }

  $off(name: string, fn?: Function) {
    if (!fn) {
      delete this.$events[name];
    } else {
      let i = this.$events[name].indexOf(fn);
      i > -1 && this.$events[name].splice(i, 1);
    }
  }

  $offByPrefix(name: string) {
    helper.util.map(this.$events, (events: [], key: string) => {
      key.indexOf(name) == 0 && this.$off(key);
    });
  }

  $once(name: string, fn: Function) {
    let f = (...args: any) => {
      fn.call(this, ...args);
      this.$off(name, f);
    }

    this.$on(name, f);
  }
} 