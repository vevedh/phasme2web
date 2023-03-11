var express = require('express');
var app = express();
var router = express.Router();
const request = require('request');


const ldapSpeSearch = (filter, attribs) => {
  const adMap = [
    { ad: 'Name', ld: 'name' }, { ad: 'GivenName', ld: 'givenName' }, { ad: 'Description', ld: 'description' }, { ad: 'Office', ld: 'physicalDeliveryOfficeName' }, { ad: 'SamAccountName', ld: 'sAMAccountName' },
    { ad: 'UserPrincipalName', ld: 'userPrincipalName' }, { ad: 'ThumbnailPhoto', ld: 'thumbnailPhoto' }, { ad: 'DisplayName', ld: 'displayName' }, { ad: 'Company', ld: 'company' },
    { ad: 'Department', ld: 'department' }, { ad: 'City', ld: 'l' }, { ad: 'HomePhone', ld: 'homePhone' }, { ad: 'mail', ld: 'mail' }, { ad: 'OfficePhone', ld: 'telephoneNumber' }, { ad: 'IPPhone', ld: 'ipPhone' },
    { ad: 'MobilePhone', ld: 'mobile' }, { ad: 'PostalCode', ld: 'postalCode' }, { ad: 'StreetAddress', ld: 'streetAddress' }, { ad: 'co', ld: 'co' }, { ad: 'Surname', ld: 'sn' }, { ad: 'Manager', ld: 'manager' },
    { ad: 'EmployeeNumber', ld: 'employeeNumber' }, { ad: 'MemberOf', ld: 'memberOf' }, { ad: 'Enabled', ld: 'userAccountControl' }, { ad: 'CannotChangePassword', ld: 'userAccountControl' },
    { ad: 'PasswordNeverExpires', ld: 'userAccountControl' }, { ad: 'AccountExpirationDate', ld: 'accountExpires' }, { ad: 'whenChanged', ld: 'whenChanged' }, { ad: 'whenCreated', ld: 'whenCreated' }, { ad: 'LastLogonDate', ld: 'modifyTimeStamp' }
  ];
  const client =  require('ldapjs').createClient({
    url: 'ldap://agglo.local',
    bindDN:'hdechavignyadm@AGGLO.LOCAL',
    bindCredentials: 'd@nZel!77',
    reconnect: true,
    idleTimeout: 2592000,
    tlsOptions: { rejectUnauthorized: false }
  });


  client.bind('hdechavignyadm@AGGLO.LOCAL', 'd@nZel!77', (err, res) => {
    if (err) {
      console.log('Echec de connexion ldap !');
      app.set('ldapClient', client);
      app.set('ldap_ok', false);
    }
    if (res) {
      console.log('Connexion ldap etablie avec succès!');
      if (client.connected) {
        app.set('ldapClient', client);
        app.set('ldap_ok', true);
      }
    }
  });

  var opts = {
    //  filter: '(objectClass=*)',  //simple search
    //  filter: '(&(uid=2)(sn=John))',// and search
    filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
    scope: 'sub',
    sizeLimit: 3000,
    paged: true,
    attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
  };

  return new Promise((resolve, reject) => {
    if (!Date.fromLDAPString) {
      Date.fromLDAPString = function (s) {
        var b = s.match(/\d\d/g);
        return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
      };
    }

    var valentry = [];
    client.search('DC=AGGLO,DC=LOCAL', opts, (err, resp) => {
      if (err) {
        console.log('Error in search ' + err);
      } else {
        resp.on('searchEntry', (entry) => {
          //console.log('entry: ' + JSON.stringify(entry.object));
          if (entry.object) {
          // console.log('Attributes :',attribs);
            var obj = {};
            var entries = JSON.parse(JSON.stringify(entry.object));

            attribs.forEach((attrib) => {
              // console.log('Attribut :',attrib);
              if (adMap.filter(elt => elt.ad == attrib).length > 0) {
                // console.log("Attrib map :",adMap.filter(elt => elt.ad == attrib))
                const eqattrib = adMap.filter(elt => elt.ad == attrib)[0].ld;
                const objattrib = adMap.filter(elt => elt.ad == attrib)[0].ad;
                // obj[objattrib] = (entries[eqattrib])?entries[eqattrib]:null;
                switch (eqattrib) {
                case 'userAccountControl':
                  /**
                      512 = normal account, enabled,
                      514 = 512 + 2 = normal account, disabled
                      546 = 512 + 32 + 2 = normal account, disabled, no password required
                    2080 = 2048 + 32 = Interdomain trust, no password required
                    66048 = 65536 + 512 = normal account. password never expires
                    66050 = 65536 + 512 + 2 = normal account. password never expires, disabled
                    66080 = 65536 + 512 + 32 = normal account. password never expires, no password required
                     */
                  switch (entries[eqattrib]) {
                  case '512':
                    obj.Enabled = 'true';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = null;
                    break;
                  case '514':
                    obj.Enabled = 'false';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = null;
                    break;
                  case '546':
                    obj.Enabled = 'false';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = null;
                    break;
                  case '2080':
                    obj.Enabled = 'true';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = null;
                    break;
                  case '66048':
                    obj.Enabled = 'true';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = true;
                    break;
                  case '66050':
                    obj.Enabled = 'false';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = true;
                    break;
                  case '66080':
                    obj.Enabled = 'true';
                    obj.CannotChangePassword = null;
                    obj.PasswordNeverExpires = true;
                    break;

                  default:
                    break;
                  }

                  break;

                case 'accountExpires':
                  // new Date(n/1e4 - 1.16444736e13);
                  obj.AccountExpirationDate = (new Date(Number(String(entries[eqattrib]).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString();
                  break;
                case 'whenChanged':

                  obj.whenChanged = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();
                  break;
                case 'modifyTimeStamp':
                  obj.LastLogonDate = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();
                  break;
                case 'whenCreated':
                  obj.whenCreated = (new Date(Date.fromLDAPString(String(entries[eqattrib])))).toLocaleString();

                  break;

                default:
                  obj[objattrib] = (entries[eqattrib]) ? entries[eqattrib] : null;
                  break;
                }
              }
              // console.log("Objet :",obj);
            });

            valentry.push(obj);
          }
        });
        resp.on('searchReference', (referral) => {
          console.log('referral: ' + referral.uris.join());
        });
        resp.on('error', (err) => {
          console.error('error: ' + err.message);
        // reject(err);
        });
        resp.on('end', (result) => {
          client.unbind();
          // console.log('status: ' + result.status);
          // console.log('Ldap search result :',values);
          // res.json(values);
          resolve(valentry);
        });
      }
    });
  });
};

app.get('/auth/sso', function (req, res) {
  //
  console.log('-----request-----');
  console.log(req.headers);

  if (!req.headers.authorization) {
    res.set('WWW-Authenticate', 'Negotiate');

    //
    console.log('-----response-----');
    console.log(res._headers);

    res.status(401).send();
  } else {
    // this code is only for Linux !


    const kerberos = require('kerberos');
    var ActiveDirectory = require('activedirectory');
    //const request = require('request');
    var ad = new ActiveDirectory({
      url: 'ldap://agglo.local',
      baseDN: 'DC=AGGLO,DC=LOCAL',
      username: 'hdechavignyadm@AGGLO.LOCAL',
      password: 'd@nZel!77',
    });
    //cut phrase "Negotiate "
    var ticket = req.headers.authorization.substring(10);
    console.log('-----------TICKET-----------');
    console.log(ticket);

    //init context
    kerberos.principalDetails('HTTP', 'vvdecha-smb.agglo.local', (err, context) => {
      console.log('##################');
      console.log(context);


      // generate the first Kerberos token
      const mechOID = kerberos.GSS_MECH_OID_SPNEGO;//GSS_MECH_OID_KRB5;
      kerberos.initializeClient('HTTP@vvdecha-smb.agglo.local', {mechOID}, (err, client) => {
        console.log('-----------CLIENT-----------');
        console.log(client);

        //check ticket
        kerberos.initializeServer('HTTP@vvdecha-smb.agglo.local', (err,server) => {
          console.log('----------SERVEUR-----------');
          console.log(server);

          //console.log('----------CONTEXT-----------');
          //console.log(context);

          client.step('', (err, clientResponse) => {

            request.get(
              { url:'http://vvdecha-smb.agglo.local/auth/sso', headers: { Authorization: `Negotiate ${ticket}` } },
              (err, response) => {
                console.log('----------AUTH CLIENT REPONSE-----------');
                console.log(response);
                if (response) {
                // validate the headers exist and contain a www-authenticate message
                  const authenticateHeader = response.headers['www-authenticate'];
                  console.log('----------auth header-----------');
                  console.log(authenticateHeader);

                  // verify the return Kerberos token
                  const tokenParts = authenticateHeader.split(' ');
                  const serverKerberosToken = tokenParts[tokenParts.length - 1];
                  client.step(serverKerberosToken, err => {
                    console.log('----------client auth-----------');
                    console.log(client.contextComplete);

                  });
                } else {
                  console.log('-----------CLIENT REPONSE-----------');
                  console.log(clientResponse);

                  server.step(clientResponse, (err, serverResponse) => {
                    console.log('----------SERVEUR REPONSE-----------');
                    console.log(serverResponse);

                    client.step(serverResponse, async (err) => {
                      console.log('-----------CLIENT RESULT-----------');
                      console.log(client);
                      console.log('----------SERVEUR RESULT-----------');
                      console.log(server);

                      //client.username.split('@')[0])
                      var user = await ldapSpeSearch(('(|(uid={{username}})(sAMAccountName={{username}}))').replace(/{{username}}/g,'hdechavigny'),['Name','GivenName','Description','Office','SamAccountName','UserPrincipalName','ThumbnailPhoto','DisplayName','Company','Department','City','HomePhone','mail','OfficePhone','IPPhone','MobilePhone','PostalCode','StreetAddress','co','Surname','Manager','EmployeeNumber','MemberOf','Enabled','CannotChangePassword','PasswordNeverExpires','AccountExpirationDate','whenChanged','whenCreated','LastLogonDate']);
                      console.log('----------USER LDAPJS RESULT-----------');
                      console.log(user);

                    });

                  });


                }
              }
            );



          });

        });

        /*client.step('', (err, kerberosToken) => {
          console.log('-----------KERBEROS TOKEN-----------');
          console.log(kerberosToken);

        });*/


      });
    });

    // this code is for Windows - yet not working

    //var Ssip = require('kerberos').SSIP;
    //var ticket = req.headers.authorization.substring(10);
  }
});

module.exports = router;
app.use(router);
app.listen(3030);
