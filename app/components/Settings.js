import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Settings.css';

class Settings extends Component {
  static propTypes = {
    settings: PropTypes.func.isRequired
  , macHosts: PropTypes.func.isRequired
  };

  render() {
    const { settings, macHosts } = this.props;
    console.log("macHosts", macHosts);
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/">
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
      </div>
    );
  }
}

export default Settings;
