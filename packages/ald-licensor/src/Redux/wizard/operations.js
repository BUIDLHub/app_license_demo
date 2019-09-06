import {Creators} from './actions';

const show = id => dispatch => {
    dispatch(Creators.show(id));
}

const hide = id => dispatch => {
    dispatch(Creators.hide(id));
}

const save = data => dispatch => {
    dispatch(Creators.saveData(data));
}

const next = () => dispatch => {
    dispatch(Creators.nextStep());
}

const prev = () => dispatch => {
    dispatch(Creators.prevStep());
}

export default {
    show,
    hide,
    save,
    next,
    prev
}