<template>
  <q-page class="vertical-top q-pa-md row items-top justify-center full-width">
    <q-card style="width: 80%; max-width: 100%">
      <q-toolbar class="text-white full-width bg-blue">
        <q-toolbar-title class="text-h5">{{formNom}} ! </q-toolbar-title>
        
      </q-toolbar>

      <q-card-section class="q-pa-md" >
        <div v-if="notLoaded">Chargement en cours...</div>
        <div></div>
        <f-vv-form
          ref="demandeParkingForm"
          :idForm="fid"
          :fieldsmodel="getFieldsModel"
          class="q-pa-sm"
          :showSave="true"
          :showBuild="showEditBtn"
          @onFormAdded="submitForm"
          @formLoaded="onLoaded"
        ></f-vv-form>
        <!-- :hiddenFields="[{chargeaccueil:currentUsername, typeacces:'PARKING',etat:'attente'}]"-->
      </q-card-section>
    </q-card>
    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="5vh" name="info_outline" color="primary" />
          <span class="q-ml-sm">Confirmez-vous : {{ formNom }} ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Annuler" color="negative" v-close-popup />
          <q-btn label="Confimer" color="primary" @click="confirmDatas" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSendMail" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="5vh" name="done" color="secondary" />
          <span class="q-ml-sm"
            >Un E-mail de confirmation à été envoyé aux administrateurs</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Fermer"
            color="primary"
            @click="showSendMail = false"
            v-close-popup
          />
          
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import nunjucks from 'nunjucks';
import { defineComponent } from '@vue/composition-api';
import { mapState, mapActions } from 'vuex';
import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';
import FVvForm from '../components/FVvForm.vue';
export default defineComponent({
  name: 'PageForm',
  components: {
    FVvForm,
  },
  data() {
    return {
      formID: '',
      notLoaded: true,
      saveFields: {},
      fieldsmodel: {},
      showConfirm: false,
      showSendMail: false,
      showEditBtn:false,
      state: {},
      valid: false,
    };
  },
  computed: {
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      ftemplates: (state) => state.ftemplates,
      template: (state) => state.template,
    }),
    fid() {
      return this.formID;
    },
    currentUsername() {
      console.log('Root :', this.$store);
      return this.$store.state.auth.user.sAMAccountName;
    },
    usermail(){
      if (!this.$store.state.auth.user.mail)
        return
      return this.$store.state.auth.user.mail
    },
    formNom() {
      try {
        return this.formData[0].nom
      } catch (error) {
        return
      }
      
    },
   
    
    getFieldsModel() {
      if (!this.fieldsmodel) return;
      return this.fieldsmodel;
    },
  },
  methods: {
    ...mapActions('admin', [
      'getAllVisiteurs',
      'addVisiteur',
      'addDatasForm',
      'getTemplate',
      'getForm',
      'saveForm',
      'getConfig',
      'writeConfig',
      'sendMail',
    ]),
    onLoaded(valForm) {
      if (valForm && Array.isArray(valForm)) {
        this.notLoaded = false;
      }
    },
    
    submitForm(values) {
      console.log('Save datas for form ID :', this.formID);
      console.log('Valeurs :', values);
      this.addFormDatas(values);
    },
    onInput(value, field) {
      this.$set(this.model, field, value);
    },
    onClick(value, field) {
      this.$set(this.model, field, value);
      console.log('Close');
      console.log('Element :', document.getElementsByClassName('q-menu'));
      document.getElementsByClassName('q-menu')[0].remove();
    },
    addFormDatas(fieldsValues) {
      this.showConfirm = true;
      this.saveFields = Object.assign({}, this.fieldsmodel, fieldsValues);
      console.log('Save Valeur des champs :', this.saveFields);
    },
    async confirmDatas() {
      console.log('Valeur des champs :', this.saveFields);
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });

      let objMail;

      let msgMail = this.formData[0].data
        .filter(
          (o) =>
            Object(o).hasOwnProperty('id') && Object(o).hasOwnProperty('label')
        )
        .map((elt) => {
          if (this.saveFields[elt.id]) {
            if (Array.isArray(this.saveFields[elt.id])) {
              return (
                `<b>${elt.label} : </b><br>` +
                this.saveFields[elt.id]
                  .map((elt) =>
                    Object.entries(elt)
                      .map(([key, val]) => `<b>${key} :</b>${val}<br>`)
                      .join('')
                  )
                  .join('')
              );
            } else {
              return `<b>${elt.label} : </b>${this.saveFields[elt.id]}<br>`;
            }
          } else {
            return '<br>';
          }
        })
        .join('');

      //pascal.deleray@cacem-mq.com,
      if (this.formData[0].nom=='Demande d\'accès Parking') {
        const regex = /\((.*)\)/gm;
        let contact = regex.exec(this.saveFields['contactinterne'])[1];
        console.log('Envoi au contact interne :',contact)
        console.log('Envoi utilisateur :',this.usermail)
        objMail = {
            to: `pascal.deleray@cacem-mq.com,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,${this.usermail},${contact}`,
            subject: `Demande d'accès Parking `,
            message: `${msgMail}`,
          };
      } else {
        objMail = {
            to: `admindsi@cacem-mq.com,${usermail}`,
            subject: `${this.formData[0].nom} `,
            message: `${msgMail}`,
          };
      }
      if (process.env.NODE_ENV != 'production') {
          objMail = {
            to: `admindsi@cacem-mq.com,${contact}`,
            subject: `** Developpement ** Demande d'accès Parking`,
            message: `${msgMail}`,
          };
        }
      
      console.log('Form save datas :',this.saveFields)
       console.log('Form dbname:',this.formData[0].dbname)
       console.log('Form tablename:',this.formData[0].tablename)

      await this.addDatasForm({
        fields: this.saveFields,
        dbname: this.formData[0].dbname,
        tablename: this.formData[0].tablename,
      });


      /*if (this.formData[0].templateid) {
        await this.getTemplate(this.formData[0].templateid);
        console.log('Template :',this.template)
        msgMail = nunjucks.renderString(this.template.html,this.saveFields);
        objMail = {
          to: 'pascal.deleray@cacem-mq.com,admindsi@cacem-mq.com',
          subject: `Demande de réservation parking (test)`,
          message: `${msgMail}`,
        };
      }*/

      await this.sendMail(objMail);
      this.$q.loading.hide();
      this.showConfirm = false;
      this.showSendMail = true;
      //sendMail
    },
  },
  async beforeMount() {
    console.log('Parms ID :', this.$route.params.id);
    this.formID = this.$route.params.id;
    
    if (this.formID != '') {
      await this.getForm(this.formID);
      if (this.currentUsername == this.$store.state.admin.getform[0].user) {
        this.showEditBtn = true
      }
      console.log('Données du formulaire chargée :', this.formData);
     
      if (
        this.formData &&
        (this.formData.length == 1) &&
        Object(this.formData[0]).hasOwnProperty('data')
      ) {
        const fieldWithDefault = this.formData[0].data.filter(
          (o) => o.innerValue && o.innerValue != ''
        );
        console.log('Field form default values :', fieldWithDefault);

        if (
          fieldWithDefault &&
          Array.isArray(fieldWithDefault) &&
          fieldWithDefault.length > 0
        ) {
          this.fieldsmodel = {};
          fieldWithDefault.forEach((elt, index) => {
            this.fieldsmodel[`${elt.id}`] = elt.innerValue;
          });
        }
      }

      console.log('Field model :', this.fieldsmodel);
    }
  },
  mounted() {
     console.log('Form user :',this.$store.state.admin.getform)
     console.log('Login user :',this.currentUsername)
     
  },
});
</script>
<style lang="scss">
.profil {
  padding-top: 60px;
}
</style>
