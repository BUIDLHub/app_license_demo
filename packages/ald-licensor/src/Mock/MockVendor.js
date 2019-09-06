import * as DBNames from 'Redux/cache/DBNames';
import {Logger, sleep} from 'buidl-utils';
import  {
    Vendor
} from 'ald-middleware';
import Base from './Base';
const log = new Logger({component: "MockVendor"});

let inst = null;
export default class MockVendor extends Base {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        this.vendorCounter = 0;
        this.simulatedDelay = props.simulatedDelay || 5000;
        [
            'init',
            'isVendor',
            'getVendorInfo',
            'registerVendor',
            'withdrawFunds'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }

    async init() {
       
            let r = await this.db.readAll({
                database: DBNames.Vendor, 
                filterFn: (v) => {
                    return v.account === this.account
                }
            });
            this.vendorCounter = r?r.length+1:1;
        
    }

    isVendor() {
        return this.promEvent()(async pEvt=>{
            let r = await  await this.db.readAll({
                database: DBNames.Vendor, 
                filterFn: (v) => {
                    return v.account === this.account
                }
            });
            if(r && r.length > 0) {
                return true;
            }
            return false;
        });
    }

    getVendorInfo() {
        return this.promEvent()(async pEvt=>{
            let r = await  await this.db.readAll({
                database: DBNames.Vendor, 
                filterFn: (v) => {
                    return v.account === this.account
                }
            });
            if(r && r.length > 0) {
                return r[0];
            }
            return null;
        });
    }

    registerVendor(name, callback) {
        return this.promEvent()(async pEvt =>{
            try {
                //simulate a txn hash, etc.
                this.sendTxnHash(pEvt);

                //first see if in local DB
                let r = await this.db.readAll({
                    database: DBNames.Vendor, 
                    filterFn: (v) => {
                        return v.account === this.account
                    }
                });
                if(r && r.length > 0) {
                    let err = new Error("Already registered");
                    pEvt.reject(err);
                    if(callback) {
                        return callback(err)
                    }
                }
    
                let v = new Vendor({
                    name: name, 
                    vendorID: ""+this.vendorCounter,
                    productCount: 0,
                    account: this.account
                });
                
                await this.db.create({
                    database: DBNames.Vendor,
                    key: v.vendorID,
                    data: v
                })
                ++this.vendorCounter;
                await sleep(this.simulatedDelay);
                
                pEvt.resolve([v]);
                if(callback) {
                    return callback(null, [v]);
                }
               
            } catch (e) {
                log.error("Problem submitting txn", e);
                pEvt.reject(e);
                if(callback) {
                    return callback(e);
                }
            }
        });
        
    }

    withdrawFunds(callback) {
        return this.promEvent()(async defer=>{
            try {
                defer.resolve([]);
                if(callback) {
                    return callback(null, []);
                }
                
            } catch (e) {
                log.error("Problem withdrawing funds", e);
                if(callback) {
                    return callback(e);
                }
            }
        });
        
    } 
}