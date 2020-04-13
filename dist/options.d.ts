interface Lifetimes {
    created?: Function;
    mounted?: Function;
    updated?: Function;
    destroyed?: Function;
}
interface OptionsData {
    props?: object;
    data?: object | Function;
    lifetimes?: Lifetimes;
    methods?: object;
    watch?: object;
    components?: object;
    template?: string;
    style?: string;
    render?: Function;
}
declare class Options {
    private _;
    props: object;
    data: object | Function;
    lifetimes: Lifetimes;
    methods: object;
    watch: object;
    computed: object;
    components: object;
    template: string;
    style: string;
    render: Function;
    constructor(options: any);
}
export default Options;
export { OptionsData, Lifetimes, };
