import ALDMiddleware from './';
import TestSeed from './TestSeed.json';
import * as DBNames from './DBNames';
import DB from 'ald-db';
import _ from 'lodash';

const defaultCfg = {
    web3URL: "http://localhost:8545",
    mnemonic: TestSeed.seed,
    contractAddress: TestSeed.contract
}
describe("ALDMiddleware", ()=>{
    let mw = null;
    beforeEach(async () => {
        let db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        mw = new ALDMiddleware(defaultCfg);
    });

    it("Should get basic vendor info", done=>{
        mw.start().then(async ()=>{
            let vInfo = await mw.getVendorInfo(true); //for read from on-chain 
            if(!vInfo) {
                return done(new Error("Should have gotten root vendor info"));
            }
            await mw.stop();
            done();
        });
    })

    it("Should get initial product info", done=>{
        mw.start().then(async ()=>{
            try {
                let prods = await mw.getProducts(0, 50, true); //for read from on-chain 
                if(!prods || prods.length === 0) {
                    return done(new Error("Should have gotten root products"));
                }
                done();
            } finally {
                await mw.stop();
            }
        });
    });

    it("Should add license specs to root product", done=>{
        mw.start().then(async ()=>{
            try {
                mw.registerLicenseSpecs(1, "Test Feature", 25000, 86400, async (e, res)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("License Specs", res);
                    done();
                });
            } finally {
                await mw.stop();
            }
        });
    });

    it("Should read license specs", done=>{
        mw.start().then(async ()=>{
            try {
                let specs = await mw.getAllLicenseSpecsForProduct(1, true);
                console.log("product1 specs", specs);
                if(specs.length === 0) {
                    return done(new Error("Expected specs for root product"));
                }
                done();
            } finally {
                await mw.stop();
            }
        });
    });

    it("Should buy license", done=>{
        mw.start().then(async ()=>{
            mw._setConsumerAccount(mw.accounts[1]);
            try {
                mw.buyLicense(1, 1, async (e, res)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("Purchase result", res);
                    done();
                })
            } finally {
                await mw.stop();
            }
        });
    });

    it("Should withdraw vendor funds", done=>{
        mw.start().then(async ()=>{
            try {
                mw.withdrawFunds(async (e, res)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("Withdraw results", res);
                    done();
                });
            } finally {
                await mw.stop();
            }
        });
    });
});