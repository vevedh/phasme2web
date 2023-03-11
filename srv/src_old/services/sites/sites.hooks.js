const jetpack = require('fs-jetpack')
const logger = require('../../logger')
const express = require('@feathersjs/express')
const populateSites = async (context) => {
  const { app, method, result, params } = context

  console.log('method :', context.method)
  console.log('data :', context)
  context.result = []

  if (app.get('prj_folder') && (app.get('prj_folder') != '') && (jetpack.exists(app.get('prj_folder')) == 'dir')) {
    // si le repertoire des projets est vide
    this.projList = jetpack.list(app.get('prj_folder'))// [];
    // app.projets = this.projList;
    logger.info('Projets : ' + this.projList)
    // console.log('Projets :',this.projList);

    // Pour chaque projets le sous répertoire www -> site web du nom du projet (valable pour Ionic)
    const projModules = []
    // Initialisation des repertoires de projets
    for (let index = 0; index < this.projList.length; index++) {
      const projetName = this.projList[index]
      logger.info('Projet : ' + this.projList[index])
      context.result.push({
        nom: this.projList[index],
        type: 'node'
      })
      //  liste des projets publiables
      if (jetpack.exists(`${app.get('prj_folder')}/${projetName}/www`) == 'dir') {
        app.use(`/${projetName}`, express.static(`${app.get('prj_folder')}/${projetName}/www`))
        if (jetpack.exists(`${app.get('prj_folder')}/${projetName}/cacem.config.json`) == 'file') {
          logger.info('Projet à publier : ' + `/${projetName}`)
          // console.log("Projet à publier :",`/${projetName}`);
          // app.use(`/${projetName}`,express.static(`${app.get('prj_folder')}/${projetName}/www`));
        }
        // this.main.configure(this.serveur.express.rest());
      }
      if (jetpack.exists(`${app.get('prj_folder')}/${projetName}/cacem.config.json`) == 'file') {
        const projConfig = jetpack.read(`${app.get('prj_folder')}/${projetName}/cacem.config.json`, 'json')
        console.log(`Projet ${this.projList[index]} : `, projConfig)
        context.result.push({
          nom: this.projList[index],
          type: 'CACEM'
        })
      }

      // liste des projets ionic

      // liste des projets nodes
    }
    // app.set('projets',JSON.stringify(projModules));
  } else {
    logger.info("Le dossier des projets(sites) n'est pas configuré !\n \"proj_list\": \"dossier_des_projets\" dans le fichier config/default.json !")
  }

  return context
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
