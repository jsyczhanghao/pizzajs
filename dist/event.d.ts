export default class EventEmitter {
    protected $events: {};
    $on(name: string, fn: Function): void;
    $emit(name: string, ...args: any[]): void;
    $off(name: string): void;
}
