import Connector from './Connector'
import {Logger} from 'ald-utils';
import * as yup from 'yup';

const log = new Logger({component: "Web3"});


export default class ALDWeb3 {
    constructor(config) {
        this.connector = new Connector(config);
        this.config = config;
        this._web3 = this.connector.web3;
        this.on = this.connector.on.bind(this.connector);
        this.removeListener = this.connector.removeListener.bind(this.connector);
        [
            'start',
            'stop',
            'open',
            'pause',
            'networkId',
            'currentBlock',
            'getBlock',
            'getBlockRange'
        ].forEach(fn=>this[fn]=this[fn].bind(this))
    }

    async open() {
        return this.connector.open()
    }

    async start() {
        okOrThrow(this.connector,"Attempting to start a closed web3 instance");
        if(this.connector.closed) {
            await this.connector.open()
        }
        return this.connector.startBlockSubscription();
    }

    async stop() {
       await this.connector.close();
       this.connector = null;
    }

    async pause() {
        await this.connector.pause();
    }

    async currentBlock(force) {
        okOrThrow(this.connector, "Attempting to get block from closed web3");
        return this.connector.currentBlock(force);
    }

    async getBlock(num) {
        let blocks = getBlockRange({
            fromBlock: num,
            toBlock: num
        })
    }

    async getBlockRange(range, cb) {
        let s = range.fromBlock;
        let e = range.toBlock || s;
        let calls = [];
        for(let i=s;i<=e;++i) {
            log.debug("Requesting block", i, "from on-chain...");
            calls.push(this.connector.getBlock(i, true).then(cb))
        }
        log.debug("Waiting for block request calls to complete...")
        await Promise.all(calls);
        log.debug("All requests completed");
    }

    async transactions(block) {
        okOrThrow(this.connector, "Attempting to get transactions from closed web3");
        log.debug("Getting transactions for block", block.number);
        return this.connector.transactions(block);
    }

    async receipt(txn) {
        okOrThrow(this.connector, "Attempting to get receipt from closed web3");
        log.debug("Getting receipts for txn", txn.hash);
        return this.connector.receipt(txn);
    }

    async networkId() {
        okOrThrow(this.connector, "Attempting to get network id from closed web3");
        return this.connector.networkId;
    }
}

const okOrThrow = (obj, msg) => {
    if(!obj) {
        throw new Error(msg);
    }
}