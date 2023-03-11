const express = require('express');
const kerberos = require('kerberos');
const request = require('request');

const app = express();



app.get('/auth/sso',  (req, res) => {
  const service = 'HTTP@vvdecha-smb.agglo.local';

  const url = 'http://vvdecha-smb.agglo.local:3030/';


  kerberos.principalDetails('HTTP', 'vvdecha-smb', (err, details) => {
    console.log('-----------HTTTP details---------------');
    console.log(details);

  });

  // send the initial request un-authenticated
  request.get(url, (err, response) => {
    console.log('-----------Request stsatus code---------------');
    console.log(response.statusCode);

    // validate the response supports the Negotiate protocol
    const authenticateHeader = response.headers['www-authenticate'];
    console.log('-----------Auth headers---------------');
    console.log(authenticateHeader);


    // generate the first Kerberos token
    const mechOID = kerberos.GSS_MECH_OID_KRB5;
    kerberos.initializeClient(service, { mechOID }, (err, client) => {
      console.log(err);

      client.step('', (err, kerberosToken) => {
        console.log(err);

        // attach the Kerberos token and resend back to the host
        request.get(
          { url, headers: { Authorization: `Negotiate ${kerberosToken}` } },
          (err, response) => {
            console.log(err);
            console.log('-----------Request status code headers---------------');
            console.log(response.statusCode);

            // validate the headers exist and contain a www-authenticate message
            const authenticateHeader = response.headers['www-authenticate'];
            console.log('-----------Request www-authenticate  headers---------------');
            console.log(authenticateHeader);

            // verify the return Kerberos token
            const tokenParts = authenticateHeader.split(' ');
            const serverKerberosToken = tokenParts[tokenParts.length - 1];
            client.step(serverKerberosToken, err => {
              console.log(err);
              console.log('-----------Client response finale---------------');
              console.log(client);
              console.log(client.contextComplete);

            });
          }
        );
      });
    });
  });
  /*kerberos.initializeClient(service, {}, (err, client) => {
    kerberos.initializeServer(service, (err, server) => {
      console.log('-----------Client complete---------------');
      console.log(client.contextComplete);
      console.log('-----------Server complete---------------');
      console.log(server.contextComplete);
      client.step('', (err, clientResponse) => {
        console.log('-----------Client response---------------');
        console.log(clientResponse);
        server.step(clientResponse, (err, serverResponse) => {
          console.log('-----------Server response---------------');
          console.log(serverResponse);
          client.step(serverResponse, err => {
            console.log('-----------Client response finale---------------');
            console.log(client);
            console.log(client.contextComplete);

            console.log('-----------Server user name---------------');
            console.log(server.username);
            console.log('-----------Client user name---------------');
            console.log(client.username);

          });

        });
      });

    });

  });*/

  //res.send(`Hello ${req.auth.username}!`);
});

app.listen(3030, () => console.log('Server started on port 3030'));
