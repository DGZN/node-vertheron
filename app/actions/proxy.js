export const RECEIVED_TRACE = 'RECIEVED_TRACE'
export const MOUNTING_PROXY = 'MOUNTING_PROXY'
export const PROXY_ERROR = 'PROXY_ERROR'

export function proxyError() {
  return {
    type: PROXY_ERROR
  }
}

export function receiveTrace(data) {
  return {
    type: RECEIVED_TRACE
  , trace: data
  }
}

export function addTrace(trace) {
  return (dispatch, getState) => {
    return dispatch(receiveTrace(trace))
  }
}

function mountingProxy() {
  return {
    type: MOUNTING_PROXY
  }
}

export function mountProxy() {
  console.log("mounting proxy");
  // verthproxy.init()
  // verthproxy.on('output', function (data) {
  //   console.log({
  //     proxyData: data
  //   });
  // })
  // dispatch(mountedProxy())
}
