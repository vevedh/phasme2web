/* eslint-disable linebreak-style */
const { Service } = require('feathers-mongodb');
const query = require('query');
const logger = require('../../logger');
const crypto = require('crypto');
const base64js = require('base64-js');
const npwrshell = require('powershell');

const runpwsh = (cmd) => {
  return new Promise((resolve, reject) => {
    //`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`
    var psShell = new npwrshell(
      ` $username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName svrwebtests.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,
      {
        executionPolicy: 'Bypass',
        outputEncoding: 'utf-8',
        noProfile: true,
      }
    );

    psShell.on('error', (err) => {
      logger.info(err);
      reject(err);
    });

    // Stdout

    psShell.on('output', (data) => {
      //logger.info(data);
      resolve(data);
    });

    // Stderr
    psShell.on('error-output', (data) => {
      logger.info(data);
      reject(data);
    });

    // End
    psShell.on('end', (code) => {
      // Do Something on end
      psShell = null;
    });
  });
};

exports.AdUsers = class AdUsers extends Service {
  //

  constructor(options, app) {
    //this.options = options || {}
    super(options);
    this.app = app;

    app
      .service('databases')
      .find({
        query: {
          dbName: 'ad-users',
          dbType: 'mongodb',
        },
      })
      .then((dbFind) => {
        if (dbFind && dbFind.length != 0) {
          //console.log('Dbfind :', dbFind);
          console.log('Cette table existe déjà malheureusement !');
        } else {
          app
            .service('databases')
            .create({
              dbType: 'mongodb',
              dbName: 'ad-users',
              createAt: new Date(),
            })
            .then((dbCreate) => {
              if (dbCreate) {
                console.log('Creation de la table  dbUsers effectuée ');
              }
            });
        }
      });

    app.get('mongoClient').then((db) => {
      this.Model = db.collection('ad-users');
    });
  }

  async find(params) {
    console.log('Params :', params);
    logger.info(params);

    let rdatas = [];

    //const tmp = await this.app.get('pwshCmd')(`Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite|convertto-json`);

    //logger.info('Powershell command qui bug : %s',`Get-ADUser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))"   -Server  "${useDC}" -property * | select  Name,GivenName,Description,Office,SamAccountName,UserPrincipalName,ThumbnailPhoto,DisplayName,Company,Department,City,HomePhone,mail,OfficePhone,IPPhone,MobilePhone,PostalCode,StreetAddress,co,Surname,Manager,EmployeeNumber,MemberOf,Enabled,CannotChangePassword,PasswordNeverExpires,AccountExpirationDate,whenChanged,whenCreated,LastLogonDate|convertTo-json`);
    //const lstUsers = await this.app.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});
    const lstUsers = await this.app.get('pwshCmd')(
      'Get-ADUser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))"  -property * | select  Name,GivenName,Description,Office,SamAccountName,UserPrincipalName,ThumbnailPhoto,DisplayName,Company,Department,City,HomePhone,mail,OfficePhone,IPPhone,MobilePhone,PostalCode,StreetAddress,co,Surname,Manager,EmployeeNumber,MemberOf,Enabled,CannotChangePassword,PasswordNeverExpires,AccountExpirationDate,whenChanged,whenCreated,LastLogonDate|convertTo-json'
    );

    //console.log('Liste :',lstUsers);

    if (String(lstUsers).trim() != '') {
      rdatas = JSON.parse(lstUsers);
      console.log('User :', rdatas[0].SamAccountName);
      if (params.query) {
        console.log('Query :', params.query);
        rdatas = query.query(rdatas, params.query);
      }
      // The Gravatar image service
      const gravatarUrl = 'https://s.gravatar.com/avatar';
      // The size query. Our chat needs 60px images
      const queryimg = 's=60';
      rdatas.forEach((value, index, array) => {
        var gravatarImg = '';
        if (value.mail) {
          const hash = crypto
            .createHash('md5')
            .update(value.mail.toLowerCase())
            .digest('hex');
          gravatarImg = `${gravatarUrl}/${hash}?${queryimg}`;
        }
        value.ThumbnailPhoto =
          value.ThumbnailPhoto == null
            ? gravatarImg
            : 'data:image/jpeg;base64,' +
              base64js.fromByteArray(value.ThumbnailPhoto); // arrayBufferToBase64(value.ThumbnailPhoto).toString()

        if (typeof value.Enabled === 'boolean') {
          value.Enabled = value.Enabled.toString();
        }
        if (value.AccountExpirationDate) {
          value.AccountExpirationDate = new Date(
            Number(String(value.AccountExpirationDate).match(/\d/g).join(''))
          ).toLocaleString();
        }
        if (value.whenChanged) {
          value.whenChanged = new Date(
            Number(String(value.whenChanged).match(/\d/g).join(''))
          ).toLocaleString();
        }
        if (value.LastLogonDate) {
          value.LastLogonDate = new Date(
            Number(String(value.LastLogonDate).match(/\d/g).join(''))
          ).toLocaleString();
        }
        if (value.whenCreated) {
          value.whenCreated = new Date(
            Number(String(value.whenCreated).match(/\d/g).join(''))
          ).toLocaleString();
        }
      });

      logger.info('Creation des utilisateurs');
      //console.log('Datas :',rdatas.length);
      this.Model.deleteMany({}, (err, results) => {
        if (err) {
          console.log('supression impossible !');
        }
        console.log('Données de la Table ad-user Effacées ');
        this.Model.insertMany(rdatas, (err, results) => {
          if (err) {
            console.log('Mise à jour de la table ad-users impossible !');
          }
          console.log('Mise à jour de la table ad-users');
        });
      });
    }

    return rdatas;
    // return  this.ldapSearch();
  }

  async get(id, params) {
    const resdom = await this.app.get('pwshCmd')(
      'Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json'
    );
    // logger.info(resdom)
    let currentDomain;

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain);
      currentDomain = resdom.Domain;
    } else {
      currentDomain = this.app
        .get('authentication')
        .ldap.searchBase.replace(',', '.')
        .replace(/dc\=/gi, '');
    }
    const tmp = await this.app.get('pwshCmd')(
      `Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite|convertto-json`
    );
    let useDC = JSON.parse(tmp).HostName[0];
    const admanager = await this.app.get('pwshCmd')(
      `Get-aduser -identity "${id}"  -Server  "${useDC}" -property * | select SamAccountName,cn,DistinguishedName|convertTo-json`
    );

    return JSON.parse(admanager);
    // return this.ldapSpeSearch(this.app.get('authentication').ldap.searchFilter.replace(/{{username}}/g,id),["Name","GivenName","Description","Office","SamAccountName","UserPrincipalName","ThumbnailPhoto","DisplayName","Company","Department","City","HomePhone","mail","OfficePhone","IPPhone","MobilePhone","PostalCode","StreetAddress","co","Surname","Manager","EmployeeNumber","MemberOf","Enabled","CannotChangePassword","PasswordNeverExpires","AccountExpirationDate","whenChanged","whenCreated","LastLogonDate"]);
    // return  this.ldapUserSearch(id);
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  setup(app, path) {
    this.app = app;
    this.path = path;
    this.params = app.params;
  }
};
