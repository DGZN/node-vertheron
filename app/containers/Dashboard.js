import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import * as HostActions from '../actions/hosts';

function mapStateToProps(state) {
  return {
    hosts: []
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HostActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
