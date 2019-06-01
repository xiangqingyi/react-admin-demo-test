import React from 'react';
import { connect } from 'react-redux';
import { Layout, Sidebar} from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';
import { darkTheme, lightTheme } from './themes';
import englishMessages from '../i18n/en';
import frenchMessages from '../i18n/fr';
const CustomSidebar = props => <Sidebar {...props} size={200} />;
const CustomLayout = props => { 
    return (
    <Layout {...props} appBar={AppBar} sidebar={CustomSidebar} menu={Menu} />
)};

export default connect(
    state => {
        return({
        theme: state.changeTheme.theme === 'dark' ? darkTheme : lightTheme,
        locale: state.changeLocale.locale === 'en' ? 'en' : 'fr',
        open: state.admin.ui.sidebarOpen
    })},
    {}
)(CustomLayout);
