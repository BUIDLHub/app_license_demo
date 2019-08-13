import * as yup from 'yup';

const schema = yup.object({
    name: yup.string().required("Missing product name"),
    productID: yup.string().required("Missing product ID"),
    vendorID: yup.string().required("Missing vendor ID"),
    specCount: yup.number().required("Missing license spec count"),
    licenseCount: yup.number().required("Missing license count")
});

export default class Product  {
    constructor(values) {
        schema.validateSync(values);
        this.name = values.name;
        this.vendorID = values.vendorID;
        this.productID = values.productID-0;
        this.specCount = values.specCount-0;
        this.licenseCount = values.licenseCount-0;
    }
}