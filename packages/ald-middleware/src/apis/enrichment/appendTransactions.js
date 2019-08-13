import {Logger} from 'ald-utils';
import {Handler} from 'ald-block-router';

const log = new Logger({component: "AppendTransactions"});


export default class AppendTransactions extends Handler {
    constructor() {
        super("AppendTransactions");
        [
            'init',
            'newBlock',
            'purgeBlocks'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async init(ctx, next) {
        return next();
    }


    async newBlock(ctx, block, next) {
        if(!block.transactions || block.transactions.length === 0 || typeof block.transactions[0] === 'string') {
            log.debug("Requesting transactions for block", block.number);
            let s = Date.now();
            let txns = await ctx.web3.transactions(block);
            log.debug("Retrieved", txns.length,"txns in", (Date.now()-s),"ms");
            block.transactions = txns.map(t=>({
                ...t,
                timetstamp: block.timestamp
            }));
        } else {
            log.debug("Block", block.number, "already has transactions");
            block.transactions = block.transactions.map(t=>({
                ...t,
                timestamp: block.timestamp
            }));
        }
        return next();
    }

    async purgeBlocks(ctx, blocks, next) {
        return next();
    }
}