import API from './ProductAPI';
import VendorAPI from './VendorAPI';
import Web3 from 'web3';
import Web3HDWalletProvider from 'web3-hdwallet-provider';
import TestSeed from '../TestSeed.json';
import DB from 'buidl-storage';
import * as DBNames from '../DBNames';
import _ from 'lodash';

describe("ProductAPI", ()=>{
    let web3 = null;
    let db = null;
    let accounts = [];
    let hdWallet = null;
    beforeEach(async ()=>{
        let http = new Web3.providers.HttpProvider(process.env.WEB3_URL);
        hdWallet = new Web3HDWalletProvider(TestSeed.seed, http, 0, 10);
        web3 = new Web3(hdWallet);      
        db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        accounts = await web3.eth.getAccounts();
    });

    

    it("Should get product info for root vendor", done=>{
        let cfg = {
            web3,
            db,
            address: TestSeed.contract,
            account: accounts[0]
        };
        new VendorAPI(cfg);
        let api = new API(cfg);
        api.getProducts(0, 50, true).then( async (prods)=>{
            await hdWallet.engine.stop();

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
        let cfg = {
            web3,
            db,
            address: TestSeed.contract,
            account: accounts[0]
        };
        new VendorAPI(cfg);
        let api = new API(cfg);
        api.registerProduct("TestProduct", async (e, res)=>{
            
            if(e) {
                await hdWallet.engine.stop();
                return done(e);
            }
            console.log("Registration Results", res);

            api.getProducts(0, 50, true).then(async (prods)=>{
                await hdWallet.engine.stop();

                if(e) {
                    return done(e);
                }
                console.log("New prods", prods);
                if(prods.length === 1) {
                    return done(new Error("Expected more than 1 product for root vendor account"));
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
