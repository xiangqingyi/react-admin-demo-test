import { CHANGE_LOCALE } from '../configuration/actions';
export default (previousState = {locale: 'en'}, { type, payload }) => {
    if (type === CHANGE_LOCALE) {
        return { locale: payload }
    }
    return previousState;
}