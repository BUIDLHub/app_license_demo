import * as yup from 'yup';

const schema = yup.object({
    owner: yup.string().required("License owner missing"),
    productID: yup.string().required("License product ID missing"),
    specID: yup.string().required("License spec ID is missing"),
    licenseID: yup.string().required("License ID is missing"),
    expiration: yup.number().required("License expiration is missing")
})
export default class License {
    constructor(values) {
        schema.validateSync(values);
        this.owner = values.owner;
        this.productID = values.productID;
        this.specID = values.specID;
        this.licenseID = values.licenseID;
        this.expiration = values.expiration;
    }
}