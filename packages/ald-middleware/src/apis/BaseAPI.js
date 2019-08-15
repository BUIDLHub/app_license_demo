import * as yup from 'yup';
import abis from '../abi';

const schema = yup.object({
    web3: yup.object().required("API missing web3"),
    db: yup.object().required("API missing DB for API"),
    address: yup.string().required("API missing contract address"),
    account: yup.string().required("API missing ETH account for API"),
    //emitter: yup.object().required("API missing event emitter")
});

export default class API {
    constructor(props) {
        schema.validateSync(props);
        this.web3 = props.web3;
        this.account = props.account;
        this.db = props.db;
        this.emitter = props.emitter;

        //ORDER is important here. The contract creation will populate the given ABIs with
        //function and event signatures. those are used in monitor's decoder to decode
        //specific txn sigs.
        this.contract = new this.web3.eth.Contract(abis, props.address, {address: props.address});
        this.init = this.init.bind(this);
    }

    async init() {}
}