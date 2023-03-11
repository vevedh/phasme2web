/* eslint-disable linebreak-style */
const { Service } = require('feathers-mongodb');
const query = require('query');
const logger = require('../../logger');

const npwrshell = require('powershell');

const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {
    //`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`
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
exports.AdPCs = class AdPCs extends Service  {
  constructor (options, app) {
    super(options);
    this.app = app;
    app.service('databases').find({
      query: {
        dbName: 'ad-pcs',
        dbType: 'mongodb'
      }
    }).then((dbFind) =>{
      if (dbFind && (dbFind.length != 0)) {
        //console.log('Dbfind :', dbFind);
        console.log('Cette table existe déjà malheureusement !');
      } else {
        app.service('databases').create({
          dbType: 'mongodb',
          dbName: 'ad-pcs',
          createAt: new Date()
        })
          .then((dbCreate)=>{
            if (dbCreate) {
              console.log('Creation de la table  dbPcs effectuée ');
            }
          });

      }

    });


    app.get('mongoClient').then(db => {
      this.Model = db.collection('ad-pcs');
    });
  }
  async find (params) {
  
    let rdatas = [];

    let useDC = this.app.get('dc');
    const lstUsers = await this.app.get('pwshCmd')(`Get-ADComputer -f { Name -like '*' }  -Server  "${useDC}" -Properties * |select SamAccountName,DistinguishedName,Name,DNSHostName,OperatingSystem,OperatingSystemServicePack,OperatingSystemVersion,CanonicalName,IPv4Address|ConvertTo-json`);

    if (String(lstUsers).trim() != '') {
      rdatas = JSON.parse(lstUsers);
      //console.log("User :",rdatas[0])
      if (params.query) {
        console.log('Query :',params.query);
        rdatas = query.query(rdatas,params.query);
      }
      this.Model.deleteMany({},(err,results)=>{
        if (err) {
          console.log('supression impossible !');
        }
        console.log('Données de la Table ad-pcs Effacées ');
        this.Model.insertMany(rdatas, (err,results)=>{
          if (err) {
            console.log('Mise à jour de la table ad-pcs impossible !');
          }
          console.log('Mise à jour de la table ad-pcs');
        });
      });
    }

    return rdatas;
    // return  this.ldapSearch();
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
