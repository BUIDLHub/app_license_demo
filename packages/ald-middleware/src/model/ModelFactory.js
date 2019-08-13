import Vendor from './Vendor';
import Product from './Product';
import _ from 'lodash';
import {Logger} from 'ald-utils';
import Specs from './Specs';
import License from './License';
import Withdraw from './Withdraw';

const log = new Logger({component: "ModelFactory"});

export default class ModelFactory {
    static parseModels(txn, extra) {
        log.debug("Extract event models from txn", txn);
        let events = txn.events || {};
        let res = {};
        _.keys(events).forEach(n=>{
            let details = events[n];
            if(!Array.isArray(details))  {
                let a = [details];
                details = a;
            }
            let fn = factoryMethods[n];
            if(fn) {
                res[n] = fn(txn, details, extra);
            }
        });
        return res;
    }

    static buildModel(data) {
        let fn = factoryMethods[data.type];
        if(fn) {
            return fn(data);
        }
        return undefined;
    }
}

const factoryMethods = {
    VendorRegistered: (txn,details, extra) => {
        return details.map(d=>{
            return new Vendor({
                ...d.returnValues,
                ...extra,
                productCount: 0
            });
        })
    },

    ProductRegistered: (txn,details, extra) => {
        return details.map(d=>{
            return new Product({
                ...d.returnValues,
                ...extra
            });
        })
    },

    SpecsRegistered: (txn, details, extra) => {
        return details.map(d=>{
            //
            return new Specs({
                ...d.returnValues,
                ...extra
            })
        })
    },

    LicenseIssued: (txn, details, extra) => {
        return details.map(d=>{
            return new License({
                ...d.returnValues,
                ...extra
            })
        })
    },

    VendorWithdraw: (txn, details, extra) => {
        return details.map(d=>{
            return new Withdraw({
                ...d.returnValues,
                ...extra
            })
        })
    },

    VendorInfo: (data) => {
        return new Vendor(data);
    },

    ProductInfo: (data) => {
        return new Product(data);
    },

    SpecsInfo: (data) => {
        return new Specs(data);
    },

    LicenseInfo: (data) => {
        return new License(data);
    },

    WithdrawInfo: (data) => {
        return new Withdraw(data);
    }
}