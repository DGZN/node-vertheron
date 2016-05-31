import React, { PropTypes, Component } from 'react'
import css from './Hosts.css'

export default class Hosts extends Component {
  render() {
    return (
      <div className={css.hostsTab}>
        <ul>
          {this.props.macs.map((host, i) =>
            <li key={i}>{host.mac} {host.vendor} {host.ip}</li>
          )}
        </ul>
      </div>
    )
  }
}

Hosts.propTypes = {
  macs: PropTypes.array.isRequired
}
