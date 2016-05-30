const  Promise = require('promise');
const  exec = require('child_process').exec;
// export default function scanHosts() {
//
// }

module.exports = new Promise((resolve, reject) => {
    setTimeout(resolve.bind(null, 'someValueToBeReturned'), 2000);
});
