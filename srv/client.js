const { sso } = require('node-expose-sspi');
const https = require('https');

const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true
    });

(async () => {
  try {
    const client = new sso.Client();
    const response = await client.fetch('https://svrdsiweb.agglo.local:3050', {
      agent: httpsAgent
    });
    const json = await response.json();
    console.log('json: ', json);
  } catch (e) {
    console.error(e);
  }
})();
