/**
 * Router handler that retrieves receipts for each transactions and appends them to the txn objects
 */
import {Logger} from 'ald-utils'
import {Handler} from 'ald-block-router'

const log = new Logger({component: 'AppendReceipts'});

export default class ReceiptHandler extends Handler {
    constructor() {
        super("ReceiptHandler");
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
        let txns = block.transactions;
        if(!txns || txns.length === 0) {
            return next();
        }
        let all = [];
        log.debug("Appending receipts to", txns.length,"transactions");
        let s = Date.now();
        txns.forEach(t=>{
            all.push(ctx.web3.receipt(t))
        });
        let rs = await Promise.all(all);
        log.debug("Retrieved", rs.length,"receipts in", (Date.now()-s),"ms");
        rs.forEach((r,i)=>{
            txns[i].receipt = r;
        });
        return next();
    }

    async purgeBlocks(ctx, blocks, next) {
        return next();
    }
}