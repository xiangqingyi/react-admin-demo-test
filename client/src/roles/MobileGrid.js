import React from 'react';
import compose from 'recompose/compose';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import _ from 'lodash';
import {
    EditButton,
    translate,
    // Pagination
} from 'react-admin';

const listStyles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },
    cardTitleContent: {
        display: 'flex',
        flexDirection: 'rows',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        ...theme.typography.body1,
        display: 'flex',
        flexDirection: 'column',
    },

});

const MobileGrid = ({ classes, ids, data, basePath, translate, permissions}) => {
    return (<div style={{ margin: '1em' }}>
        {ids.map(id => (
            <Card key={id} className={classes.card} >
                <CardHeader
                    title={
                        <div className={classes.cardTitleContent}>
                                <h2>{`${data[id].id} ${
                                    data[id].name
                                }` }</h2>
                                
                                {permissions ? ((permissions.name === 'admin' || _.indexOf(permissions.actions, 'ROLE_UPDATE') !== -1) ? 
                                  <EditButton
                                    resource="roles"
                                    basePath={basePath}
                                    record={data[id]}
                                 /> : null) : null}

                        </div>
                    }
                    avatar={<PersonIcon size="45" />}
                />
                <CardContent className={classes.cardContent}>
              
                    <div>
                        {translate('Author')}
                        &nbsp; : &nbsp; {`${data[id].author}`}
                        
                    </div>
                    <div>
                        {translate('Created')}
                        &nbsp; : &nbsp; {`${data[id].created}`}
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
    )};


MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

const enhance = compose(
    withStyles(listStyles),
    translate
);

export default enhance(MobileGrid);