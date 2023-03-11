const express = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const decodeSearchEntry = require('./decodeSearchEntry');


module.exports = (app) => {




  const formatGuid = (data) => {
    var format = '{3}{2}{1}{0}-{5}{4}-{7}{6}-{8}{9}-{10}{11}{12}{13}{14}{15}';
    for (var i = 0; i < data.length; i++) {
      var re = new RegExp('\\{' + i + '\\}', 'g');
      // Leading 0 is needed if value of data[i] is less than 16 (of 10 as hex).
      var dataStr = data[i].toString(16);
      format = format.replace(re, data[i] >= 16 ? dataStr : '0' + dataStr);
    }
    return format;
  };

  const ldapSearch = (filter) => {

    const configuration = app.get('authentication').ldap;
    const client = app.get('ldapClient');

    if (client.connected) {
      try {
        client.undind();
      } catch (error) {
        console.log('End search');
      }

    }

    if (!client.connected) {
      client.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
        if (err) {
          console.log('Echec auth-sso de connexion ldap !');
        }
        if (res) {
          console.log('Connexion auth-sso ldap etablie avec succès!');
        }
      });
    }

    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 0,
      paged: false,
      //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
    };

    return new Promise((resolve, reject) => {
      if (!Date.fromLDAPString) {
        Date.fromLDAPString = function (s) {
          var b = s.match(/\d\d/g);
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

          return (new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]))).toLocaleDateString('fr-FR', options);
        };
      }

      var values = [];
      client.search(configuration.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            //console.log('entry: ' + JSON.stringify(entry.object));
            values.push(entry);
          });
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            console.error('error: ' + err.message);
            reject(err);
          });
          resp.on('end', () => {
            try {
              client.undind();
            } catch (error) {
              console.log('End search');
            }

            // console.log('status: ' + result.status);

            let value;
            if (values && values.length > 0) {
              value = decodeSearchEntry(values[0]);
            } else {
              value = {};
            }
            console.log('Ldap search result :',value);
            resolve(value);
          });
        }
      });

    });
  };


  const ldapSpeSearch = (filter, attribs) => {
    const adMap = [
      { ad: 'Name', ld: 'name' }, { ad: 'GivenName', ld: 'givenName' }, { ad: 'Description', ld: 'description' }, { ad: 'Office', ld: 'physicalDeliveryOfficeName' }, { ad: 'SamAccountName', ld: 'sAMAccountName' },
      { ad: 'UserPrincipalName', ld: 'userPrincipalName' }, { ad: 'ThumbnailPhoto', ld: 'thumbnailPhoto' }, { ad: 'DisplayName', ld: 'displayName' }, { ad: 'Company', ld: 'company' },
      { ad: 'Department', ld: 'department' }, { ad: 'City', ld: 'l' }, { ad: 'HomePhone', ld: 'homePhone' }, { ad: 'mail', ld: 'mail' }, { ad: 'OfficePhone', ld: 'telephoneNumber' }, { ad: 'IPPhone', ld: 'ipPhone' },
      { ad: 'MobilePhone', ld: 'mobile' }, { ad: 'PostalCode', ld: 'postalCode' }, { ad: 'StreetAddress', ld: 'streetAddress' }, { ad: 'co', ld: 'co' }, { ad: 'Surname', ld: 'sn' }, { ad: 'Manager', ld: 'manager' },
      { ad: 'EmployeeNumber', ld: 'employeeNumber' }, { ad: 'MemberOf', ld: 'memberOf' }, { ad: 'Enabled', ld: 'userAccountControl' }, { ad: 'CannotChangePassword', ld: 'userAccountControl' },
      { ad: 'PasswordNeverExpires', ld: 'userAccountControl' }, { ad: 'AccountExpirationDate', ld: 'accountExpires' }, { ad: 'whenChanged', ld: 'whenChanged' }, { ad: 'whenCreated', ld: 'whenCreated' }, { ad: 'LastLogonDate', ld: 'modifyTimeStamp' }
    ];

    if (!client.connected) {
      client.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
        if (err) {
          console.log('Echec de connexion ldap !');
          //app.set('ldapClient', client);
          //app.set('ldap_ok', false);
        }
        if (res) {
          console.log('Connexion ldap etablie avec succès!');
          if (client.connected) {
            //app.set('ldapClient', client);
            //app.set('ldap_ok', true);
          }
        }
      });
    }

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
        //reject(err);
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
            //console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            //console.error('error: ' + err.message);
            client.unbind();
            reject(err);
          });
          resp.on('end', () => {
            client.unbind();
            resolve(valentry);
          //return  Promise(valentry);
          });
        }
      });

    });
  };



  return auth_sso = (req, res, next) => {
    const configKerberos = app.get('kerberos');
    //
    console.log('-----request sso-----');
    console.log(req.headers);



    if (!req.headers['x-forwarded-user']) {

      console.log('-----response headers-----');
      console.log(req.headers);

      res.status(401).send();
    } else {
      console.log('----- User headers-----');
      console.log(req.headers['x-forwarded-user']);
      // this code is only for Linux !
      ldapSearch(('(|(uid={{username}})(sAMAccountName={{username}}))').replace(/{{username}}/g,req.headers['x-forwarded-user'])).then((user)=>{
        console.log('----------USER LDAPJS RESULT-----------');
        console.log(user);
        res.setHeader('x-forwarded-user',user);
        req.auth = req.auth || {};
        req.sso = req.sso || {};
        req.sso.user = user;
        req.auth.user = user;
        //next();
      }).catch((err)=>{
        console.log(err);
        //next();
      });

    }


  };
};
