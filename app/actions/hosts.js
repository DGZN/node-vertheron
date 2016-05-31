import scan from '../utils/macHosts'

export const REQUEST_HOSTS = 'REQUEST_HOSTS'
export const RECEIVE_HOSTS = 'RECEIVE_HOSTS'
export const ERROR_SCANNING = 'ERROR_SCANNING'

export function errorScanning() {
  return {
    type: ERROR_SCANNING
  }
}

function requestHosts(reddit) {
  return {
    type: REQUEST_HOSTS
  }
}

function receiveHosts(data) {
  return {
    type: RECEIVE_HOSTS,
    hosts: data,
    scannedAt: Date.now()
  }
}

function scanHosts() {
  return dispatch => {
    dispatch(requestHosts())
    return scan((hosts) => {
      dispatch(receiveHosts(hosts))
    })
  }
}

function shouldScanHosts(state) {
  const hosts = state.hosts
  if (!hosts.macs.length) {
    return true
  }
  if (hosts.isScanning) {
    return false
  }
  return hosts.errorScanning
}

export function scanHostsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldScanHosts(getState())) {
      return dispatch(scanHosts())
    }
  }
}
