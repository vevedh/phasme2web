/* eslint-disable no-unused-vars */
const logger = require('../../logger')
/*const powershell = require('node-powershell')

const runPowerShell = (cmd) => {
  var psw = new powershell({
    executionPolicy: 'Bypass',
    outputEncoding: 'utf-8',
    noProfile: true
  })

  return new Promise((resolve, reject) => {
    psw.addCommand('$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding')
    psw.addCommand(cmd)
      .then(() => psw.invoke()
        .then((res) => {
          // log.info("Résulat brut :",res);
          psw.dispose()
          resolve(res)
        }, (reason) => {
          reject(reason)
        })
      )
  })
}*/
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
      //logger.info(data);
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
exports.LstAdservices = class LstAdservices {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    const resdom = await runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json')
    // logger.info(resdom)
    let currentDomain

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain)
      currentDomain = resdom.Domain
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '')
    }
    const tmp = await runPowerShell(`Get-ADDomainController -DomainName ${currentDomain} -Discover -NextClosestSite|convertto-json`);
    let useDC = JSON.parse(tmp).HostName[0];
    const lstServices = await runPowerShell(`get-aduser -filter *  -Server  "${useDC}" -property department | select -ExpandProperty department -Unique |convertTo-json`)
    return (String(lstServices).trim() != '') ? JSON.parse(lstServices) : []
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

  async ldapSearch () {
    const client = this.app.get('ldapClient')
    client.bind(this.app.get('authentication').ldap.bindDN, this.app.get('authentication').ldap.bindCredentials, (err, res) => {
      if (err) {
        logger.info('Echec de connexion ldap !')
      }
      if (res) {
        logger.info('Connexion ldap etablie !')
      }
    })
    var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
      filter: '(|(uid=*)(sAMAccountName=*))', // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 2000,
      paged: true,
      attributes: ['department']
    }
    // var values = [];
    var uniques = []

    return new Promise((resolve, reject) => {
      client.search(this.app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err)
        } else {
          resp.on('searchEntry', (entry) => {
            // console.log('entry: ' + JSON.stringify(entry.object));
            var obj = {}
            var entry = JSON.parse(JSON.stringify(entry.object))
            if (entry.department) {
              if (!uniques.includes(entry.department)) {
                uniques.push(entry.department)
                obj.Department = (entry.department) ? String(entry.department) : ''
                // values.push(obj);
              }
            }
          })
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join())
          })
          resp.on('error', (err) => {
            console.error('error: ' + err.message)
            client.unbind()
            resolve(uniques)
          })
          resp.on('end', (result) => {
            client.unbind()
            // console.log('Ldap search result :', values);
            // res.json(values);
            resolve(uniques)
          })
        }
      })
    })
  }
}
