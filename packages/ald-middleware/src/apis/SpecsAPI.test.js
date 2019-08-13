import API from './SpecsAPI';
import Web3 from 'ald-web3';
import TestSeed from '../TestSeed.json';
import {Router} from 'ald-block-router';
import DB from 'ald-db';
import * as DBNames from '../DBNames';
import _ from 'lodash';

describe("SpecsAPI", ()=>{
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

    
    it("Should register and get license specs for product", done=>{
        let w3 = web3.connector.web3;
        web3.start().then(async ()=>{
            let api = new API({
                web3: w3,
                router,
                db,
                address: TestSeed.contract,
                account: accounts[0]
            });

            let start = await api.getAllLicenseSpecsForProduct(1, true);
            
            //prodId, name, price, duration, callback
            api.registerLicenseSpecs(1, "Test Feature", 250000, 86400, async (e, res)=>{
                if(e) {
                    return done(e);
                }
                console.log("Spec Registration", res);

                api.getAllLicenseSpecsForProduct(1, true).then( async (res)=>{
                    await web3.stop();
                    await router.close();

                    console.log("License Specs", res);
                    if(res.length === start.length) {
                        console.log("SPECS", res);
                        return done(new Error("Expected a new spec registered"));
                    }
                    
                    done();

                }).catch(async e=>{
                    await web3.stop();
                    await router.close();
                    done(e);
                })
            })

            
            
        });
    })
    
    
});



const sleep = ms => {
    return new Promise(done=>setTimeout(done, ms));
}