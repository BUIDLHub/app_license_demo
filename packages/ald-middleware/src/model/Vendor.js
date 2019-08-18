import * as yup from 'yup';

const schema = yup.object({
    name: yup.string().required("Missing vendor name"),
    vendorID: yup.string().required("Missing vendor id"),
    productCount: yup.number().required("Missing product count"),
    account: yup.string().required("Vendor missing account")
})

const EVT_NAME = "VendorRegistered";

export default class Vendor {

    constructor(props) {
        schema.validateSync(props);
        this.name = props.name;
        this.vendorID = props.vendorID;
        this.productCount = props.productCount;
        this.account = props.account;
    }
}