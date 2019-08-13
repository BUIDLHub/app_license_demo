import {Logger} from 'ald-utils';
import API from './BaseAPI';
import Factory from '../model/ModelFactory';
import * as DBNames from '../DBNames';

const log = new Logger({component: "VendorAPI"});

let inst = null;
export default class VendorAPI extends API {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        [
            'isVendor',
            'getVendorInfo',
            'registerVendor',
            'withdrawFunds'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }

    async isVendor() {
        //first check DB
        let r = await this.db.read({
            database: DBNames.Vendor,
            key: this.account
        });
        if(r) {
            return true;
        }
        //then on-chain
        let info = await this.getVendorInfo(true);

        if(info && info.vendorID > 0) {
            await this.db.create({
                database: DBNames.Vendor,
                key: this.account,
                data: info
            });
            return true;
        }
        return false;
    }

    async getVendorInfo(refresh) {
        //first see if in local DB
        if(!refresh) {
            let r = await this.db.read({
                database: DBNames.Vendor,
                key: this.account
            });
            if(r) {
                return r;
            }
        }
        

        let info = await this.contract.methods.vendorInfo(this.account).call({
            from: this.account
        });
        if(info[0].toString() === "0") {
            return null;
        }

        let model = Factory.buildModel({
            vendorID: info[0].toString()-0,
            productCount: info[1].toString()-0,
            name: info[2],
            type: "VendorInfo"
        });
        if(model) {
            await this.db.create({
                database: DBNames.Vendor,
                key: this.account,
                data: model
            });
        }
        return model;
    }

    async registerVendor(name, callback) {
        try {
            //first see if in local DB
            let r = await this.db.read({
                database: DBNames.Vendor,
                key: this.account
            });
            if(r) {
                return callback(new Error("Already registered"))
            }

            let txn = await this.contract.methods.registerVendor(name).send({
                from: this.account
            });
            let events = txn.events || {};
            
            let v = Factory.parseModels(txn);
            if(v) {
                return callback(null, v);
            } else {
                log.error("Txn did not contain vendor event", txn);
                return callback(new Error("Could not extract vendor event from txn"));
            }
        } catch (e) {
            log.error("Problem submitting txn", e);
            return callback(e);
        }
    }

    async withdrawFunds(callback) {
        try {
            let txn = await this.contract.methods.withdrawVendorBalance().send({
                from: this.account
            });
            let models = Factory.parseModels(txn);
            if(models) {
                return callback(null, models);
            } else {
                log.error("Could not extract withdraw details from txn", txn);
                return callback(new Error("No withdraw details from txn"));
            }
        } catch (e) {
            log.error("Problem withdrawing funds", e);
            return callback(e);
        }
    } 
}