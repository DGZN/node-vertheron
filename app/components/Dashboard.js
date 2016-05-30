import React, { Component, PropTypes } from 'react';
import { selectReddit, scanHostsIfNeeded, invalidateReddit } from '../actions'
import { Link } from 'react-router';
import styles from './Counter.css';

class Dashboard extends Component {

  static propTypes = {
    hosts: PropTypes.array.isRequired,
  };

  componentDidMount() {
    return this.props.scanHostsIfNeeded()
  }

  componentWillReceiveProps(nextProps) {
    console.log("next props", props);
    // if (nextProps.selectedReddit !== this.props.selectedReddit) {
    //   const { dispatch, selectedReddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedReddit))
    // }
  }

  render() {
    const { hosts } = this.props;
    console.log("dashboard props", this.props);
    return (
      <div>

      </div>
    );
  }
}

export default Dashboard;
