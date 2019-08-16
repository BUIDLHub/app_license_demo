import API from './VendorAPI';
import Web3 from 'web3';
import Web3HDWalletProvider from 'web3-hdwallet-provider';
import TestSeed from '../TestSeed.json';
import DB from 'buidl-storage';
import * as DBNames from '../DBNames';
import _ from 'lodash';
import { promisify } from 'util';

describe("VendorAPI", ()=>{
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

    it("Should have root account as vendor", done=>{
        let api = new API({
            web3,
            db,
            address: TestSeed.contract,
            account: accounts[0]
        })
        setTimeout(async ()=>{
            let isReg = await api.isVendor();
            if(!isReg) {
                return done(new Error("Expected root account to be registered as vendor"));
            }
            done();
        }, 10);
        
    });

    it("Should register vendor with callbacks", done=>{
        let api = new API({
                web3,
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
            if(e) {
                return done(e);
            }
            console.log("Vendor registered", v);
            
            done();
        })
    }).timeout(20000);
    
});