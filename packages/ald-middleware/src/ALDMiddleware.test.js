import ALDMiddleware from './';
import Web3 from 'web3';
import Web3HDWalletProvider from 'web3-hdwallet-provider';
import TestSeed from './TestSeed.json';
import * as DBNames from './DBNames';
import DB from 'buidl-storage';
import _ from 'lodash';

const defaultCfg = {
    web3URL: "http://localhost:8545",
    mnemonic: TestSeed.seed,
    contractAddress: TestSeed.contract
}
describe("ALDMiddleware", ()=>{
    let web3 = null;
    let db = null;
    let mw = null;
    let hdwallet = null;
    beforeEach(async ()=>{
        let http = new Web3.providers.HttpProvider(process.env.WEB3_URL);
        let provider = new Web3HDWalletProvider(TestSeed.seed, http, 0, 10);
        hdwallet = provider;
        web3 = new Web3(provider);      
        db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        mw = new ALDMiddleware({
            web3,
            contractAddress: TestSeed.contract,
            storage: db
        });
        await mw.init();
    });

    it("Should get basic vendor info", done=>{
        setTimeout(async ()=>{
            let vInfo = await mw.getVendorInfo(true); //for read from on-chain 
            if(!vInfo) {
                return done(new Error("Should have gotten root vendor info"));
            }
            await hdwallet.engine.stop();
            done();
        }, 10);
    })

    it("Should get initial product info", done=>{
        setTimeout(async ()=>{
            try {
                let prods = await mw.getProducts(0, 50, true); //for read from on-chain 
                if(!prods || prods.length === 0) {
                    return done(new Error("Should have gotten root products"));
                }
                done();
            } finally {
                await hdwallet.engine.stop();
            }
        }, 10);
    });

    it("Should add license specs to root product", done=>{
        setTimeout(async ()=>{
            try {
                mw.registerLicenseSpecs(1, "Test Feature", 25000, 86400, async (e, res)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("License Specs", res);
                    done();
                });
            } finally {
                await hdwallet.engine.stop();
            }
        }, 10);
    });

    it("Should read license specs", done=>{
        setTimeout(async ()=>{
            try {
                let specs = await mw.getAllLicenseSpecsForProduct(1, true);
                console.log("product1 specs", specs);
                if(specs.length === 0) {
                    return done(new Error("Expected specs for root product"));
                }
                done();
            } finally {
                await hdwallet.engine.stop();
            }
        }, 10);
    });

    it("Should buy license", done=>{
        setTimeout(async ()=>{
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
                await hdwallet.engine.stop();
            }
        }, 10);
    });

    it("Should withdraw vendor funds", done=>{
        setTimeout(async ()=>{
            try {
                mw.withdrawFunds(async (e, res)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("Withdraw results", res);
                    done();
                });
            } finally {
                await hdwallet.engine.stop();
            }
        }, 10);
    });
});