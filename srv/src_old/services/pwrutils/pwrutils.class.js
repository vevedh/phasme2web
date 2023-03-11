/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const logger = require('../../logger');

const npwrshell = require('powershell');

/*
const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {
    /*var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      noProfile: true
    });//
    var psShell = new npwrshell(
      ` $username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName dc12.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,
      {
        executionPolicy: 'Bypass',
        outputEncoding: 'utf-8',
        noProfile: true,
        PSCore: true
      }
    );

    psShell.on('error', err => {
      logger.info(err);
      reject(err);
    });

    // Stdout

    psShell.on('output', data => {
      logger.info(data);
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

};*/
// the ugly catch all
process.on('uncaughtException', (error) => {
  const { message, stack } = error;
  console.log('error', error);
//	AppLogger.error({ error: { message, stack } });
});
exports.PwrUtils = class PwrUtils {
  constructor (options,app) {
    this.options = options || {};
    this.runPowerShell = (cmd) => {


      return new Promise((resolve, reject) => {
        /*var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
          executionPolicy: 'Bypass',
          outputEncoding: 'utf-8',
          noProfile: true
        });*/
        var psShell = new npwrshell(
          ` $username = "${app.get('authentication').ldap.bindDN}"; $password = ConvertTo-SecureString "${app.get('authentication').ldap.bindCredentials}" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName dc12.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,
          {
            executionPolicy: 'Bypass',
            outputEncoding: 'utf-8',
            noProfile: true,
            PSCore: true
          }
        );

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

    this.runScriptShell = (cmd) => {


      return new Promise((resolve, reject) => {
        /*var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
          executionPolicy: 'Bypass',
          outputEncoding: 'utf-8',
          noProfile: true
        });*/
        var psShell = new npwrshell(
          ` $username = "${app.get('authentication').ldap.bindDN}"; $password = ConvertTo-SecureString "${app.get('authentication').ldap.bindCredentials}" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName dc12.agglo.local -Authentication Negotiate -Credential $usercred -FilePath   ${cmd}  `,
          {
            executionPolicy: 'Bypass',
            outputEncoding: 'utf-8',
            noProfile: true,
            PSCore: true
          }
        );

        psShell.on('error', err => {
          logger.info(err);
          reject(err);
        });

        // Stdout

        psShell.on('output', data => {
         // logger.info(data);
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
  }

  async find (params) {

    // recuperation du nom de domaine
    const resdom = await this.runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json');
    // logger.info(resdom)
    let currentDomain = this.app.get('dc');

    /*if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain);
      currentDomain = resdom.Domain;
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '');
    }*/

    let useDC = await this.runPowerShell(`(Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite).HostName`);

    let utilName = params.query.name;
    let utilParams = params.query.params;

    logger.info('Name = %j',utilName);
    logger.info('Params = %j',utilParams);

    let lstAccesUtils = ['Get-ChildOUStructure','Get-childItemTree'];
    let result = [];
    if (lstAccesUtils.includes(utilName)) {
      switch (utilName) {
      case 'Get-childItemTree':
        // eslint-disable-next-line no-case-declarations
        const treedir = await this.runScriptShell(`${__dirname}/../../../pwrshell/Get-childItemTree  -Path ${utilParams[0].path}`);
        result = (String(treedir).trim() != '') ? JSON.parse(treedir) : [];
        break;
      case 'Get-ChildOUStructure':
        // eslint-disable-next-line no-case-declarations
        const treeous = await this.runScriptShell(`${__dirname}/../../../pwrshell/Get-ChildOUStructure.ps1`);
        result = (String(treeous).trim() != '') ? JSON.parse(treeous) : [];
        break;

      default:
        break;
      }

      return result;
    } else {
      return ['Non Possible'];
    }


  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
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


};
