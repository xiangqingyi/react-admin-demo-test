import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserCreate, UserEdit } from './users/users';
import { RoleEdit, RoleCreate, RoleList } from './roles/roles'
// import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import RoleIcon from '@material-ui/icons/Star';
import Dashboard from './Dashboard';
// import { Layout } from './layout';
import { Layout, Login } from './layout'
import themeReducer from './reducer/themeReducer';
// import localeReducer from './reducer/localeReducer';
import customRoutes from './routes';
import englishMessages from './i18n/en';
import frenchMessages from './i18n/fr';
import authProvider from './authProvider';
import dataProvider from './dataprovider';
import {createBrowserHistory as createHistory } from 'history'
import _ from 'lodash';
const history = createHistory();
const i18nProvider = locale => {
  if (locale === 'fr') {
      return frenchMessages
  } else {
    return englishMessages
  }
};

const App = () => (
  <Admin 
    title=""
    history={history}
    dataProvider={dataProvider}
    customReducers={{ theme: themeReducer}}
    customRoutes={customRoutes}
    authProvider={authProvider}
    dashboard={Dashboard} 
    // loginPage={Login}
    appLayout={Layout} 
    locale="en"
    i18nProvider={i18nProvider}
   > 
   {
     permissions => [
      <Resource name="users" list={UserList} edit={UserEdit} create={
        (permissions.name === 'admin' || _.indexOf(permissions.actions, 'USER_CREATE') !== -1) ? UserCreate : null} icon={UserIcon} />,
      <Resource name="roles" list={RoleList} edit={RoleEdit} create={
        (permissions.name === 'admin' || _.indexOf(permissions.actions, 'ROLE_CREATE') !== -1) ? RoleCreate : null} icon={RoleIcon} />
     ]
    }
  </Admin>
);
export default App;
