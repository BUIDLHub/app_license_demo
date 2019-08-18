import {Logger} from 'buidl-utils';
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

    isVendor() {
        return this.promEvent()(async defer=>{
            //first check DB
            let r = await this.db.readAll({
                database: DBNames.Vendor, 
                filterFn: (v) => {
                    return v.account === this.account
                }
            });
            if(r && r.length > 0) {
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
        });
    }

    getVendorInfo(refresh) {

        return this.promEvent()(async defer=>{
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
                from: this.account,
                gasLimit: 100000
            });
            console.log("Result", info);

            if(info[0].toString() === "0") {
                return null;
            }

            let model = Factory.buildModel({
                vendorID: info[0].toString()-0,
                productCount: info[1].toString()-0,
                name: info[2],
                account: this.account,
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
        });
        
    }

    registerVendor(name, callback) {
        return this.promEvent()(async pEvt=>{
            console.log("PromEvent", pEvt);
            try {
                //first see if in local DB
                let r = await this.db.read({
                    database: DBNames.Vendor,
                    key: this.account
                });
                if(r) {
                    let err = new Error("Already registered");
                    pEvt.reject(err);
                    return callback(err)
                }
    
                let p = this.contract.methods.registerVendor(name).send({
                    from: this.account
                });
                this.transferPromEvents(p, pEvt);

                let txn = await p;
                let events = txn.events || {};
                
                let res = Factory.parseModels(txn, {account: this.account});
                if(res) {
                    if(res.length > 0) {
                        for(let i=0;i<res.length;++i) {
                            let v = res[i];
                            if(v.vendorID) {
                                await this.db.create({
                                    database: DBNames.Vendor,
                                    key: v.vendorID,
                                    data: v
                                })
                            }
                        }
                    }
                    pEvt.resolve(res);
                    return callback(null, res);
                } else {
                    log.error("Txn did not contain vendor event", txn);
                    let err = new Error("Could not extract vendor event from txn");
                    pEvt.reject(err);
                    return callback(err);
                }
            } catch (e) {
                log.error("Problem submitting txn", e);
                pEvt.reject(e);
                return callback(e);
            }
        });

        
    }

    withdrawFunds(callback) {
        return this.promEvent()(async pEvt=>{
            try {
                let p = await this.contract.methods.withdrawVendorBalance().send({
                    from: this.account
                });
                this.transferPromEvents(p, pEvt);
                let txn = await p;
                let models = Factory.parseModels(txn);
                if(models) {
                    pEvt.resolve(models);
                    return callback(null, models);
                } else {
                    log.error("Could not extract withdraw details from txn", txn);
                    let err = new Error("No withdraw details from txn");
                    pEvt.reject(err);
                    return callback(err);
                }
            } catch (e) {
                log.error("Problem withdrawing funds", e);
                pEvt.reject(e);
                return callback(e);
            }
        });
        
    } 
}