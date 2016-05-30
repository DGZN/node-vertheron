import { REQUEST_HOSTS, RECEIVE_HOSTS } from '../actions/hosts';

function hosts(state = {
  isScanning: false,
  didInvalidate: false,
  hosts: []
}, action) {
  switch (action.type) {
    case REQUEST_HOSTS:
      return Object.assign({}, state, {
        isScanning: true,
        didInvalidate: false
      })
    case RECEIVE_HOSTS:
      return Object.assign({}, state, {
        isScanning: false,
        didInvalidate: false,
        hosts: action.hosts,
        lastScanned: action.scannedAt
      })
    default:
      return state
  }
}
