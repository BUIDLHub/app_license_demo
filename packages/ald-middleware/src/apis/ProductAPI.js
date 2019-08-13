import {Logger} from 'ald-utils';
import API from './BaseAPI';
import Factory from '../model/ModelFactory';
import * as DBNames from '../DBNames';
import VendorAPI from './VendorAPI';

const log = new Logger({component: "ProductAPI"});
let inst = null;

export default class ProductAPI extends API {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        [
           'getProducts',
           'getProductInfo',
            'registerProduct'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }

    async getProducts(start, limit, refresh) {
        try {
            let info = await VendorAPI.instance.getVendorInfo(true);
            if(!info) {
                throw new Error("Not registered as a vendor");
            }

            if(!refresh) {
                let r = await this.db.readAll({
                    database: DBNames.Product,
                    filterFn: (v, k, itNum) => {
                        return v.vendorID === info.vendorID;
                    }
                });
                if(r) {
                    return r;
                }
            }

            let stop = Math.min(start+limit,info.productCount);
            let res = [];
            let calls = [];
            for(let i=start;i<stop;++i) {
                calls.push(this.contract.methods.vendorProductInfo(info.vendorID, i).call({from: this.account}));
            }
            let outs = await Promise.all(calls);
            for(let i=0;i<outs.length;++i) {
                let o = outs[i];
                
                let p = Factory.buildModel({
                    type: "ProductInfo",
                    vendorID: o[0].toString()-0,
                    productID: o[1].toString()-0,
                    specCount: o[2].toString()-0,
                    licenseCount: o[3].toString()-0,
                    name: o[4]
                });
                if(p) {
                    await this.db.create({
                        database: DBNames.Product,
                        key: p.productID,
                        data: p
                    });
                    res.push(p);
                }
            }
                
           return res;
        } catch (e) {
            log.error("Problem getting products for current vendor account", e);
            throw e;
        }
    }

    async getProductInfo(prodId, refresh) {
        let prod = null;
        if(!refresh) {
            prod = await this.db.read({
                database: DBNames.Product,
                key: prodId
            });
        }

        if(!prod) {
            let o = await this.contract.methods.productInfo(prodId).call({from: this.account});
            let p = Factory.buildModel({
                type: "ProductInfo",
                vendorID: o[0].toString()-0,
                productID: o[1].toString()-0,
                specCount: o[2].toString()-0,
                licenseCount: o[3].toString()-0,
                name: o[4]
            });
            if(p) {
                await this.db.create({
                    database: DBNames.Product,
                    key: p.productID,
                    data: p
                });
                prod = p;
            }
        }
        return prod;
    }

    async registerProduct(name, callback) {
        try {
            let info = await VendorAPI.instance.getVendorInfo();
            let txn = await this.contract.methods.registerProduct(name).send({
                from: this.account
            });
            let events = txn.events || {};
            let v = Factory.parseModels(txn, {
                vendorID: info.vendorID,
                specCount: 0,
                licenseCount: 0
            });
            if(v) {
                return callback(null, v);
            } else {
                log.error("Txn did not contain vendor event", txn);
                return callback(new Error("Could not extract vendor event from txn"));
            }
        } catch (e) {
            log.error("Problem registering product", e);
            return callback(e);
        }
    }

    
}