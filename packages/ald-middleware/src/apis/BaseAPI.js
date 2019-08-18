import * as yup from 'yup';
import abis from '../abi';
import Web3PromEvent from 'web3-core-promievent';

const schema = yup.object({
    web3: yup.object().required("API missing web3"),
    db: yup.object().required("API missing DB for API"),
    address: yup.string().required("API missing contract address"),
    account: yup.string().required("API missing ETH account for API")
});

export default class API {
    constructor(props) {
        schema.validateSync(props);
        this.web3 = props.web3;
        this.account = props.account;
        this.db = props.db;
        this.emitter = props.emitter;
        this.contractAddress = props.address;

        //ORDER is important here. The contract creation will populate the given ABIs with
        //function and event signatures. those are used in monitor's decoder to decode
        //specific txn sigs.
        this.contract = new this.web3.eth.Contract(abis, props.address, {address: props.address});
        this.init = this.init.bind(this);

        [
            'promEvent',
            'transferPromEvents'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async init() {}

    promEvent() {
        let defer = new Web3PromEvent();
        defer.isResolved = false;
        let origResolve = defer.resolve;
        let origReject = defer.reject;

        defer.resolve = (v) => {
            if(!defer.isResolved) {
                defer.isResolved = true;
                return origResolve(v);
            }
        }
        defer.reject = (e) => {
            if(!defer.isResolved) {
                defer.isResolved = true;
                return origReject(e);
            }
        }

        return (work) => {
            work(defer).then(v=>{
                if(!defer.isResolved) {
                    return defer.resolve(v);
                }
            }).catch(e=>{
                if(!defer.isResolved) {
                    return defer.reject(e);
                }
            });
            console.log("Defer.eventEmitter", defer.eventEmitter);
            return defer.eventEmitter;
        }
    }

    transferPromEvents(src, dst) {
        src.on("transactionHash", hash=>{
            if(dst.eventEmitter.listeners("transactionHash").length > 0) {
                dst.eventEmitter.emit("transactionHash", hash);
            }
        });
        src.on("receipt", r=>{
            if(dst.eventEmitter.listeners("receipt").length > 0) {
                dst.eventEmitter.emit("receipt", r);
            }
        });

        src.on("confirmation", c=>{
            if(dst.eventEmitter.listeners("confirmation").length > 0) {
                dst.eventEmitter.emit("confirmation", c);
            }
        });

        src.on("error", e=>{
            if(dst.eventEmitter.listeners("error").length > 0) {
                dst.eventEmitter.emit("error", e);
            }
        });
    }
}