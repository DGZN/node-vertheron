import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { scanHostsIfNeeded } from '../actions/hosts'
import { addTrace } from '../actions/proxy'
import Traces from '../components/Traces'
import Hosts from '../components/Hosts'

var verthproxy = require('../utils/proxy')

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(scanHostsIfNeeded())
    verthproxy.init()
    verthproxy.on('output', function (data) {
      dispatch(addTrace(data))
      console.log(data);
    })
  }

  render() {
    const { macs, traces } = this.props
    const hasHosts = macs.length === 0
    return (
      <div>
        {this.props.children}
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools'); // eslint-disable-line global-require
              return <DevTools />;
            }
          })()
        }
        <Traces traces={traces} />
        <Hosts macs={macs} />
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  macs: PropTypes.array.isRequired,
  traces: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    macs: state.hosts.macs || []
  , traces: state.proxy.traces || []
  }
}

export default connect(mapStateToProps)(App)
