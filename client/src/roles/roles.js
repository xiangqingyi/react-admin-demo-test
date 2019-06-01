import React, {Fragment} from 'react';
import { DeleteButton,Toolbar, SaveButton, CardActions, WithPermissions, BulkDeleteButton, List, Datagrid, TextField } from 'react-admin';
import { Responsive,FormDataConsumer,CheckboxGroupInput, ReferenceInput, SelectInput, Filter, Create, Edit, SimpleForm, DisabledInput, TextInput, LongTextInput, EditButton } from 'react-admin';
import  ACTIONS  from './actions';
import MobileGrid from './MobileGrid';
import _ from 'lodash';



// 增加搜索框
const RoleFilter = (props) => (
    <Filter {...props}> 
       <TextInput label="Search" source="q" alwaysOn />
       <ReferenceInput label="Role" source="id" reference="roles" allowEmpty>
          <SelectInput optionText="name" />
       </ReferenceInput>
    </Filter>
)
const RoleBulkActionButtons = props => (
    <WithPermissions
      render={({ permissions }) => (
        permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'ROLE_DELETE') !== -1) ? 
          <Fragment><BulkDeleteButton {...props} /></Fragment> : null) : null
      )}
   />
)
/**
 * RoleList
 * @param {*} props 
 */
export const RoleList = ({ permissions, ...props }) => {
    return (
        <List bulkActionButtons={<RoleBulkActionButtons />}  filters={<RoleFilter />} {...props}>
        <Responsive 
           xsmall={ 
            <MobileGrid {...props}
            permissions={permissions}
             />
           }
           medium={
              <Datagrid>
                <TextField source="id" key="id" />
                <TextField source="name" key="name" />
                <TextField source="created" key="created" />
                <TextField source="author" key="author" />
                {permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'ROLE_UPDATE') !== -1) ? 
                    <EditButton /> : null) : null}
              </Datagrid>
           }
        />
      </List>  
    )
}


const RoleTitle = ({ record }) => {
    console.log(record);
    return <span>Role {record ? `"${record.name}"` : ''}</span>
}

const RoleEditActions = ({ basePath, data, resource }) => (
    <WithPermissions
       render={({ permissions }) => (
        permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'USER_DELETE') !== -1) ? 
        <CardActions><DeleteButton basePath={basePath} record={data} resource={resource} /></CardActions> : null) : null
         )}
     />
)

const RoleEditToolbar = props => (
    <Toolbar {...props}>
       <SaveButton
         label = "SAVE"
         redirect= "list"
         submitOnEnter={false}
       />
    </Toolbar>
)

/**
 * RoleEdit
 * @param {*} props 
 */
export const RoleEdit = props => (
    <Edit actions={<RoleEditActions />} title={<RoleTitle />} {...props}>
       <SimpleForm toolbar={<RoleEditToolbar />}>
           <DisabledInput source="id" key="id" />
           <TextInput source="name" key="name" />
           <FormDataConsumer>
                {({ formData, dispatch, ...rest }) => (
                    <Fragment>
                        {ACTIONS.map((item)=> (
                            <CheckboxGroupInput label={item.name} source="actions" choices={item.actions} key={item.name} />
                        ))}
                        
                    </Fragment>
                )}
        </FormDataConsumer>
        <LongTextInput source="description" key="description" />
       </SimpleForm>
    </Edit>
);

/**
 * RoleCreate
 * @param {*} props 
 */

export const RoleCreate = props => (
    <Create {...props}>
       <SimpleForm>
       {/* <TextInput source="id" key="id" /> */}
       <TextInput source="name" key="name" />
       <FormDataConsumer>
                {({ formData, dispatch, ...rest }) => (
                    <Fragment>
                        {ACTIONS.map((item)=> (
                            <CheckboxGroupInput label={item.name} source="actions" choices={item.actions} key={item.name}  />
                        ))}
                        
                    </Fragment>
                )}
        </FormDataConsumer>
        <LongTextInput source="description" key="description" />
       </SimpleForm>
    </Create>
)