import {Mutex} from 'async-mutex';

export default class AtomicBool {
    constructor(init) {
        this.value = init || false;
        this.lock = new Mutex();
        [
            'setValue',
            'getValue'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async setValue(val) {
        const rel = await this.lock.acquire();
        try {
            this.value = val
        } finally {
            rel();
        }
    }

    async getValue(val) {
        const rel = await this.lock.acquire();
        try {
            return this.value;
        } finally {
            rel();
        }
    }
}