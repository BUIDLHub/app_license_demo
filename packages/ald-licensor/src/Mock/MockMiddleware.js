
import Vendor from './MockVendor';
import Consumer from './MockConsumer';
import Product from './MockProduct';
import Specs from './MockSpecs';

export default class MockMiddleware {
    constructor(props) {
        this.db = props.storage;
        this.web3 = props.web3;
        [
            'init',
            '_setConsumerAccount', //for testing only
            '_addFunctions',
            '_initAPIs'
        ].forEach(fn=>this[fn].bind(this));
    }

    async init() {

        if(!this.db) {
            throw new Error("Must provide a data store for mock middleware");
        }

        if(!this.web3) {
            throw new Error("Must provide web3 for mock middleware");
        }

        let accts = await this.web3.eth.getAccounts();
        let cfg = {
            web3: this.web3,
            db: this.db,
           account: accts[0]
        }
        this.vendor = new Vendor(cfg);
        this.product = new Product(cfg);
        this.specs = new Specs(cfg);
        this.consumer = new Consumer(cfg);
        this.accounts = accts;

        this._addFunctions([this.vendor, this.product, this.specs, this.consumer]);
        await this._initAPIs([this.vendor, this.product, this.specs, this.consumer]);
    }

    _setConsumerAccount(account) {
        this.consumer.account = account;
    }

    _addFunctions(apis) {
        apis.forEach(a=>{
            for(var f in a) {
                let v = a[f];
                if(typeof v === 'function') {
                    this[f] = v.bind(a);
                }
            }
        })
    }

    async _initAPIs(apis) {
        for(let i=0;i<apis.length;++i) {
            await apis[i].init()
        }
    }
}