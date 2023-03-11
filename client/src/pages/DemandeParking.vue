<template>
  <q-page class="container q-pa-none vertical-top row justify-center items-start self-start">
    <q-card style="width: 90%; max-width: 100%" class="q-pt-none">
      <q-toolbar class="text-white full-width bg-blue">
        <q-toolbar-title class="text-h5"> Demande d'accès Parking ! </q-toolbar-title>
        <!--<q-btn flat round dense icon="close" v-close-popup />-->
      </q-toolbar>

      <q-card-section class="q-pa-md" style="width: 100%; max-width: 100%">
        <f-vv-form-by-name
          ref="demandeParkingForm"
          :nameForm="'Demande Parking'"
          class="q-pa-sm"
          :fieldsmodel="{chargeaccueil:currentUsername, typeacces:'PARKING',etat:'attente'}"
          :showSave="true"
          :saveLabel="'Envoyer la demande'"
          @onFormAdded="addFormDatas"
        ></f-vv-form-by-name>
        <!-- :hiddenFields="[{chargeaccueil:currentUsername, typeacces:'PARKING',etat:'attente'}]"-->
      </q-card-section>
    </q-card>
    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          
          
          <q-icon size="5vh" name="info_outline" color="primary"/>
          <span class="q-ml-sm">Confirmez-vous cette demande ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn  label="Annuler" color="negative" v-close-popup />
          <q-btn  label="Confimer" color="primary" @click="confirmDatas" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSendMail" persistent>
      <q-card>
        <q-card-section class="row items-center">
          
          
          <q-icon size="5vh" name="done" color="secondary"/>
          <span class="q-ml-sm">Un E-mail de confirmation à été envoyé aux administrateurs</span>
        </q-card-section>

        <q-card-actions align="right">
          
          <q-btn  label="Fermer" color="primary" @click="showSendMail=false" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent } from '@vue/composition-api';

import { mapState, mapActions } from 'vuex';

import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';

import nunjucks from 'nunjucks';

import FVvFormByName from '../components/FVvFormByName.vue';

export default defineComponent({
  components: {
    FVvFormByName,
  },
  data() {
    return {
      currentUser: {},
     saveFields: {},
      showConfirm: false,
      showSendMail: false
    };
  },
  computed: {
    ...mapState('admin', {
      formData: (state) => state.getform,
      ftemplates: (state) => state.ftemplates,
      template: (state) => state.template,
    }),
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,  
      users: (state) => state.users,
    }),
    currentUsername() {
      console.log('Root :', this.$store);
      return this.$store.state.auth.user.sAMAccountName;
    },
    
  },
  methods: {
    ...mapActions('adinfos', ['getRole']),
    ...mapActions('admin', [
      'getAllVisiteurs',
      'addVisiteur',
      'getForm',
      'getTemplate',
      'getFormByName',
      'saveForm',
      'getConfig',
      'writeConfig',
      'sendMail',
    ]),
    addFormDatas(fieldsValues) {
      this.showConfirm = true;
      this.saveFields = Object.assign({},fieldsValues);
       console.log('Valeur des champs :', this.saveFields);
      
    },
    async confirmDatas() {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      console.log('Valeur des champs :', this.saveFields);
      console.log('Champs du formulaire :',this.formData)
      console.log('Utilisateur connecté :',this.$store.state.auth)
      
      let msgMail = this.formData[0].data
        .filter(
          (o) =>
            Object(o).hasOwnProperty('id') && Object(o).hasOwnProperty('label')
        )
        .map((elt) => {
          if (this.saveFields[elt.id]) {
            if (Array.isArray(this.saveFields[elt.id])) {
              return `<b>${elt.label} : </b><br>`+this.saveFields[elt.id]
                .map((elt) =>
                  Object.entries(elt).map(
                    ([key, val]) => `<b>${key} :</b>${val}<br>`
                  ).join('')
                ).join('');
            } else {
              return `<b>${elt.label} : </b>${this.saveFields[elt.id]}<br>`;
            }
          } else {
            return '<br>';
          }
        })
        .join('');
      let usermail = this.$store.state.auth.user.mail

      //pascal.deleray@cacem-mq.com,

      //if (this.formData[0].nom=='Demande Parking') {
        const regex = /\((.*)\)/gm;
        let contact = regex.exec(this.saveFields['contactinterne'])[1];
        console.log('Envoi au contact interne :',contact)
        console.log('Envoi au utilisateur :',usermail)
       let objMail = {
            to: `pascal.deleray@cacem-mq.com,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,${usermail},${contact}`,
            subject: `Demande de Réservation Parking `,
            message: `${msgMail}`,
          };
        console.log('Envoi au msg :',objMail)  
      /*} else {
        objMail = {
            to: `admindsi@cacem-mq.com,${usermail}`,
            subject: `${this.formData[0].nom} `,
            message: `${msgMail}`,
          };
      }*/


      /*if (this.formData[0].templateid) {
        await this.getTemplate(this.formData[0].templateid);
        console.log('Template :',this.template)
        msgMail = nunjucks.renderString(this.template.html,this.saveFields);
        objMail = {
          to: 'admindsi@cacem-mq.com',
          subject: `Demande de réservation parking (test)`,
          message: `${msgMail}`,
        };
      }*/
      
      await this.addVisiteur(this.saveFields);
      await this.sendMail(objMail);
      this.$q.loading.hide();
      this.showConfirm = false;
      //sendMail
      this.showSendMail=true;
    }
  },
  async beforeMount() {
    if (this.$store.state.auth.user) {
      this.currentUser = this.$store.state.auth.user;
    }
    console.log('Profil :', this.currentUser);
    await this.getFormByName('Demande Parking');
    console.log('Champs du formulaire :',this.formData)
  },
  mounted() {
    
  },
});
</script>
