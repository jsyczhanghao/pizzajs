declare const _default: {
    proxy(context: object, object: object, getter: Function, setter?: Function): void;
    throttle(fn: Function, wait: number): () => void;
    obj2str(obj: any): any;
    map(obj: [] | object | number, fn: Function): any[];
    pick(obj: object, keys: string[]): {};
    keys(object?: object): string[];
    camel2ul(str: string): string;
    camelKeys2ul(object?: object): object;
    same(a: any, b: any): boolean;
    clone(obj: any): any;
};
export default _default;
