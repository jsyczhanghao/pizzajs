declare const _default: {
    util: {
        proxy(context: object, object: object, getter: Function, setter?: Function): void;
        throttle(fn: Function, wait: number): () => void;
        obj2str(obj: any): any;
        map(obj: number | object | [], fn: Function): any[];
        pick(obj: object, keys: string[]): {};
        keys(object?: object): string[];
        camel2ul(str: string): string;
        camelKeys2ul(object?: object): object;
        same(a: any, b: any): boolean;
        clone(obj: any): any;
    };
    dom: {
        createElement(node: string, ...args: any): any;
        updateElement(node: HTMLElement, attrs?: object, listeners?: object): HTMLElement;
        setAttr(node: HTMLElement, name: string, value: any): void;
        on(node: HTMLElement, name: string, fn: Function): void;
        off(node: HTMLElement, name: string): void;
        fragment(): DocumentFragment;
        createText(text: string): Text;
        createComment(comment?: string): Comment;
        insert(parent: HTMLElement, el: any, index: number): any;
        replace(old: HTMLElement, now: HTMLElement): void;
        remove(el?: HTMLElement | Text | Comment): void;
        isFragment(el: HTMLElement): boolean;
        injectStyle(el: HTMLElement | DocumentFragment, style?: string): boolean;
    };
};
export default _default;
