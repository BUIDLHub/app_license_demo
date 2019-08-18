import API from './SpecsAPI';
import Web3 from 'web3';
import Web3HDWalletProvider from 'web3-hdwallet-provider';
import TestSeed from '../TestSeed.json';
import DB from 'buidl-storage';
import * as DBNames from '../DBNames';
import _ from 'lodash';
import ProductAPI from './ProductAPI';

describe("SpecsAPI", ()=>{
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


    it("Should register and get license specs for product", done=>{
        let cfg = {
            web3,
            db,
            address: TestSeed.contract,
            account: accounts[0]
        };
        new ProductAPI(cfg);
        let api = new API(cfg);

        api.getAllLicenseSpecsForProduct(1, true).then(async start=>{
            //prodId, name, price, duration, callback
            api.registerLicenseSpecs(1, "Test Feature", 250000, 86400, async (e, res)=>{

                if(e) {
                    await hdWallet.engine.stop();
                    return done(e);
                }
                console.log("Spec Registration", res);

                api.getAllLicenseSpecsForProduct(1, true).then( async (res)=>{
                    await hdWallet.engine.stop();

                    console.log("License Specs", res);
                    if(res.length === start.length) {
                        console.log("SPECS", res);
                        return done(new Error("Expected a new spec registered"));
                    }
                    
                    done();

                }).catch(async e=>{
                    done(e);
                })
            })
        })
        
        
    })
    
    
});
