import { RECEIVED_TRACE } from '../actions/proxy'

export default function traces(state = {
  isMounted: false,
  errorScanning: false,
  traces: []
}, action) {
  switch (action.type) {
    case RECEIVED_TRACE:
      console.log("redux -> received_Trace", action);
      return Object.assign({}, state, {
        isScanning: false,
        errorScanning: false,
        traces: state.traces.concat(action.trace),
        lastScanned: action.scannedAt
      })
    default:
      return state
  }
}
