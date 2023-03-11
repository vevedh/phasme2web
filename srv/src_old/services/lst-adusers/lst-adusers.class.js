/* eslint-disable no-unused-vars */
const logger = require('../../logger');


const npwrshell = require('powershell');
const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {

    /*`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`*/
    var psShell   = new npwrshell(` $username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName svrwebtests.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,{
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      noProfile: true
    });

    psShell.on('error', err => {
      logger.info(err);
      reject(err);
    });

    // Stdout

    psShell.on('output', data => {
      //logger.info(data);
      resolve(data);
    });

    // Stderr
    psShell.on('error-output', data => {
      logger.info(data);
      reject(data);
    });

    // End
    psShell.on('end', code => {
      // Do Something on end
      psShell = null;
    });
  });

};

exports.LstAdusers = class LstAdusers {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    const resdom = await runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json');
    // logger.info(resdom)
    let currentDomain;

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain);
      currentDomain = resdom.Domain;
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '');
    }
    const tmp = await runPowerShell(`Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite|convertto-json`);
    let useDC = JSON.parse(tmp).HostName[0];
    logger.info('Req : %s',`get-aduser -identity "${id}"  -Server  "${useDC}" -property * | select SamAccountName,cn,DistinguishedName|convertTo-json`);
    const lstUsers = await runPowerShell(`get-aduser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))"  -Server  "${useDC}" -property * | select SamAccountName,cn|convertTo-json`);
    // console.log("User :",lstUsers)
    return (String(lstUsers).trim() != '') ? JSON.parse(lstUsers) : [];
    // return  this.ldapSearch();
  }

  async get (id, params) {
    const resdom = await runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json');
    // logger.info(resdom)
    let currentDomain;

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain);
      currentDomain = resdom.Domain;
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '');
    }

    const tmp = await runPowerShell(`Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite|convertto-json`);
    let useDC = JSON.parse(tmp).HostName[0];
    logger.info('Requete : %s',`get-aduser -identity "${id}"  -Server  "${useDC}" -property * | select SamAccountName,cn,DistinguishedName|convertTo-json`);
    const admanager = await runPowerShell(`get-aduser -identity "${id}"  -Server  "${useDC}" -property * | select SamAccountName,cn,DistinguishedName|convertTo-json`);

    return JSON.parse(admanager);
    // return this.ldapSpeSearch(this.app.get('authentication').ldap.searchFilter.replace(/{{username}}/g,id),["Name","GivenName","Description","Office","SamAccountName","UserPrincipalName","ThumbnailPhoto","DisplayName","Company","Department","City","HomePhone","mail","OfficePhone","IPPhone","MobilePhone","PostalCode","StreetAddress","co","Surname","Manager","EmployeeNumber","MemberOf","Enabled","CannotChangePassword","PasswordNeverExpires","AccountExpirationDate","whenChanged","whenCreated","LastLogonDate"]);
    // return  this.ldapUserSearch(id);
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }

  setup (app, path) {
    this.app = app;
    this.path = path;
    this.params = app.params;
  }

  ldapSearch () {
    const client = this.app.get('ldapClient');
    client.bind(this.app.get('authentication').ldap.bindDN, this.app.get('authentication').ldap.bindCredentials, (err, res) => {
      if (err) {
        logger.info('Echec de connexion ldap !');
      }
      if (res) {
        logger.info('Connexion ldap etablie !');
      }
    });
    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))', // '(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 3000,
      paged: true,
      attributes: ['sAMAccountName', 'name']
    };
    var values = [];
    return new Promise((resolve, reject) => {
      client.search(this.app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          logger.info('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
          // console.log('entry: ' + JSON.stringify(entry.object));
            if (entry.object) {
              var obj = {};
              var entry = JSON.parse(JSON.stringify(entry.object));
              obj.SamAccountName = entry.sAMAccountName;
              obj.cn = (entry.name) ? entry.name : '';
              values.push(obj);
            }
          });
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join());
          });
          resp.on('error', (err) => {
            console.error('error: ' + err.message);
            client.unbind();
            resolve(values);
          });
          resp.on('end', (result) => {
            client.unbind();
            // console.log('status: ' + result.status);
            // console.log('Ldap search result :',values);
            // res.json(values);
            resolve(values);
          });
        }
      });
    });
  }

  ldapUserSearch (user) {
    const client = this.app.get('ldapClient');
    client.bind(this.app.get('authentication').ldap.bindDN, this.app.get('authentication').ldap.bindCredentials, (err, res) => {
      if (err) {
        logger.info('Echec de connexion ldap !');
      }
      if (res) {
        logger.info('Connexion ldap etablie !');
      }
    });
    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: `(|(distinguishedName=${user}))`, // this.app.get('authentication').ldap.searchFilter.replace(/{{username}}/g,user),//'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 3000,
      paged: true,
      attributes: ['sAMAccountName', 'displayName', 'userAccountControl']
    };
    var values = [];
    return new Promise((resolve, reject) => {
      client.search(this.app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            console.log('entry: ' + JSON.stringify(entry.object));
            if (entry.object) {
              var obj = {};
              var entry = JSON.parse(JSON.stringify(entry.object));
              obj.SamAccountName = entry.sAMAccountName;
              obj.cn = (entry.displayName) ? entry.displayName : '';
              obj.DistinguishedName = entry.dn;
              values.push(obj);
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
            if (values && values.length > 0) {
              values = values[0];
            } else {
              values = {};
            }
            resolve(values);
          });
        }
      });
    });
  }

  ldapSpeSearch (filter, attribs) {
    const adMap = [
      { ad: 'Name', ld: 'name' }, { ad: 'GivenName', ld: 'givenName' }, { ad: 'Description', ld: 'description' }, { ad: 'Office', ld: 'physicalDeliveryOfficeName' }, { ad: 'SamAccountName', ld: 'sAMAccountName' },
      { ad: 'UserPrincipalName', ld: 'userPrincipalName' }, { ad: 'ThumbnailPhoto', ld: 'thumbnailPhoto' }, { ad: 'DisplayName', ld: 'displayName' }, { ad: 'Company', ld: 'company' },
      { ad: 'Department', ld: 'department' }, { ad: 'City', ld: 'l' }, { ad: 'HomePhone', ld: 'homePhone' }, { ad: 'mail', ld: 'mail' }, { ad: 'OfficePhone', ld: 'telephoneNumber' }, { ad: 'IPPhone', ld: 'ipPhone' },
      { ad: 'MobilePhone', ld: 'mobile' }, { ad: 'PostalCode', ld: 'postalCode' }, { ad: 'StreetAddress', ld: 'streetAddress' }, { ad: 'co', ld: 'co' }, { ad: 'Surname', ld: 'sn' }, { ad: 'Manager', ld: 'manager' },
      { ad: 'EmployeeNumber', ld: 'employeeNumber' }, { ad: 'MemberOf', ld: 'memberOf' }, { ad: 'Enabled', ld: 'userAccountControl' }, { ad: 'CannotChangePassword', ld: 'userAccountControl' },
      { ad: 'PasswordNeverExpires', ld: 'userAccountControl' }, { ad: 'AccountExpirationDate', ld: 'accountExpires' }, { ad: 'whenChanged', ld: 'whenChanged' }, { ad: 'whenCreated', ld: 'whenCreated' }, { ad: 'LastLogonDate', ld: 'modifyTimeStamp' }
    ];
    const client = this.app.get('ldapClient');
    client.bind(this.app.get('authentication').ldap.bindDN, this.app.get('authentication').ldap.bindCredentials, (err, res) => {
      if (err) {
        logger.info('Echec de connexion ldap !');
      }
      if (res) {
        logger.info('Connexion ldap etablie !');
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
      client.search(this.app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err);
        } else {
          resp.on('searchEntry', (entry) => {
            console.log('entry: ' + JSON.stringify(entry.object));
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
  }

  // -----------------------------------------------------------
};
