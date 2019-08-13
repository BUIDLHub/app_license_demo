import LocalForage from './LocalForage';

const PREFIX = "ald-";

export default class DB {
    constructor(props) {
        if(!props) {
            props = {}
        }
        this.db = new LocalForage({
            ...props,
            dbPrefix: props.dbPrefix || PREFIX
        });

        [
            'create',
            'createBulk',
            'read',
            'readAll',
            'find',
            'update',
            'updateBulk',
            'remove',
            'clearAll',
            'iterate'
        ].forEach(fn=>this[fn]=this.db[fn].bind(this.db));
    }
}