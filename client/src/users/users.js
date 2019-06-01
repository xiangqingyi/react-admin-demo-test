import React, { Fragment } from 'react';
import { BulkDeleteButton, WithPermissions, CardActions, Toolbar,SaveButton, DeleteButton, List, Datagrid, TextField, EmailField } from 'react-admin';
import { Responsive,ReferenceInput, SelectInput, Filter, Create, Edit, SimpleForm, DisabledInput, TextInput, EditButton } from 'react-admin';
import MobileGrid from './MobileGrid';
import Axios from 'axios';
import _ from 'lodash';

// 增加搜索框
const UserFilter = (props) => {
    return (
    <Filter {...props}> 
       <TextInput label="Search" source="q" alwaysOn />
       <ReferenceInput label="User" source="id" reference="users" allowEmpty>
          <SelectInput optionText="name" />
       </ReferenceInput>
    </Filter>
)}

const UserBulkActionButtons = props => (
    <WithPermissions
      render={({ permissions }) => (
        permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'USER_DELETE') !== -1) ? 
          <Fragment><BulkDeleteButton {...props} /></Fragment> : null) : null
      )}
   />
)

/**
 * UserList
 * @param {*} props 
 */
export const UserList = ({ permissions, ...props }) => {
    return (
        <List bulkActionButtons={<UserBulkActionButtons />} filters={<UserFilter />} {...props}>
        <Responsive 
           xsmall={
            <MobileGrid {...props}
            permissions={permissions}
             />
           }
           medium= {
            <Datagrid>
            <TextField source="id" key="id"  label="Id" />
            <TextField source="name" key="name" label="Name" />
            <EmailField source="email" key="email" label="email" />
            <TextField source="role.name" key="key" label="Role" /> 
            {permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'USER_UPDATE') !== -1) ? 
                    <EditButton /> : null) : null}
            />
        </Datagrid>
           }
         />

    </List>  
    )
}

const UserTitle = ({ record }) => {
    return <span>User {record ? `"${record.username}"` : ''}</span>;
};

const UserEditActions = ({ basePath, data, resource }) => (
    <WithPermissions
       render={({ permissions }) => (
        permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'USER_DELETE') !== -1) ? 
        <CardActions><DeleteButton basePath={basePath} record={data} resource={resource} /></CardActions> : null) : null
         )}
     />
)

const UserEditToolbar = props => (
    <Toolbar {...props}>
       <SaveButton
         label = "SAVE"
         redirect= "list"
         submitOnEnter={false}
       />
    </Toolbar>
)

/**
 * UserEdit
 * @param {*} props 
 */
 export class UserEdit extends React.Component{
    constructor(props, context){
        super(props, context);
        this.getallroles = this.getallroles.bind(this);
        this.state = {
            roles: []
        }
    }
    async componentDidMount() {
        await this.getallroles();
    }
    async getallroles() {
        const response = await Axios.get('/civetadmin/api/getallroles');
        this.state.roles = response.data;
        this.setState({
            roles: response.data
        })
        return true;
    }
    render() {
        return (
            <Edit actions={<UserEditActions />} title={<UserTitle />} {...this.props}>
            <SimpleForm toolbar={<UserEditToolbar />} >
                <DisabledInput source="id" key="id" />
                <TextInput source="name" key="name" />
                <TextInput source="username" key="username" />
                <TextInput source="email" key="email" />
                <TextInput source="password" type="password" key="password" />
                <SelectInput
                    label="Role"
                    source="role._id"
                    choices={this.state.roles}
                />
                {/* <SelectInput source="role.name" optionText="role.name" selected=""  /> */}
            </SimpleForm>
        </Edit>
        )
    }
}



/**
 * UserCreate
 * @param {*} props 
 */
export class UserCreate extends React.Component{
    constructor(props, context){
        super(props, context);
        this.getallroles = this.getallroles.bind(this);
        this.state = {
            roles: []
        }
    }
    async componentDidMount() {
        await this.getallroles();
    }
    async getallroles() {
        const response = await Axios.get('/civetadmin/api/getallroles');
        this.state.roles = response.data;
        this.setState({
            roles: response.data
        })
        return true;
    }
    render() {
        return (
            <Create {...this.props}>
            <SimpleForm>
                <TextInput source="name" key="name" />
                <TextInput source="username" key="username" />
                <TextInput source="email" key="email" type="email" />
                <TextInput source="password" type="password" key="password" />
                <SelectInput
                    label="Role"
                    source="role._id"
                    choices={this.state.roles}
                 />
            </SimpleForm>
        </Create>
        )
    }
}
