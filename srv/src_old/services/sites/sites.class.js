// const { Service } = require('feathers-nedb');
const jetpack = require('fs-jetpack')
const path = require('path')
const logger = require('../../logger')
const express = require('@feathersjs/express')
exports.Sites = class Sites {
  constructor (options) {
    this.options = options || {}
  }

  setup (app, path) {
    this.app = app
    this.path = path
    this.params = app.params
  }

  async find (params) {
    var projModules = []

    if (this.app.get('prj_folder') && (this.app.get('prj_folder') != '') && (jetpack.exists(this.app.get('prj_folder')) == 'dir')) {
      // si le repertoire des projets est vide
      this.projList = jetpack.list(this.app.get('prj_folder'))// [];
      // app.projets = this.projList;
      logger.info('Projets : ' + this.projList)
      // console.log('Projets :',this.projList);

      // Pour chaque projets le sous répertoire www -> site web du nom du projet (valable pour Ionic)

      // Initialisation des repertoires de projets
      for (let index = 0; index < this.projList.length; index++) {
        const projetName = this.projList[index]
        var prjType = ''
        var webFolder = false
        var mnNom = ''
        var mnDesc = ''
        var mnIcon = ''
        var supAdmGrpes = []
        var admGrpes = []
        var userGrpes = []

        if (jetpack.exists(`${this.app.get('prj_folder')}/${projetName}/package.json`) == 'file') {
          logger.info('Projet : ' + this.projList[index])
          // liste des projets nodes
          prjType = 'node'

          if (jetpack.exists(`${this.app.get('prj_folder')}/${projetName}/ionic.config.json`) == 'file') {
            // liste des projets ionic
            prjType = 'ionic'
          }

          if (jetpack.exists(`${this.app.get('prj_folder')}/${projetName}/www/assets/cacem.config.json`) == 'file') {
            // liste des projets cacem
            prjType = 'CACEM'

            // console.log("Projet à publier :",`/${projetName}`);
            // app.use(`/${projetName}`,express.static(`${this.app.get('prj_folder')}/${projetName}/www`));
          }

          //  liste des projets publiables
          if (jetpack.exists(`${this.app.get('prj_folder')}/${projetName}/www`) == 'dir') {
            webFolder = true
            logger.info('Projet à publier : ' + `/${projetName}`)

          }

          if (jetpack.exists(`${this.app.get('prj_folder')}/${projetName}/www/assets/cacem.config.json`) == 'file') {
            const projConfig = jetpack.read(`${this.app.get('prj_folder')}/${projetName}/www/assets/cacem.config.json`, 'json')
            console.log(`Projet ${this.projList[index]} : `, projConfig)
            if (projConfig.mnNom) {
              mnNom = projConfig.mnNom
            }
            if (projConfig.mnDesc) {
              mnDesc = projConfig.mnDesc
            }
            if (projConfig.mnIcon) {
              mnIcon = projConfig.mnIcon
            }
            if (projConfig.supAdmGrpes) {
              supAdmGrpes = projConfig.supAdmGrpes
            }
            if (projConfig.admGrpes) {
              admGrpes = projConfig.admGrpes
            }
            if (projConfig.userGrpes) {
              userGrpes = projConfig.userGrpes
            }
          }
          projModules.push({
            nom: projetName,
            type: prjType,
            www: webFolder,
            mnNom: mnNom,
            mnDesc: mnDesc,
            mnIcon: mnIcon,
            supAdmGrpes: supAdmGrpes,
            admGrpes: admGrpes,
            userGrpes: userGrpes
          })
        }
      }
      // app.set('projets',JSON.stringify(projModules));
    } else {
      logger.info("Le dossier des projets(sites) n'est pas configuré !\n \"proj_list\": \"dossier_des_projets\" dans le fichier config/default.json !")
    }

    return projModules
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
}
