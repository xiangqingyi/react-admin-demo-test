import { CHANGE_THEME } from '../configuration/actions';

export default (previousState = {theme: 'light'}, { type, payload }) => {
    if (type === CHANGE_THEME) {
        return {theme: payload};
    }
    return previousState;
};
