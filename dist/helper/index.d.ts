declare const _default: {
    util: {
        proxy(context: object, object: object, getter: Function, setter?: Function): void;
        debounce(fn: Function, wait: number): () => void;
        obj2str(obj: object): string;
        each(obj: object | [], fn: Function): void;
        keys(object?: object): string[];
        camel2ul(str: string): string;
        camelKeys2ul(object?: object): object;
        same(a: object, b?: object): boolean;
    };
    dom: {
        createElement(node: string, ...args: any[]): any;
        updateElement(node: HTMLElement, attrs?: object, listeners?: object): HTMLElement;
        setAttr(node: any, name: any, value: any): void;
        on(node: HTMLElement, name: string, fn: Function): void;
        off(node: HTMLElement, name: string): void;
        fragment(): DocumentFragment;
        createText(text: string): Text;
        createComment(comment?: string): Comment;
        insert(parent: HTMLElement, el: any, index: number): any;
        remove(el?: HTMLElement | Text | Comment): void;
    };
};
export default _default;
