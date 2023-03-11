//const { Service } = require('feathers-nedb')
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const SSHClient = require("ssh2").Client;

const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH()
exports.ShellSsh = class ShellSsh {//extends Service {



  constructor (options, app) {

    this.options = options || {};
    this.events = ['customEvent'];


  }



  setup (app, path) {
    this.app = app;
    this.path = path;
    this.params = app.params;
  }

  async create(data, params) {


    return new Promise((resolve,reject)=>{

      if (data) {
        ssh.connect(data.connexion).then(async () =>{
          result = await ssh.execCommand(data.cmd, data.cwd)
          resolve(result)
        })

      } else {
        reject("aucune données")
      }

    })





  }

}
