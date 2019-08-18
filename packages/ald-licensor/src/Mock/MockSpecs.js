import * as DBNames from './DBNames';
import {Logger, sleep} from 'buidl-utils';
import  {
    LicenseSpecs
} from 'ald-middleware';
import Product from './MockProduct';
import Base from './Base';

const log = new Logger({component: "MockSpecs"});

let inst = null;
export default class MockSpecs extends Base {
    static get instance() {
        return inst;
    }

    constructor(props) {
        super(props);
        this.specCounts = {};
        [
            'init',
            'getAllLicenseSpecsForProduct',
            'getLicenseSpecs',
            'registerLicenseSpecs'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
        inst = this;
    }
    
    async init() {
        await Product.instance.getProducts(0, 100, async (e, prods) => {
            if(prods.length === 0) {
                return;
            }

            for(let i=0;i<prods.length;++i) {
                let pr = prods[i];
                if(pr.specCount > 0) {
                    let ids = []
                    this.specCounts[pr.productID] = ids;
                    for(let j=0;j<pr.specCount;++j) {
                        ids.push(j+1);
                    }
                }
            }
        });
    }

    async getAllLicenseSpecsForProduct(prodId, refresh) {
        return this.promEvent()(async defer=>{
            let prod = await Product.instance.getProductInfo(prodId, refresh);
        
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
        });
    }

    async getLicenseSpecs(prodId, specId) {
        return this.promEvent()(async defer=>{
            let r = await this.db.read({
                database: DBNames.Specs,
                key: prodId + "_" + specId
            });
            return r;
        });
        
    }

    async registerLicenseSpecs(prodId, name, price, duration, callback) {
        return this.promEvent()(async defer=>{
            try {
                let ids = this.specCounts[prodId] || [];
                
                let specs = new LicenseSpecs({
                    name: name,
                    productID: prodId,
                    specID: ids.length+1,
                    price,
                    duration
                });
                ids.push(ids.length+1);
                await this.db.create({
                    database: DBNames.Specs,
                    key: specs.productID + "_" + specs.specID,
                    data: specs
                });
                this.specCounts[prodId] = ids;
                await sleep(this.simulatedDelay);
                defer.resolve([specs]);
                return callback(null, [specs]);
            } catch (e) {
                log.error("Problem creating license specs", e);
                defer.reject(e);
                return callback(e);
            }
        });
        
    }
}