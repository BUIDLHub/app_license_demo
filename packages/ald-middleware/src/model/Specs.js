import * as yup from 'yup';

const schema = yup.object({
    productID: yup.string().required("Missing product id"),
    specID: yup.string().required("Missing spec id"),
    price: yup.string().required("Missing Specs price"),
    attributes: yup.number(),
    duration: yup.number().required("Missing specs duration"),
    name: yup.string().required("Missing specs name")
});
export default class Specs {
    constructor(values) {
        schema.validateSync(values);

        this.productID = values.productID;
        this.specID = values.specID;
        this.price = values.price;
        this.attributes = values.attributes;
        this.duration = values.duration-0;
        this.name = values.name;
    }
}