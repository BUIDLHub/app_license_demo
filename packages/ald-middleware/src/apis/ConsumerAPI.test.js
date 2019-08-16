import API from './ConsumerAPI';
import ProductAPI from './ProductAPI';
import SpecsAPI from './SpecsAPI';
import Web3 from 'web3';
import Web3HDWalletProvider from 'web3-hdwallet-provider';
import TestSeed from '../TestSeed.json';
import DB from 'buidl-storage';
import * as DBNames from '../DBNames';
import _ from 'lodash';

const dotenv = require("dotenv");
dotenv.config();


describe("ConsumerAPI", ()=>{
    let web3 = null;
    let db = null;
    let accounts = [];
    let hdWallet = null;
    beforeEach(async ()=>{
        let http = new Web3.providers.HttpProvider(process.env.WEB3_URL);
        let provider = new Web3HDWalletProvider(TestSeed.seed, http, 0, 10);
        hdWallet = provider;
        web3 = new Web3(provider);      
        db = new DB({
            dbPrefix: "ald-"
        });
        await db.clearAll(_.keys(DBNames).map(k=>DBNames[k]));
        accounts = await web3.eth.getAccounts();
    });

    

    it("Should purchase license", done=>{
       
        let cfg = {
            web3,
            db,
            address: TestSeed.contract,
            account: accounts[0]
        };
        let prod = new ProductAPI(cfg);
        let specs = new SpecsAPI(cfg);
        let api = new API(cfg);
        api.account = accounts[1];
        let events = null;
        let fail = null;
        specs.registerLicenseSpecs(1, "Test Feature", 250000, 86400, async (e, res)=>{
            api.buyLicense(1, 1, async (e, res)=>{
                if(e) { 
                    fail = e 
                }  else {
                    events = res;
                }
            }).then(async ()=>{
                if(fail) {
                    return done(fail);
                }
                await hdWallet.engine.stop();
                console.log("Results", events);
                done();
            }).catch(async e=>{
                done(e);
            });
        }).catch(done);
        
        
    });

   
    
});
