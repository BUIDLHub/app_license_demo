import * as DBNames from 'Redux/cache/DBNames';

import {Logger, sleep} from 'buidl-utils';
import  {
    Product
} from 'ald-middleware';
import Vendor from './MockVendor';
import Base from './Base';

const log = new Logger({component: "MockProduct"});

let inst = null;
export default class MockProduct extends Base {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        this.productCounter = 1;
        [
            'getProducts',
            'getProductInfo',
             'registerProduct',
             'init'
         ].forEach(fn=>this[fn]=this[fn].bind(this));
         inst = this;
     }
 
     async init() {
         
        let r = await this.db.readAll({
            database: DBNames.Product
        });
        this.productCounter = r?r.length+1:1;
         
     }

     getProducts(start, limit, refresh) {
         return this.promEvent()(async defer=>{
            try {
                let isV = await Vendor.instance.isVendor();
                if(!isV) {
                    //not registered yet
                    return [];
                }
                let info = await Vendor.instance.getVendorInfo(true);
                if(!info) {
                    throw new Error("Not registered as a vendor");
                }
                
                let r = [];
                await this.db.iterate({
                   database: DBNames.Product,
                   callback: (dbVal, dbKey, itNum) =>{
                       if(itNum >= start && r.length < limit) {
                           if(dbVal.vendorID === info.vendorID) {
                               r.push(dbVal);
                           }
                       }
                   }
               });
               return r;
            } catch (e) {
                log.error("Problem getting products for current vendor account", e);
                throw e;
            }
         });
         
     }
 
     getProductInfo(prodId, refresh) {
         return this.promEvent()(async defer=>{
            let prod = await this.db.read({
                database: DBNames.Product,
                key: prodId
            });
            return prod;
         });
     }
 
     registerProduct(name, callback) {
         return this.promEvent()(async defer=>{
            try {
                //simulate a txn hash, etc.
                this.sendTxnHash(defer);

                let info = await Vendor.instance.getVendorInfo();
                 let p = new Product({
                     name: name,
                     vendorID: info.vendorID,
                     productID: ""+this.productCounter,
                     specCount: 0,
                     licenseCount: 0
                 });
                await this.db.create({
                    database: DBNames.Product,
                    key: p.productID,
                    data: p
                });
                ++this.productCounter;
                await sleep(this.simulatedDelay);
                defer.resolve([p]);
                if(typeof callback === 'function') {
                    return callback(null, [p]);
                }
             } catch (e) {
                 log.error("Problem registering product", e);
                 defer.reject(e);
                 if(typeof callback === 'function') {
                    return callback(e);
                 }
             }
         });
         
     }
}