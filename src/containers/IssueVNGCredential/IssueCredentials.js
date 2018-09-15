import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import { actions } from 'diva-react';
// import IssueCredentialsToolbar from './IssueCredentialsToolbar';
import IssueCredentialsInitialized from './IssueCredentialsInitialized';
import IssueCredentialsConnected from './IssueCredentialsConnected';
import IssueCredentialsCancelled from './IssueCredentialsCancelled';
import IssueCredentialsDone from './IssueCredentialsDone';
import IssueCredentialsNotFound from './IssueCredentialsNotFound';
import IssueCredentialsError from './IssueCredentialsError';

class IssueCredentials extends Component {
  componentDidMount() {
    // TODO: this can be refactored out of here if
    // it becomes something like startOrResumeDivaSession(viewId)
    if (!this.props.divaSession || this.props.divaSession.sessionStatus === 'ABANDONED') {
      this.startIrmaSession();
    }
  }

  componentWillUnmount() {
    this.props.abandonIrmaSession(this.props.viewId, this.props.divaSession.irmaSessionId);
  }

  startIrmaSession() {
    this.props.startIrmaSession(this.props.viewId, 'ISSUE', { credentialType: this.props.credentialType });
  }

  render() {
    const {
      credentialType,
      divaSession,
    } = this.props;

    return (
      <div>
        <div
          style={{
            backgroundColor: '#FFBC2C',
            height: '230px',
            padding: '30px',
          }}
        >
          <img
            style={{
              backgroundColor: '#FFBC2C',
              maxHeight: '200px',
            }}
            alt="logo"
            src="https://d95acc204d31494586c35e16014afbba.objectstore.eu/static/common-ground/logo-top.svg"
          />
        </div>

        {divaSession && divaSession.sessionStatus !== 'STARTING' ? (
          <div>
            {(divaSession.sessionStatus === 'FAILED_TO_START') && <IssueCredentialsError onRetry={() => this.startIrmaSession()} /> }

            {(divaSession.sessionStatus === 'INITIALIZED') && <IssueCredentialsInitialized credentialType={credentialType} qrContent={divaSession.qrContent} /> }
            {(divaSession.sessionStatus === 'CONNECTED') && <IssueCredentialsConnected /> }
            {(divaSession.sessionStatus === 'DONE') && <IssueCredentialsDone onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'CANCELLED' || divaSession.sessionStatus === 'ABANDONED') && <IssueCredentialsCancelled onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'NOT_FOUND') && <IssueCredentialsNotFound onRetry={() => this.startIrmaSession()} /> }
          </div>
        ) : (
          <div>
            <Row center="xs">
              <Col xs>
                <CircularProgress />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

IssueCredentials.propTypes = {
  viewId: PropTypes.string.isRequired,
  credentialType: PropTypes.string.isRequired,
  startIrmaSession: PropTypes.func.isRequired,
  abandonIrmaSession: PropTypes.func.isRequired,
  divaSession: PropTypes.shape({
    isPolling: PropTypes.bool,
    started: PropTypes.bool,
    irmaSessionType: PropTypes.string,
    qrContent: PropTypes.objectOf(PropTypes.string),
    irmaSessionId: PropTypes.string,
    sessionStatus: PropTypes.string,
  }),
};

const mapStateToProps = (state, ownProps) =>
  ({ divaSession: state.divaReducer.sessions[ownProps.viewId] });

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
  abandonIrmaSession: actions.abandonIrmaSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueCredentials);
