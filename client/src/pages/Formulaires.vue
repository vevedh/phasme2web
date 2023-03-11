<template>
  <q-page class="flex flex-top justify-center q-pa-md q-pt-xl">
    <q-card flat v-if="!showNew" style="width:80%">
      <q-card-section class="full-width text-center text-h4">
        Liste de vos formulaires
      </q-card-section>
      <q-card-actions vertical align="right">
        <q-btn flat label="Nouveau" class="bg-primary text-white q-mr-md" icon="add" @click="showNew=true"/>   
      </q-card-actions>
      <q-card-section style="width:100%">
        <f-vv-table
          
          v-if="Array.isArray(allForms)&&(allForms.length>0)"
          ref="fftables"
          :columns_filter="true"
          :datas="allowForms"
          :columns="['nom','uid','type']"
          row-key="name"
          :selectable="formEditable"
          :editable="true"
          :editEvent="true"
          @row-click="openForm"
          @onEdit="editForm"
        />
      </q-card-section>
    </q-card>
    <q-card flat v-if="showNew"  style="width:75%;">
    <q-card-section class="full-width text-center text-h4">
     Détails de votre nouveau formulaire
     <h5>{{newUid}}</h5>
    </q-card-section>
    <q-card-actions horizontal align="right">
        <q-btn flat label="Retour à la liste" class="bg-primary text-white q-mr-md" icon="arrow_back" @click="showNew=false"/> 
         <q-btn flat  class="bg-primary text-white q-mr-md" icon="edit" to="/formbuilder"><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Modifier le formulaire...
          </q-tooltip></q-btn>
      </q-card-actions>
    <q-card-section>
      <f-vv-form
       class="q-pa-sm"
       :fieldsData="[
          {
            label: 'Général',
            field_type: 'section_break',
            cid: '8229dc9a-6787-4be5-8e3d-e9749d975ea9',
            name: 'section_break',
            show_options: [],
            event_options: [],
            span: '12',
          },
          {
            label: 'Nom du Formulaire',
            field_type: 'text',
            required: true,
            cid: 'b2ddfcc8-3ff2-4d04-90cc-fb24920d78c9',
            id: 'nom',
            span: 12,
            show_options: [],
            field_options: {
              description: '',
              span: 12,
              filled: false,
              'stack-label': true,
            },
          },
        ]"
       :showSave="true"  @onFormAdded="addNewForm"
      ></f-vv-form><!-- @onFormAdded="submitForm"-->
    </q-card-section>
    </q-card>
    <q-dialog v-model="showAlertFormName" persistent>
      <q-card>
        <q-card-section class="row items-center">
          
          
          <q-icon size="5vh" name="info_outline" color="negative"/>
          <span class="q-ml-sm">Ce nom de formulaire existe déjà !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn  label="Fermer" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

import { mapState, mapActions } from 'vuex';

import { date, QSpinnerGears , QBtn, QTooltip, uid} from 'quasar';


import FVvTable from '../components/FVvTable.vue';
import FVvForm from '../components/FVvForm.vue';

export default defineComponent({
  name: 'FormulairesPage',
  data() {
    return {
      allf:[],
      newFormUid:null,
      showNew:false,
      showAlertFormName:false
    }
  },
  components: {
    FVvTable,
    FVvForm
  },
  computed: {
    ...mapState('auth', {
      currentUserId: (state) => state.user.sAMAccountName,
    }),
     ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
       grpUser: (state) => state.userGrpes,
      siteRole: (state) => state.siteRole
    }),
     ...mapState('auth', {
      currentUserId: (state) => state.user.sAMAccountName,
    }),
    ...mapState('admin', {
      allForms: (state) => state.allForms,
    }),
    allowForms() {
      if (Array.isArray(this.allForms)) {
        //let result = Object.assign([],this.allForms);
        return this.allForms.filter((elt) => {
          return (elt.user == this.currentUserId) || (elt.type=='publique');
        });
      }
    },
    formEditable(){
      return this.isAdmin
    },
    newUid() {
      this.newFormUid = uid()
      return this.newFormUid
    },
    
  },
  methods: {
    ...mapActions('admin', [
      'getForm',
      'saveForm',
      'updateForm',
      'getAllForms',
      'getConfig',
      'writeConfig',
    ]),
    openForm(evt, row, index) {
      this.$router.push(`/form/${row.uid}`);
    },
    editForm(fields) {
      console.log('Champs :',fields)
      if (fields._id) {
        this.$router.push(`/formbuilder/${fields.uid}`)
      }
    },
    async addNewForm(values) {
      if (this.allForms.filter(o => o.nom===values.nom).length===0) {
        console.log('Valeurs du formulaire :',values)
        values.uid = this.newUid;
        values.type = 'privé';
        values.user = this.currentUserId;
        values.data = [];
        values.sendmails = ['admindsi@cacem.fr'];
        values.templateid = ''
        await this.saveForm(values)
      } else {
        this.showAlertFormName=true
      }
      
      
    },
  },
  
  async beforeMount() {
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    await this.getAllForms()
      this.$q.loading.hide();
      console.log('Formulaires autorisés :', this.allForms);
  },
  /*async mounted() {
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    await this.getAllForms()
      this.$q.loading.hide();
      console.log('Formulaires autorisés :', this.allForms);
  },*/
});
</script>

<style></style>
