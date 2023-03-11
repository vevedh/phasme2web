/* eslint-disable linebreak-style */
const { Service } = require('feathers-mongodb');
const query = require('query');
const logger = require('../../logger');

const npwrshell = require('powershell');



const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {

    var psShell   = new npwrshell(` $username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName svrwebtests.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,{
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      noProfile: true
    });

    psShell.on('error', err => {
      logger.info(err);
      reject(err);
    });

    // Stdout `$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`

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
exports.AdOUs = class AdOUs extends Service   {
  constructor (options, app) {
    super(options);
    this.app = app;
    app.service('databases').find({
      query: {
        dbName: 'ad-ous',
        dbType: 'mongodb'
      }
    }).then((dbFind) =>{
      if (dbFind && (dbFind.length != 0)) {
        //console.log('Dbfind :', dbFind);
        console.log('Cette table existe déjà malheureusement !');
      } else {
        app.service('databases').create({
          dbType: 'mongodb',
          dbName: 'ad-ous',
          createAt: new Date()
        })
          .then((dbCreate)=>{
            if (dbCreate) {
              console.log('Creation de la table  dbOus effectuée ');
            }
          });

      }

    });


    app.get('mongoClient').then(db => {
      this.Model = db.collection('ad-ous');
    });
  }

  async find (params) {
 
    let rdatas = [];

    //let useDC = this.app.get('dc');
    const lstUsers = await this.app.get('pwshCmd')('Get-ADOrganizationalUnit -Filter {Name -like \'*\'} | select name,DistinguishedName,@{n=\'OUPath\';e={$_.distinguishedName -replace \'^.+?,(CN|OU.+)\',\'$1\'}} | convertto-json');

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
        console.log('Données de la Table ad-ous Effacées ');
        this.Model.insertMany(rdatas, (err,results)=>{
          if (err) {
            console.log('Mise à jour de la table ad-ous impossible !');
          }
          console.log('Mise à jour de la table ad-ous');
        });
      });
    }

    return rdatas;
    // return  this.ldapSearch();
  }
};
