export const REQUEST_HOSTS = 'REQUEST_HOSTS'
export const RECEIVE_HOSTS = 'RECEIVE_HOSTS'

function requestHosts() {
  return {
    type: REQUEST_HOSTS
  }
}

function receiveHosts(hosts) {
  return {
    type: RECEIVE_HOSTS,
    hosts: hosts,
    scannedAt: Date.now()
  }
}

function scanHosts() {
  return dispatch => {
    dispatch(requestHosts())
    return dispatch(receiveHosts([{
      id: 123
    }]))
    // return fetch(`https://www.reddit.com/r/${reddit}.json`)
    //   .then(response => response.json())
    //   .then(json => dispatch(receivePosts(reddit, json)))
  }
}

function shouldScanHosts(state) {
  const hosts = state.hosts
  if (!hosts) {
    return true
  }
  if (hosts.isFetching) {
    return false
  }
  return hosts.didInvalidate
}

export function scanHostsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldScanHosts(getState())) {
      return dispatch(scanHosts())
    }
  }
}
