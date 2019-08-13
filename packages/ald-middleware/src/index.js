import VendorAPI from './apis/VendorAPI';
import ProductAPI from './apis/ProductAPI';
import SpecsAPI from './apis/SpecsAPI';
import ConsumerAPI from './apis/ConsumerAPI';
import DB from 'ald-db';
import * as yup from 'yup';
import Web3 from 'ald-web3';

const schema = yup.object({
    contractAddress: yup.string().required("Missing contractAddress for middleware"),
    web3Provider: yup.object(),
    web3URL: yup.string(),
    mnemonic: yup.string()
});

export default class ALDMiddleware {
    constructor(props) {
        schema.validateSync(props);
        this.contractAddress = props.contractAddress;
        this.web3Provider = props.web3Provider;
        this.web3URL = props.web3URL;
        this.mnemonic = props.mnemonic;

        if(!this.web3Provider && !this.web3URL) {
            throw new Error("Must have a web3URL or web3Provider");
        }

        [
            'start',
            'stop',
            '_setConsumerAccount', //for testing only
            '_addFunctions'
        ].forEach(fn=>this[fn].bind(this));
    }

    async start() {

        this.web3 = new Web3({
            id: 1,
            provider: this.web3Provider,
            URL: this.web3URL,
            mnemonic: this.mnemonic,
            numAddresses: 10
        });

        let db = new DB({
            dbPrefix: "ald-"
        });

        await this.web3.open();
        let w = this.web3.connector.web3;
        let accts = await w.eth.getAccounts();
        let cfg = {
            web3: w,
            db,
            address: this.contractAddress,
            account: accts[0]
        }
        this.vendor = new VendorAPI(cfg);
        this.product = new ProductAPI(cfg);
        this.specs = new SpecsAPI(cfg);
        this.consumer = new ConsumerAPI(cfg);
        this.accounts = accts;
        this._addFunctions([this.vendor, this.product, this.specs, this.consumer]);
        return this.web3.start();
    }

    async stop() {
        await this.web3.stop();
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
}