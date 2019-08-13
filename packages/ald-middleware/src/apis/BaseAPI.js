import * as yup from 'yup';
import abis from '../abi';

const schema = yup.object({
    web3: yup.object().required("Missing web3"),
    db: yup.object().required("Missing DB for API"),
    address: yup.string().required("Missing contract address"),
    account: yup.string().required("Missing ETH account for API")
});

export default class API {
    constructor(props) {
        schema.validateSync(props);
        this.web3 = props.web3;
        this.account = props.account;
        this.db = props.db;

        //ORDER is important here. The contract creation will populate the given ABIs with
        //function and event signatures. those are used in monitor's decoder to decode
        //specific txn sigs.
        this.contract = new this.web3.eth.Contract(abis, props.address, {address: props.address});
    }
}