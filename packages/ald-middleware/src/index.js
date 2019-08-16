import VendorAPI from './apis/VendorAPI';
import ProductAPI from './apis/ProductAPI';
import SpecsAPI from './apis/SpecsAPI';
import ConsumerAPI from './apis/ConsumerAPI';
import DB from 'buidl-storage';
import * as yup from 'yup';

const schema = yup.object({
    contractAddress: yup.string().required("Missing contractAddress for middleware"),
    web3: yup.object().required("API missing web3"),
    storage: yup.object()
});

export default class ALDMiddleware {
    constructor(props) {
        schema.validateSync(props);
        this.contractAddress = props.contractAddress;
        this.web3 = props.web3;
        this.db = props.storage;

        [
            'init',
            '_setConsumerAccount', //for testing only
            '_addFunctions',
            '_initAPIs'
        ].forEach(fn=>this[fn].bind(this));
    }

    async init() {

        if(!this.db) {
            this.db = new DB({
                    dbPrefix: "ald-"
            });
        }

        let accts = await this.web3.eth.getAccounts();
        let cfg = {
            web3: this.web3,
            db: this.db,
            address: this.contractAddress,
            account: accts[0]
        }
        this.vendor = new VendorAPI(cfg);
        this.product = new ProductAPI(cfg);
        this.specs = new SpecsAPI(cfg);
        this.consumer = new ConsumerAPI(cfg);
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