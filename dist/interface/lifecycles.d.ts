export default interface Lifecyles {
    created?(): any;
    mounted?(): any;
    updated?(): any;
    destroyed?(): any;
}
