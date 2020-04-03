import Helper from "./helper";

export default class EventEmitter {
  protected $events = {};
  
  $on(name: string, fn: Function) {
    let events: Function[] = this.$events[name] ?? [];
    events.push(fn);
    this.$events[name] = events;
  }

  $emit(name: string, ...args) {
    (this.$events[name] || []).forEach((fn: Function) => fn.apply(this, args));
  }

  $off(name: string) {
    if (/:$/.test(name)) {
      Helper.util.each(this.$events, (events, key) => {
        key.indexOf(name) == 0 && delete this.$events[key];
      });
    } else {
      delete this.$events[name];
    }
  }
} 