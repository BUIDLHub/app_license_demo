import Web3 from 'ald-web3';
import {Router, Handler} from './';


class H1 extends Handler {
    constructor(hitRes) {
        super("H1");
        this.hitRes = hitRes;

        [
            'init',
            'newBlock',
            'purgeBlocks'
        ].forEach(fn=>this[fn]=this[fn].bind(this))
    }

    async init(ctx, next) {
        return next();
    }

    async newBlock(ctx, block, next) {
        this.hitRes.hit = true;
        block._addedObject = {
            content: "something"
        }
        ctx.passThrough = true
        return next()
    }

    async purgeBlocks(ctx, blocks, next) {

    }


}

class H2 extends Handler {
    constructor(hitRes) {
        super("H2");
        this.hitRes = hitRes;
        [
            'init',
            'newBlock',
            'purgeBlocks'
        ].forEach(fn=>this[fn]=this[fn].bind(this))
    }

    async init(ctx, next) {
        return next();
    }

    async newBlock(ctx, block, next) {
        this.hitRes.hit = true;
        block._addedObject = {
            content: "something"
        }
        ctx.passThrough = true
        return next();
    }

    async purgeBlocks(ctx, blocks, next) {
        if(!ctx.passThrough) {
            this.hitRes.error = "Missing context pass through";
        }
        let obj = block._addedObject;
        if(!obj) {
            this.hitRes.error = "Missing object appended to block";
        }
        if(!obj.content) {
            this.hitRes.error = "Missing object property added to block";
        }
        return next();
    }
}

describe("Router", ()=>{
    it("should send block through registered handlers", done=>{
        let h1Res = {
            hit: false,
            error: null
        }
        let h2Res = {
            hit: false,
            error: null
        }

        let h1 = new H1(h1Res);
        let h2 = new H2(h2Res);
        let web3 = new Web3({
            id: 1,
            URL: "https://mainnet.infura.io"
        });
        let router = new Router({web3, config: web3.config})
        router.use(h1);
        router.use(h2);
        router.init().then(web3.start).then(async ()=>{
            await sleep(1000);
            await web3.stop();
            if(!h1Res.hit) {
                return done(new Error("First handler never received block"));
            }
            if(h1Res.error) {
                return done(h1Res.error);
            }
            if(!h2Res.hit) {
                return done(new Error("Second handler never received block"));
            }
            if(h2Res.error) {
                return done(h2Res.error);
            }
            done();
        })
    }).timeout(15000);
});

const sleep = ms => {
    return new Promise(done=>{
        setTimeout(done, ms);
    })
}