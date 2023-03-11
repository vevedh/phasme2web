import { ActionTree } from 'vuex';

import { uid } from 'quasar';

import axios from 'axios';

import { AdminStateInterface } from './state';
import feathersClient from '../../boot/feathers-client'

const actions: ActionTree<AdminStateInterface, any> = {
  setTitle (context, payload) {
    // your code
    context.commit('changeTitle', payload);
  },
  //  obtenir la configuration depuis le fichier config.json
  async getConfig (context) {
    console.log('Env :', process.env.NODE_ENV)
    let config;
    if (process.env.NODE_ENV === 'development') {
      config = (await axios.get('config.json')).data;
      //config = await feathersClient.service('json_referentieldd').get('config.json');
    } else {
      config = await feathersClient.service('json_www').get('config.json');
    }

    console.log('Config :', config);
    context.commit('setConfig', config);
  },
  async writeConfig (context, value) {
    await feathersClient.service('json_www').create({ path: 'config.json', data: value });
    console.log('Env :', process.env.NODE_ENV)
    let config;
    if (process.env.NODE_ENV === 'development') {
      config = (await axios.get('config.json')).data;

    } else {
      config = await feathersClient.service('json_www').get('config.json');
    }

    console.log('Config :', config);
    context.commit('setConfig', config);
  },
  //  changer l'etat du menu de gauche visible ou pas
  toggleLeftDrawer (context) {
    context.commit('changeLeftDrawer')
  },
  // envoyé un mail
  async sendMail (context, params) {
    
    let to = params.to;
    let subject = params.subject;
    let message = params.message;

    const emailperso = {
      to: to,
      subject: subject,
      html: `${message}`
    };
    console.log('Email :',emailperso)

    let send = await feathersClient
      .service('mailer')
      .create(emailperso)
    if (send) {
      context.commit('setMailSendEmail', true);
    } else {
      context.commit('setMailSendEmail', false);
    }

  },
  //  initialiser une base de donnée depuis un tableau (Array)
  async initDbFromArray (context, params) {
    let datas = params.datas;
    let dbName = params.dbName;
    let dbTable = params.dbTable;
    if (!Array.isArray(datas)) {
      return
    }
    datas.forEach(async (data) => {
      await feathersClient.service('tables').create(data, {
        query: {
          tableDb: dbName,//'db_visiocacem',
          tableName: dbTable//'salles',
        }
      })
    })

  },
  // liste des utilisateurs de la cacem
  async getAllUsers (context) {
    let users
    if (process.env.NODE_ENV === 'production') {
      users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({}) } })
      //users = await feathersClient.service('adUsers').find({})
    } else {
      users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({}) } })
      //users = await feathersClient.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});//await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      //users = await feathersClient.service('adUsers').find({})
    }

    console.log("Liste des utilisateurs :", users)
    context.commit('setAllUtilisateurs', users)
  },
  // liste des utilisateurs de la cacem
  async updateAllUsers (context) {
    let users
    if (process.env.NODE_ENV === 'production') {
      //users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      users = await feathersClient.service('adUsers').find({})
    } else {
      //users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      //users = await feathersClient.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});//await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      users = await feathersClient.service('adUsers').find({})
    }

    console.log("Liste des utilisateurs :", users)
    context.commit('setAllUtilisateurs', users)
  },
   // liste des ordinateurs de la cacem
   async getAllPCs (context) {
    let pcs
    if (process.env.NODE_ENV === 'production') {
      pcs = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-pcs', query: JSON.stringify({}) } })
      //pcs = await feathersClient.service('adPCs').find({})
    } else {
      pcs = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-pcs', query: JSON.stringify({}) } })
      //pcs = await feathersClient.service('adPCs').find({})
    }

    console.log("Liste des pccs :", pcs)
    context.commit('setAllComputers', pcs)
  },
  // liste des ordinateurs de la cacem
  async updateAllPCs (context) {
    let pcs
    if (process.env.NODE_ENV === 'production') {
      //users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      pcs = await feathersClient.service('adPCs').find({})
    } else {
      //users = await feathersClient.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});//await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      pcs = await feathersClient.service('adPCs').find({})
    }

    console.log("Liste des pccs :", pcs)
    context.commit('setAllComputers', pcs)
  },
  // liste des ordinateurs de la cacem
  async getAllOUs (context) {
    let ous
    if (process.env.NODE_ENV === 'production') {
      ous = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-ous', query: JSON.stringify({}) } })
      //ous = await feathersClient.service('adOUs').find({})
    } else {
      //users = await feathersClient.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});//await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      ous = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-ous', query: JSON.stringify({}) } })
    }

    console.log("Liste des unites organisationnelles :", ous)
    context.commit('setAllOUs', ous)
  },
   // liste des ordinateurs de la cacem
   async updateAllOUs (context) {
    let ous
    if (process.env.NODE_ENV === 'production') {
      //users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      ous = await feathersClient.service('adOUs').find({})
    } else {
      //users = await feathersClient.service('ldap-search').find({ query:'(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))'});//await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{}}) } })
      ous = await feathersClient.service('adOUs').find({})
    }

    console.log("Liste des unites organisationnelles :", ous)
    context.commit('setAllOUs', ous)
  },
  /**
   *   Sauvegarde du formulaire
   */
  async saveForm(context,value) {
    //  { nom:'formulaire nom', data: 'donnes fields'}
    //console.log("Value :",value)
    /*const getform = await feathersClient.service('tables').find({ query: { tableDb: 'db_user', tableName: 'formulaires', query: JSON.stringify({ query: { nom: value.nom } }) } })
    let saveform
    if (getform.length>0) {
      console.log('Mise a jour du formulaire :',getform)
       saveform = await feathersClient.service('tables').update(getform[0]._id,value, {
        query: {
          tableDb: 'cacemdb',
          tableName: 'formulaires',
        }
      })
    } else {*/
      console.log('Sauvegarde nouveau formulaire :',value);
      if (!Object(value).hasOwnProperty('uid')) {
        value.uid = uid()
      }
      
       let saveform = await feathersClient.service('tables').create(value, {
        query: {
          tableDb: 'cacemdb',
          tableName: 'formulaires',
        }
      })
    //}

    console.log("Formulaire memorisé :", saveform);
    context.commit('setSavedForm', saveform)
    const getAllforms = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formulaires', query: JSON.stringify({}) } })
      console.log("Liste des formulaires :", getAllforms)
      context.commit('setAllForms', getAllforms)

    
  },
  /**
   *   Mise ajour du formulaire
   */
   async updateForm(context,value) {
   
      console.log('Update nouveau formulaire :',value)
      const getform = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formulaires', query: JSON.stringify({ query: { uid: value.uid } }) } })
       let saveform = await feathersClient.service('tables').update(getform[0]._id,value, {
        query: {
          tableDb: 'cacemdb',
          tableName: 'formulaires',
        }
      })

    console.log("Formulaire maj :", saveform)
    context.commit('setSavedForm', saveform)
  },
  /**
   *   chargement d'un formulaire
   */
   async getForm(context,value) {
    const getform = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formulaires', query: JSON.stringify({query:{ uid: value }}) } })
    console.log("Formulaire recupéré :", getform)
    context.commit('setGetForm', getform)
  },
  /**
   *   chargement d'un formulaire par nom
   */
   async getFormByName(context,value) {
    const getform = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formulaires', query: JSON.stringify({query:{ nom: value }}) } })
    console.log("Formulaire recupéré :", getform)
    context.commit('setGetForm', getform)
  },
   /**
   *   chargement des formulaires
   */
 async getAllForms(context) {
      const getAllforms = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formulaires', query: JSON.stringify({}) } })
      console.log("Liste des formulaires :", getAllforms)
      context.commit('setAllForms', getAllforms)
    },
     /**
   *   chargement des templates par uid formulaire
   */
  async getTemplate(context,id) {
    const getTemplate = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formtemplates', query: JSON.stringify({ query:{_id:id}}) } })
    console.log(`Template avec   ${id} :`, getTemplate)
    
    if (getTemplate.length>0) {
      context.commit('setSelTemplate', getTemplate[0])
    }
},
  /**
   *   chargement des templates par uid formulaire
   */
  async getTemplatesById(context,uid) {
      const getTemplates = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'formtemplates', query: JSON.stringify({ query:{uid:uid}}) } })
      console.log(`Liste des templates du formulaire ${uid} :`, getTemplates)
      context.commit('setTemplates', getTemplates)
      if (getTemplates.length>0) {
        context.commit('setSelTemplate', getTemplates[0])
      }
  },
  async createTemplate(context,values) {
    const createTemplate = await feathersClient.service('tables').create(values,{ query: { tableDb: 'cacemdb', tableName: 'formtemplates' } })
    console.log(`Create template :`, createTemplate);
    context.commit('setSelTemplate', createTemplate)
},
async updateTemplate(context,values) {
  const updateTemplate = await feathersClient.service('tables').update(values._id,values,{ query: { tableDb: 'cacemdb', tableName: 'formtemplates' } })
  console.log(`Update template :`, updateTemplate);
  context.commit('setSelTemplate', updateTemplate)
},
   // liste des applications CACEM
   async getAllAppLinks (context) {
    const applinks0 = await feathersClient.service('tables').find({ query: { tableDb: 'db_support', tableName: 'applinks', query: JSON.stringify({}) } })
    const applinks = await feathersClient.service('tables').find({ query: { tableDb: 'db_support', tableName: 'applinks', query: JSON.stringify({}) } })
    console.log("Liste des liens apps :", applinks)
    context.commit('setAllAppLinks', applinks)
  },
  //  creation d'un lien d'application
  async addAppLink (context, value) {
    const addapplink = await feathersClient.service('tables').create(value, {
      query: {
        tableDb: 'db_support',
        tableName: 'applinks',
      }
    })
    console.log("Add appLink  :", addapplink)
    const applinks = await feathersClient.service('tables').find({ query: { tableDb: 'db_support', tableName: 'applinks', query: JSON.stringify({}) } })
    console.log("Liste des liens apps :", applinks)
    context.commit('setAllAppLinks', applinks)

  },
  // update d'un lien d'application
  async updateAppLink (context, value) {
    const updtapplink = await feathersClient.service('tables').update(value._id,value, {
      query: {
        tableDb: 'db_support',
        tableName: 'applinks',
      }
    })
    console.log("Add appLink  :", updtapplink)
    const applinks = await feathersClient.service('tables').find({ query: { tableDb: 'db_support', tableName: 'applinks', query: JSON.stringify({}) } })
    console.log("Liste des liens apps :", applinks)
    context.commit('setAllAppLinks', applinks)

  },
   // liste des visiteurs
   async getAllVisiteurs (context) {
    const searchVisiteurs = await feathersClient.service('tables').find({ query: { tableDb: 'db_regvisiteurs', tableName: 'dbf_accueil', query: JSON.stringify({}) } })
    
    const visiteurs = searchVisiteurs.map((o:any) =>(!Object(o).hasOwnProperty('etat'))?({...o,etat:''}):({...o}));//.filter((elt: any) => (elt.etat != 'efface') )
    
    console.log("Liste des visiteurs :", visiteurs)
  
    const vparking = Object.assign([],visiteurs.filter((elt: any) => (elt.typeacces == 'PARKING')  ))
    
    console.log("Liste des visiteurs parking :", vparking)
    context.commit('setAllVisiteurs', visiteurs)
    context.commit('setVisiteursParking',vparking);
  },
  //  add visiteurs
  async addVisiteur (context, value) {
    const addvisiteur = await feathersClient.service('tables').create(value, {
      query: {
        tableDb: 'db_regvisiteurs',
        tableName: 'dbf_accueil',
      }
    })
    console.log("Add visiteur :", addvisiteur)
    const visiteurs = await feathersClient.service('tables').find({ query: { tableDb: 'db_regvisiteurs', tableName: 'dbf_accueil', query: JSON.stringify({query:{}}) } })
    console.log("Liste des visiteurs :", visiteurs)
    context.commit('setAllVisiteurs', visiteurs)
  },
  //  add datas form
  async addDatasForm (context, values) {
    console.log('Infos à sauvegarder :',values)
    const addDatas = await feathersClient.service('tables').create(values.fields, {
      query: {
        tableDb: values.dbname,
        tableName: values.tablename,
      }
    })
    console.log("Add datas :", addDatas)
    //const visiteurs = await feathersClient.service('tables').find({ query: { tableDb: 'db_regvisiteurs', tableName: 'dbf_accueil', query: JSON.stringify({query:{}}) } })
    console.log("Infos sauvegardées :", addDatas)
    context.commit('setSavedForm', addDatas)
    
  },
  //  add datas form
  async updateDatasForm (context, values) {
    console.log('Infos à mettre jour :',values.fields)
    const visiteurs = await feathersClient.service('tables').find({ query: { tableDb: values.dbname, tableName: values.tablename, query: JSON.stringify({query:{ _id:values.fields._id}}) } })
    const updtDatas = await feathersClient.service('tables').update(visiteurs[0]._id,values.fields, {
      query: {
        tableDb: values.dbname,
        tableName: values.tablename,
      }
    })
    console.log("Update datas :", updtDatas)
    
    //console.log("Infos mise a jour :", addDatas)
    //context.commit('setSavedForm', updtDatas)
    
  },
  //  add datas form
  async deleteDatasForm (context, values) {
    console.log('Id de suppression :',values.id)
    const dltDatas = await feathersClient.service('tables').remove(values.id, {
      query: {
        tableDb: values.dbname,
        tableName: values.tablename,
      }
    })
    console.log("Delete datas :", dltDatas)
    //const visiteurs = await feathersClient.service('tables').find({ query: { tableDb: 'db_regvisiteurs', tableName: 'dbf_accueil', query: JSON.stringify({query:{}}) } })
    //console.log("Infos mise a jour :", addDatas)
    //context.commit('setSavedForm', addDatas)
    
  },

};

export default actions;
