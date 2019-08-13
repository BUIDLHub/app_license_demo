import {Logger} from 'ald-utils';
import API from './BaseAPI';
import Factory from '../model/ModelFactory';
import * as DBNames from '../DBNames';
import Specs from './SpecsAPI';

const log = new Logger({component: "ConsumerAPI"});

export default class ConsumerAPI extends API {
    constructor(props) {
        super(props);
        [
            'getLicenses',
            'buyLicense',
            'checkLicense',
            'verifyLicenseOwnership'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async getLicenses(prodId) {

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
            return callback(null, evts);
        } catch (e) {
            log.error("problem buying license", e);
            return callback(e);
        }
    }

    async checkLicense(prodId, specId) {

    }

    async verifyLicenseOwnership(prodId, specId) {

    }
}