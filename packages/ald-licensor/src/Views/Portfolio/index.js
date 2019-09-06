import {connect} from 'react-redux';
import Portfolio from './Portfolio';
import {default as wizOps} from 'Redux/wizard/operations';

const s2p = state => {
    return {
        loading: state.init.loading,
        isVendor: state.middleware.isVendor,
        products: state.products.products
    }
}

const d2p = dispatch => {
    return {
        showVendorWizard: () => {
            dispatch(wizOps.show('vendor'));
        },

        showProductWizard: () => {
            dispatch(wizOps.show("product"));
        }
    }
}
export default connect(s2p, d2p)(Portfolio);