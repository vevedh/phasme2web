const util = require('util');
const { sso } = require('node-expose-sspi');

(async () => {
  const status = await sso.getStatusInfo();
  console.log('status: ', util.inspect(status, false, null, true));
})();
