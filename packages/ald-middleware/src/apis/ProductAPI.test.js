import API from './ProductAPI';
import VendorAPI from './VendorAPI';
import Web3 from 'web3';
import TestSeed from '../TestSeed.json';
import DB from 'buidl-storage';
import * as DBNames from '../DBNames';
import _ from 'lodash';

describe("ProductAPI", ()=>{
    let web3 = null;
    let db = null;
    let accounts = [];
    beforeEach(async ()=>{
        let http = new Web3.providers.HttpProvider(process.env.WEB3_URL);
        let provider = new Web3HDWalletProvider(TestSeed.seed, http, 0, 10);
        web3 = new Web3(provider);      
        db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        accounts = await web3.eth.getAccounts();
    });

    

    it("Should get product info for root vendor", done=>{
        let cfg = {
            web3: w3,
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
            done();
        }).catch(async e=>{
            done(e);
        });
    });

    it("Should register product for vendor", done=>{
       let api = new API({
            web3,
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
                done();
            }).catch(async e=>{
                done(e);
            });
        });
    });
    
});
