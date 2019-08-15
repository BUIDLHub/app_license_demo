import {Logger} from 'buidl-utils';
import API from './BaseAPI';
import Factory from '../model/ModelFactory';
import * as DBNames from '../DBNames';
import Specs from './SpecsAPI';
import ProductAPI from './ProductAPI';

const log = new Logger({component: "ConsumerAPI"});

export default class ConsumerAPI extends API {
    constructor(props) {
        super(props);
        [
            'getLicenses',
            'getLicenseInfo',
            'buyLicense',
            'checkLicense',
            'verifyLicenseOwnership'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async getLicenseInfo(prodId, specId, refresh) {
        if(!refresh) {
            let r = await this.db.read({
                database: DBNames.License,
                key: prodId + "_" + specId
            });
            if(r) {
                return r;
            }
        }
        let id = await this.contract.methods.findLicenseID(prodId, specId).call({
            from: this.account
        });
        if(id) {
            let lic = await this.contract.methods.licenseInfo(id).call({from: this.account});
            if(lic && lic.licenseID) {
                await this.db.create({
                    database: DBNames.License,
                    key: prodId + "_" + specId,
                    data: lic
                });
                return lic;
            }
        }
        return null;
    }

    async getLicenses(prodId, refresh) {
        if(!refresh) {
            let r = await this.db.readAll({
                database: DBNames.License,
                filterFn: (v) => {
                    return (v.productID === prodId && v.account === this.account)
                }
            });
            if(r.length >0) {
                return r;
            }
        }

        let prod = await ProductAPI.instance.getProductInfo(prodId);
        if(!prod || !prod.productID) {
            return [];
        }
        let calls = [];
        for(let i=1;i<=prod.specCount;++i) {
            calls.push(this.getLicenseInfo(prodId, i));
        }
        let lics = await Promise.all(calls);
        return lics.filter(l=>{
            return l && l.licenseID;
        });
    }

    async buyLicense(prodId, specId, callback) {
        try {
            let specs = await Specs.instance.getLicenseSpecs(prodId, specId);
            if(!specs) {
                return callback(new Error("No specs found with prodId: " +prodId+" and specId: "+specId));
            }

            let txn = await this.contract.methods.issueLicense(prodId, specId).send({
                from: this.account,
                value: specs.price
            });
            let evts = Factory.parseModels(txn);
            if(evts && evts.length > 0) {
                for(let i=0;i<evts.length;++i) {
                    let e = evts[i];
                    if(e.licenseID) {
                        await this.db.create({
                            database: DBNames.License,
                            key: e.licenseID,
                            data: e
                        })
                    }
                }
            }
            return callback(null, evts);
        } catch (e) {
            log.error("problem buying license", e);
            return callback(e);
        }
    }

    async checkLicense(prodId, specId) {
        return this.contract.methods.userHasValidLicense(this.account, prodId, specId).call({
            from: this.account
        });
    }

    async verifyLicenseOwnership(prodId, specId, callback) {
        let lic = await this.getLicenseInfo(prodId, specId);
        if(!lic) {
            return false;
        }
        let token = await this.contract.methods.generatePermissionHash(this.account, lic.licenseID).call({
            from: this.account
        });
        let sig = await this.web3.eth.sign(token, this.account);
        let {
            r, s, v
        } = getSignatureParameters(sig);
        let res = await this.contract.verifyLicense(this.account, lice.licenseID, v, r, s).send({
            from: this.account
        });
        return res;
    }
}

const getSignatureParameters = (signature) => {
    
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    let v = `0x${signature.slice(130, 132)}`;
    v = web3.utils.hexToNumber(v);

    if (![27, 28].includes(v)) v += 27;

    return {
        r,
        s,
        v
    };
};