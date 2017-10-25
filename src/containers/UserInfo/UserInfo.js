import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconActionHome from 'material-ui/svg-icons/action/home';
import IconSocialPerson from 'material-ui/svg-icons/social/person';

import { fetchSession } from '../../actions';

class UserInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSession());
  }

  render() {
    const { sessionId, attributes, lastUpdated } = this.props;

    const attributeTypes = Object.keys(attributes);
    const attributesList = attributeTypes.reduce((result, type) => {
      attributes[type].forEach((value) => {
        result.push({
          type,
          value,
        });
      });
      return result;
    }, []);

    const style = {
      height: '100%',
      margin: 20,
    };
    
    return (
      <div>
        <Paper style={style}>
          <List>
            <ListItem primaryText="User Session" leftIcon={<IconSocialPerson/>}/>
          </List>

          {sessionId &&
            <div>
              <Divider/>
              <List>
                <ListItem>
                  SessionId:<br/> {sessionId}
                </ListItem>
              </List>
            </div>
          }

          <Divider/>

          <List>
            {attributesList.map(a =>
              <ListItem key={a.value} primaryText={a.value} secondaryText={a.type} leftIcon={<IconActionHome/>} />
            )}
            { attributesList.length === 0 &&
              <ListItem primaryText="There are no attributes disclosed to your session"/>
            }
          </List>

          {lastUpdated &&
            <div>
              <Divider/>
              <List>
                <ListItem>
                  Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                </ListItem>
              </List>
            </div>
          }

        </Paper>
      </div>
    );
  }
}

UserInfo.propTypes = {
  sessionId: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const { user } = state

  return {
    sessionId: user.sessionId,
    attributes: user.attributes,
    isFetching: user.isFetching,
    lastUpdated: user.lastUpdated,
  }
}

export default connect(mapStateToProps)(UserInfo);
