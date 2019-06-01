import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import SettingsIcon from '@material-ui/icons/Settings';
import LabelIcon from '@material-ui/icons/Label';
import UserIcon from '@material-ui/icons/Group';
import RoleIcon from '@material-ui/icons/Star';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import {
    translate,
    DashboardMenuItem,
    MenuItemLink,
    Responsive,
} from 'react-admin';

import SubMenu from './SubMenu';
import Axios from 'axios';
Axios.defaults.withCredentials = true;

class Menu extends Component {
    constructor(props,context) {
        super(props, context);
        this.state = {
            menuCatalog: false,
            menuSales: false,
            menuCustomers: false,
            theme: 'light',
            role: {}
        };
    }

    static propTypes = {
        onMenuClick: PropTypes.func,
        logout: PropTypes.object,
    };
    async componentDidMount() {
       await this.getUserActions();
    }
    async getUserActions() {
        try {
            const response = await Axios.get('/civetadmin/api/getuseractions');
            if (response.status === 200) {
                let result = response.data;
                if (result.error !== 0) {
                    // console.log('獲取當前user信息失敗');
                    // throw new Error('獲取當前user的信息失敗');
                    this.setState({...this.setState.state,role: {}})
                } else {
                    this.setState({
                        ...this.state,
                        // user: result.data,
                        role: result.data.role
                    }, () => {
                        console.log(this.state.role)
                    })
                }
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    handleToggle = menu => {
        this.setState(state => ({ [menu]: !state[menu] }));
    };

    render() {
        const { onMenuClick, open, logout, translate } = this.props;
        return (
            <div>
                {' '}
                <DashboardMenuItem onClick={onMenuClick} />
                <SubMenu
                    handleToggle={() => this.handleToggle('menuSales')}
                    isOpen={this.state.menuSales}
                    sidebarIsOpen={open}
                    name={translate(`pos.Data`)}
                    icon={<LabelIcon />}
                >
                {(this.state.role.name === 'admin' || _.indexOf(this.state.role.actions, 'USER_INDEX') !== -1) ? <MenuItemLink
                   to={`/users`}
                   primaryText={translate(`pos.USERLIST`, {
                       smart_count: 2,
                   })}
                   leftIcon={<UserIcon />}
                   onClick={onMenuClick}
                 /> : ''}
                 {(this.state.role.name === 'admin' || _.indexOf(this.state.role.actions, 'ROLE_INDEX') !== -1 ) ? <MenuItemLink
                      to={`/roles`}
                      primaryText={translate(`pos.ROLELIST`)}
                      leftIcon={<RoleIcon />}
                      onClick={onMenuClick}
                   /> : ''
                 }
                </SubMenu>
                {/* {(this.state.role.name === 'admin' || _.indexOf(this.state.role.actions, 'USER_INDEX') != -1) ? <MenuItemLink
                   to={`/users`}
                   primaryText={translate(`USERLIST`, {
                       smart_count: 2,
                   })}
                   leftIcon={<UserIcon />}
                   onClick={onMenuClick}
                 /> : ''}
                 {(this.state.role.name === 'admin' || _.indexOf(this.state.role.actions, 'ROLE_INDEX')) ? <MenuItemLink
                      to={`/roles`}
                      primaryText='ROLELIST'
                      leftIcon={<RoleIcon />}
                      onClick={onMenuClick}
                   /> : ''
                 }
            */}
                <Responsive
                    xsmall={
                        <MenuItemLink
                            to="/configuration"
                            primaryText={translate('pos.configuration')}
                            leftIcon={<SettingsIcon />}
                            onClick={onMenuClick}
                        />
                    }
                    medium={null}
                />
                <Responsive
                    small={logout}
                    medium={null} // Pass null to render nothing on larger devices
                />
            </div>
        );
    }
}
const mapStateToProps = state => {
    console.log(state);
    return ({
    open: !state.admin.ui.sidebarOpen,
    theme: state.changeTheme.theme,
    locale: state.changeLocale.locale,
})};

const enhance = compose(
    withRouter,
    connect(
        mapStateToProps,
        {}
    ),
    translate
);

export default enhance(Menu);
