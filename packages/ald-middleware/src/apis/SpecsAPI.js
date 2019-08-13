import {Logger} from 'ald-utils';
import API from './BaseAPI';
import Factory from '../model/ModelFactory';
import * as DBNames from '../DBNames';
import ProductAPI from './ProductAPI';

const log = new Logger({component: "SpecsAPI"});

let inst = null;
export default class SpecsAPI extends API {
    static get instance() {
        return inst;
    }
    constructor(props) {
        super(props);
        [
            'getAllLicenseSpecsForProduct',
            'getLicenseSpecs',
            'registerLicenseSpecs'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }
    
    async getAllLicenseSpecsForProduct(prodId, refresh) {
        let prod = await ProductAPI.instance.getProductInfo(prodId, refresh);
        
        if(!prod) {
            throw new Error("Could not find product with id: " + prodId);
        }
        let calls = [];
        for(let i=0;i<prod.specCount;++i) {
            calls.push(this.getLicenseSpecs(prodId, i+1));
        }
        let res = await Promise.all(calls);
        res = res.filter(v=>v !==null && typeof v !== 'undefined');
        return res;
    }

    async getLicenseSpecs(prodId, specId) {
        let r = await this.db.read({
            database: DBNames.Specs,
            key: prodId + "_" + specId
        });
        if(r) {
            return r;
        }

       let o = await this.contract.methods.licenseSpecsInfo(prodId, specId).call({from: this.account})
       
       let s = Factory.buildModel({
            type: "SpecsInfo",
            productID: prodId,
            specID: specId,
            price: o[0],//keep as BN
            attributes: o[1].toString(),
            duration: o[2].toString()-0,
            name: o[3]
        });
        if(s) {
            await this.db.create({
                database: DBNames.Specs,
                key: prodId + "_" + specId,
                data: s
            });
        }
        return s;
    }

    //_productID, _attributes,_name,_price,_duration
    async registerLicenseSpecs(prodId, name, price, duration, callback) {
        try {
            //TODO: Eventually, attributes will have something meaningful.
            let txn = await this.contract.methods.registerLicenseSpecs(prodId, 0, name, price, duration).send({
                from: this.account
            });
            
            let v = Factory.parseModels(txn);
            if(v) {
                return callback(null, v);
            } else {
                log.error("Txn did not contain specs event", txn);
                return callback(new Error("Could not extract specs event from txn"));
            }
        } catch (e) {
            log.error("Problem creating license specs", e);
            return callback(e);
        }
    }
}