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
// the ugly catch all
process.on('uncaughtException', (error) => {
  const { message, stack } = error
  console.log('error', error)
//	AppLogger.error({ error: { message, stack } });
})
exports.LstAdfonctions = class LstAdfonctions {
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
    const lstFonctions = await runPowerShell(`Get-aduser -filter *  -Server  "${useDC}" -property description | select -ExpandProperty description -Unique |convertTo-json`)
    return (String(lstFonctions).trim() != '') ? JSON.parse(lstFonctions) : []
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
      filter: '(|(uid=*)(sAMAccountName=*)(&(samAccountType=805306368)(!(sn=Exchange))))', // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
      scope: 'sub',
      sizeLimit: 2000,
      paged: true,
      attributes: ['description']
    }
    // var values = [];
    var uniques = []

    return new Promise((resolve, reject) => {
      client.search(this.app.get('authentication').ldap.searchBase, opts, (err, resp) => {
        if (err) {
          console.log('Error in search ' + err)
          reject(err)
        } else {
          resp.on('searchEntry', (entry) => {
            // console.log('entry: ' + JSON.stringify(entry.object));
            var obj = {}
            try {
              var entry = JSON.parse(JSON.stringify(entry.object))
              if (entry.description) {
                if (!uniques.includes(entry.description)) {
                  uniques.push(entry.description)
                  obj.Description = (entry.description) ? String(entry.description) : ''
                // values.push(obj);
                }
              }
            } catch (error) {

            }
          })
          resp.on('searchReference', (referral) => {
            console.log('referral: ' + referral.uris.join())
          })
          resp.on('error', (err) => {
            console.log('error: ' + err)

            client.unbind()
            // console.log('Ldap search result :', values);
            // res.json(values);
            resolve(uniques)
          })

          resp.on('close', (pkoi) => {
            console.log('Terminé pour :', pkoi)
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
