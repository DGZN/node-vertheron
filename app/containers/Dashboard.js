import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { scanHostsIfNeeded } from '../actions/hosts'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    // this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    // const { dispatch } = this.props
    // dispatch(scanHostsIfNeeded())
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

Dashboard.propTypes = {
  macs: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
  const { macs, isScanning, lastScanned } = state.hosts
  return {
    macs
  , isScanning
  , lastScanned
  }
}

export default connect(mapStateToProps)(Dashboard)
