import Base from './Base';
import * as DBNames from './DBNames';
import {Logger, sleep} from 'buidl-utils';
import {
    License
} from 'ald-middleware';
import MockSpecs from './MockSpecs';

const log = new Logger({component: "MockConsumer"});

let inst = null;
export default class MockConsumer extends Base {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        this.idCounter = 0;
        this.tokenCounter = 0;
        [
            'init',
            'getLicenses',
            'getLicenseInfo',
            'buyLicense',
            'checkLicense',
            'verifyLicenseOwnership'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }

    async init() {
        let r = await this.db.readAll({
            database: DBNames.License,
            limit: 200
        });

        this.idCounter = r?r.length+1:1;
    }

    async getLicenseInfo(prodId, specId, refresh) {
        return this.promEvent()(async defer=>{
            let r = await this.db.read({
                database: DBNames.License,
                key: prodId + "_" + specId
            });
            return r;
        });
        
    }

    async getLicenses(prodId, refresh) {
        return this.promEvent()(async defer=>{
            let r = await this.db.readAll({
                database: DBNames.License,
                filterFn: (v) => {
                    return (v.productID === prodId && v.account === this.account)
                }
            });
            return r;
        });
       
    }

    async buyLicense(prodId, specId, callback) {
        return this.promEvent()(async defer=>{
            try {
                let specs = await MockSpecs.instance.getLicenseSpecs(prodId, specId);
                let evts = [new License({
                    owner: this.account,
                    productID: prodId,
                    specID: specId,
                    licenseID: ""+this.idCounter,
                    expiration: Math.floor(Date.now()/1000) + specs.duration
                })]
                let e = evts[0];
                await this.db.create({
                    database: DBNames.License,
                    key: e.licenseID,
                    data: e
                });
                ++this.idCounter;   
                await sleep(this.simulatedDelay);
                defer.resolve(evts);         
                return callback(null, evts);
            } catch (e) {
                log.error("problem buying license", e);
                return callback(e);
            }
        });
        
    }

    async checkLicense(prodId, specId) {
        return this.promEvent()(async defer=>{
            let lic = await this.db.read({
                database: DBNames.License,
                key: prodId + "_" + specId
            });
            return lic.licenseID && lic.licenseID > 0;
        });
    }

    async verifyLicenseOwnership(prodId, specId, callback) {
        return this.promEvent()(async defer=>{
            let lic = await this.getLicenseInfo(prodId, specId);
            if(!lic) {
                return false;
            }
            let token = "_simulated_token_" + (this.tokenCounter);
            //just simulate signature
            let sig = await this.web3.eth.sign(token, this.account);
            if(!sig) {
                return false
            }
            ++this.tokenCounter;
            await sleep(this.simulatedDelay);
            let res = lic.owner === this.account;
            defer.resolve(res);
            return callback(null, res);
        });
        
    }
}