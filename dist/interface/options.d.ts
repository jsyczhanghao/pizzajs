import Lifecyles from './lifecycles';
interface Options {
    readonly props?: object;
    readonly data?: object;
    readonly lifecyles?: Lifecyles;
    readonly methods?: object;
    readonly components?: object;
    readonly template?: string;
    render?(): any;
    propsData?: object;
    events?: object;
}
export default Options;
