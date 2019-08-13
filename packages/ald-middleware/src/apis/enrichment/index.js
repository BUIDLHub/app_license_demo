import AppendTxns from './appendTransactions';
import AppendRcpts from './appendReceipts';
import {Handler} from 'ald-block-router';
import {Logger} from 'ald-utils';

const handlers = [
    new AppendTxns(),
    new AppendRcpts()
];

const log = new Logger({component: "EnrichmentHandler"})

export default class MainHandler extends Handler {

    constructor() {
        super("EnrichmentHandlers");
        [
            'init',
            'newBlock',
            'purgeBlocks',
            '_callHandlers'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }
 
    async init(ctx, next) {
        await this._callHandlers(ctx, next, (_ctx, h, _next)=> {
            return h.init(_ctx, _next);
        })
    }

    async newBlock(ctx, block, next) {
        await this._callHandlers(ctx, next, async (_ctx, h, _next)=>{
            log.info("Sending block", block.number,"to handler",h.name);
            await h.newBlock(_ctx, block, _next);
            log.info("Handler", h.name, "done with block", block.number);
        })
    }

    async purgeBlocks(ctx, blocks, next) {
        await this._callHandlers(ctx, next, (_ctx, h, _next)=>{
            return h.purgeBlocks(_ctx, blocks, _next)
        }) 
    }

    async _callHandlers(ctx, next, fn) {
        let idx = 0;
        let _next = async () => {
            ++idx;
            log.debug("sub-next called", idx);
            if(idx >= handlers.length) {
                log.debug("Finished routing to", handlers.length,"enrichment handlers");
                return next();
            }
            let h = handlers[idx];
            await fn(ctx, h, _next);
        }
        await fn(ctx, handlers[0],_next);
    }
}