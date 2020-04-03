declare const _default: {
    proxy(context: object, object: object, getter: Function, setter?: Function): void;
    debounce(fn: Function, wait: number): () => void;
    obj2str(obj: object): string;
    each(obj: object | [], fn: Function): void;
    keys(object?: object): string[];
    camel2ul(str: string): string;
    camelKeys2ul(object?: object): object;
    same(a: object, b?: object): boolean;
};
export default _default;
