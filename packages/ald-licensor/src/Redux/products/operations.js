import {Creators} from './actions';
import * as DBNames from 'Redux/cache/DBNames';

const init = () => async (dispatch, getState) => {
    dispatch(Creators.initStart());
    try {
        let all = await getState().cache.storage.readAll({
            database: DBNames.Product
        });
        dispatch(Creators.initSuccess(all));
    } catch (e) {
        console.log("Problem with product init", e);
        dispatch(Creators.failure(e));
    }
}

const addProduct = p => (dispatch) => {
    dispatch(Creators.addProduct(p));
}

export default {
    init,
    addProduct
}