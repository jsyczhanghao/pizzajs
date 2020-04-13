export default class EventEmitter {
    protected $events: {};
    $on(name: string, fn: Function): void;
    $emit(name: string, ...args: any[]): void;
    $off(name: string, fn?: Function): void;
    $offByPrefix(name: string): void;
    $once(name: string, fn: Function): void;
}
