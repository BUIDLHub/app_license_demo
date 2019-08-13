import API from './ProductAPI';
import VendorAPI from './VendorAPI';
import Web3 from 'ald-web3';
import TestSeed from '../TestSeed.json';
import {Router} from 'ald-block-router';
import DB from 'ald-db';
import * as DBNames from '../DBNames';
import _ from 'lodash';

describe("ProductAPI", ()=>{
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

    

    it("Should get product info for root vendor", done=>{
        let w3 = web3.connector.web3;
        web3.start().then(async ()=>{
            let cfg = {
                web3: w3,
                router,
                db,
                address: TestSeed.contract,
                account: accounts[0]
            };
            new VendorAPI(cfg);
            let api = new API(cfg);
            api.getProducts(0, 50, true).then( async (prods)=>{
                
                if(prods.length === 0) {
                    return done(new Error("Expected a root product from contract"));
                }
                if(prods[0].vendorID !== 1) {
                    console.log("Invalid product", prods[0]);
                    return done(new Error("Invalid product found"));
                }
                console.log("Products", prods);
                await web3.stop();
                await router.close();
                done();
            }).catch(async e=>{
                await web3.close();
                await router.close();
                done(e);
            });
        });
    });

    it("Should register product for vendor", done=>{
        let w3 = web3.connector.web3;
        web3.start().then(async ()=>{
            let api = new API({
                web3: w3,
                router,
                db,
                address: TestSeed.contract,
                account: accounts[0]
            });
            api.registerProduct("TestProduct", async (e, res)=>{
                if(e) {
                    await web3.stop();
                    await router.close();
                    return done(e);
                }
                console.log("Registration Results", res);

                api.getProducts(0, 50, true).then(async (prods)=>{
                    if(e) {
                        return done(e);
                    }
                    console.log("New prods", prods);
                    if(prods.length !==2) {
                        return done(new Error("Expected 2 products for root vendor account"));
                    }
                    if(prods[1].vendorID !== 1) {
                        console.log("Invalid product", prods[1]);
                        return done(new Error("Invalid product found"));
                    }
                    console.log("Products", prods);
                    await web3.stop();
                    await router.close();
                    done();
                }).catch(async e=>{
                    await web3.close();
                    await router.close();
                    done(e);
                });
            });
            
        });
    });
    
});
