import * as yup from 'yup';

const schema = yup.object({
    vendor: yup.string().required("Withdraw missing vendor address"),
    amount: yup.string().required("Withdraw missing amount")
})
export default class Withdraw {
    constructor(values) {
        schema.validateSync(values);
        this.vendor = values.vendor;
        this.amount = values.amount;
    }
}