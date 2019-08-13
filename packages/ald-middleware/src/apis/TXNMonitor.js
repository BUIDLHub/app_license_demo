import {Mutex} from 'async-mutex'
import * as yup from 'yup';
import {Handler} from 'ald-block-router';
import {Logger} from 'ald-utils';
import ABIDecoder from './ABIDecoder';

const schema = yup.object({
    address: yup.string().required("Missing contract address to monitor"),
    web3: yup.object().required("Missing web3 for TXNMonitor")
});

const _mutex = new Mutex();
const log = new Logger({component: "TXNMonitor"});

export default class TXNMonitor extends Handler {
    constructor(props) {
        super("TXNMonitor");
        schema.validateSync(props);
        this.web3 = props.web3;
        this.targetAddress = props.address.toLowerCase();
        this.decoder = new ABIDecoder(props);
        this.maxHistory = props.maxHistory || 200;
        this.txns = [];
        this.history = {};
        this.pending = {};
        [
            'pendingTxn',
            'init',
            'newBlock',
            'purgeBlocks'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async pendingTxn(txnHash, cb) {
        let release = await _mutex.acquire();
        try {
            let idx = this.history[txnHash];
            if(idx >= 0) {
                return cb(this.txns[idx]);
            }
            this.pending[txnHash] = cb;
        } finally {
            release();
        }
    }

    async init(ctx, next) {
        return next();
    }

    async newBlock(ctx, block, next) {
        let txns = block.transactions;
        if(!txns || txns.length === 0) {
            return next();
        }

        let release = await _mutex.acquire();
        
        try {
            for(let i=0;i<txns.length;++i) {
                let t = txns[i];
                if(t.to && t.to.toLowerCase()===this.targetAddress) {
                    let decLogs = this.decoder.decode(block, t);
                    t.logEvents = decLogs.reduce((o, e)=>{
                        let a = o[e.event] || [];
                        a.push(e);
                        o[e.event] = a;
                        return o;
                    }, {})
                }
                let cb = this.pending[t.hash];
                if(cb) {
                    try {
                        await cb(t);
                    } catch (e) {
                        log.error("Problem calling pending txn handler", e);
                    }
                    delete this.pending[t.hash];
                } else {
                    this.txns.push(t);
                    if(txns.length > this.maxHistory) {
                        let oldest = this.txns.shift();
                        delete this.history[oldest.hash];
                    }
                    this.history[t.hash] = txns.length-1;
                }
            }
            return next();
        } finally {
            release();
        }
        
    }

    async purgeBlocks(ctx, blocks, next) {
        return next();
    }

    
}