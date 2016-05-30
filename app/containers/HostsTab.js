import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Hosts from '../components/Hosts';
import * as HostsAction from '../actions/hosts';

function mapStateToProps(state) {
  return {
    hosts: state.hosts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HostsAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
