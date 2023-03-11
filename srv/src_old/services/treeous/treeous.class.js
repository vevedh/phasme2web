/* eslint-disable no-unused-vars */
const logger = require('../../logger')

const npwrshell = require('powershell')

const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {
    var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      noProfile: true
    });

    psShell.on("error", err => {
      logger.info(err);
      reject(err);
    });

    // Stdout

    psShell.on("output", data => {
      logger.info(data);
      resolve(data);
    });

    // Stderr
    psShell.on("error-output", data => {
      logger.info(data);
      reject(data);
    });

    // End
    psShell.on("end", code => {
      // Do Something on end
      psShell = null;
    });
  });

}
// the ugly catch all
process.on('uncaughtException', (error) => {
  const { message, stack } = error
  console.log('error', error)
//	AppLogger.error({ error: { message, stack } });
})
exports.TreeOUs = class TreeOUs {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {

    // recuperation du nom de domaine
    const resdom = await runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json')
    // logger.info(resdom)
    let currentDomain

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain)
      currentDomain = resdom.Domain
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '')
    }
    const treeous = await runPowerShell(`${__dirname}/../../../pwrshell/Get-ChildOUStructure.ps1`)
    return (String(treeous).trim() != '') ? JSON.parse(treeous) : []
    // return  this.ldapSearch();
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }

  setup (app, path) {
    this.app = app
    this.path = path
    this.params = app.params
  }


}
