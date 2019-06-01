import { combineReducers } from 'redux';
import changeTheme from './themeReducer';
import changeLocale from './localeReducer';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { adminReducer ,defaultI18nProvider,i18nReducer } from 'react-admin'
const locale = 'en'

const Reducer = combineReducers({
    changeLocale,
    changeTheme,
    admin: adminReducer,
    form: formReducer,
    router: routerReducer,
    i18n: i18nReducer(locale, defaultI18nProvider(locale))
})

export default Reducer;
