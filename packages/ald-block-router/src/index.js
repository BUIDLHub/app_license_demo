import * as yup from 'yup';
import {Logger} from 'ald-utils';
import Handler from './Handler'

const schema = yup.object({
    web3: yup.object().required("Missing web3 for router")
});

const log = new Logger({component: "Router"});

class Router {
    constructor(props) {
        schema.validateSync(props);
        this.config = props.config;
        this.web3 = props.web3;
        if(!this.config) {
            this.config = this.web3.config;
            if(!this.config) {
                throw new Error("Must have a config object for router or provide as a field in web3 object");
            }
        }
        this.handlers = [];
        [
            'use',
            'newBlock',
            'init',
            'close',
            'purgeBlocks',
            '_callHandlers'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        
    }

    async init() {
        this.web3.on("block", this.newBlock);
        await this._callHandlers((ctx, handler, next) => {
            log.debug("Initializing handler", handler.name)
            return handler.init(ctx, next);
        });
    }

    async close() {
        this.web3.removeListener("block", this.newBlock);
    }

    use(handler) {
        if(!(handler instanceof Handler)) {
            throw new Error("Must be a Handler implementation")
        }
        /*
        if(typeof handler !== 'function') {
            throw new Error("Handlers are function with signature (ctx, block, next)")
        }
        */
        this.handlers.push(handler);
    }

    async newBlock(block) {
        if(!block || this.handlers.length === 0) {
            return;
        }
        await this._callHandlers((ctx,handler,next)=>{
            log.debug("Routing block", block.number,"to", handler.name);
            return handler.newBlock(ctx, block, next);
        });
    }

    async purgeBlocks(blocks) {
        await this._callHandlers((ctx,handler,next)=>{
            log.debug("Purging blocks using handler", handler.name);
            return handler.purgeBlocks(ctx, blocks, next)
        })
        
    }

    async _callHandlers(fn) {
        let ctx = {
            config: this.config,
            startTime: Date.now(),
            web3: this.web3
        }
        
        let idx = 0;
        let next = async () => {
            ++idx;
            if(idx < this.handlers.length) {
                let h = this.handlers[idx];
                log.debug("Calling handler", h.name)
                try {
                    await fn(ctx, h, next);
                } catch (e) {
                    log.error("Problem with block handler", idx, e);
                }
            } else {
                log.debug("Completed", idx, "route handlers in", (Date.now()-ctx.startTime),'ms');
            }
        }
        try {
            let h = this.handlers[0];
            log.debug("Calling handler", (h.name?h.name:"idx-"+idx));
            await fn(ctx, h, next);
        } catch (e) {
            log.error("Problem with block handlers", e);
        }
    }
}

export {
    Router,
    Handler
}