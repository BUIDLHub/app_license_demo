import API from './VendorAPI';
import Web3 from 'ald-web3';
import TestSeed from '../TestSeed.json';
import {Router} from 'ald-block-router';
import DB from 'ald-db';
import * as DBNames from '../DBNames';
import _ from 'lodash';

describe("VendorAPI", ()=>{
    let web3 = null;
    let router = null;
    let db = null;
    let accounts = [];
    beforeEach(async ()=>{
        let cfg = {
            id: 1,
            URL: "http://localhost:8545",
            mnemonic: TestSeed.seed,
            numAddresses: 10
        };
        db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        web3 = new Web3(cfg);
        return web3.open().then(async ()=>{
            let w = web3.connector.web3;
            let accts = await w.eth.getAccounts();
            router = new Router({web3: web3});
            accounts = accts;
        })
    });

    it("Should have root account as vendor", done=>{
        let w3 = web3.connector.web3;
        web3.start().then(async ()=>{
            let api = new API({
                web3: w3,
                router,
                db,
                address: TestSeed.contract,
                account: accounts[0]
            })
            let isReg = await api.isVendor();
            await web3.stop();
            await router.close();
            if(!isReg) {
                return done(new Error("Expected root account to be registered as vendor"));
            }
            done();
        });
    });

    it("Should register vendor with callbacks", done=>{
            let w3 = web3.connector.web3;
             web3.start().then(async ()=>{
                let api = new API({
                    web3: w3,
                    router,
                    db,
                    address: TestSeed.contract,
                    account: accounts[1]
                });
                api.registerVendor("Test vendor", async (e,v)=>{
                    if(e) {
                        return done(e);
                    }

                    let info = await api.getVendorInfo();
                    console.log("Vendor info", info);
                    await web3.stop();
                    await router.close();
                    if(e) {
                        return done(e);
                    }
                    console.log("Vendor registered", v);
                    
                    done();
                })
            })
    }).timeout(20000);
    
});