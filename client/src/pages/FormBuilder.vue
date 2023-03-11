<template>
  <q-page>
    <vv-form-builder
      v-if="showBuilder"
      :value="fields"
      @save="onSave"
      @goBack="gotoAccueil()"
      @onlist="showListForms"
      :nameForm="currentFormId"
      :formName="formName"
      :formType="vtype"
      :formAcc="rformAcc"
      :dbname="vdbname"
      :tablename="vtablename"
    />

    <q-dialog v-model="Alert_NewForm">
      <q-card>
        <q-toolbar>
            <img src="~assets/cacemx200.png" />
          <q-toolbar-title>
              <span class="text-weight-bold">Sauvegarde Impossible</span>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          Merci de remplir les champs dans "PROPRIETE" - "GENERAL".
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showAdminMenu" :position="'left'" full-height>
      <q-card style="width: 280px">
        <q-linear-progress :value="1" color="amber" />

        <q-card-section class="row items-start no-wrap">
          <q-list>
            <q-item-label header class="text-h6 text-grey-8 q-pt-xs">
              Menu Administrateur
            </q-item-label>
            <q-item clickable to="/">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Accueil</q-item-label>
                <q-item-label caption> Retour à l'accueil </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showUserMenu" :position="'left'" full-height
      ><!-- v-if="!isSiteAdmin" -->
      <q-card style="width: 280px">
        <q-linear-progress :value="1" color="amber" />

        <q-card-section class="row items-start no-wrap">
          <q-list>
            <q-item-label header class="text-h6 text-grey-8 q-pt-xs">
              Menu Utilisateur
            </q-item-label>
            <q-item clickable to="/">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Accueil</q-item-label>
                <q-item-label caption> Retour à l'accueil </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              :to="{ path: 'nouveau', query: { type: 'parking' } }"
            >
              <q-item-section avatar>
                <q-icon name="directions_car_filled" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Packing</q-item-label>
                <q-item-label caption> Formulaire parking </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
// we import all of `colors`
import { colors, QSpinnerGears } from 'quasar';
const { lighten, setBrand } = colors;
import { date } from 'quasar';
import {
  VvFormBuilder,
  RvFormBuilder,
  QFormBuilder,
  TextElement,
  CacemusersElement,
  CommunesElement,
  ParagraphElement,
  ImageElement,
  CheckboxesElement,
  RadioElement,
  DateElement,
  TimeElement,
  DropdownElement,
  EmailElement,
  NameElement,
  SimpleNameElement,
  AddressElement,
  PhoneElement,
  FileElement,
  PaymentElement,
  TermsElement,
  PageBreakElement,
  SectionBreakElement,
  PassagersElement,
  HiddenElement,
} from 'components/form/index';
import DiagVvTable from 'components/DiagVvTable.vue';
import DiagSettings from 'components/Settings.vue';

export default defineComponent({
  name: 'FormBuilder',
  components: {
    VvFormBuilder,
    RvFormBuilder,
    QFormBuilder,
    TextElement,
    CacemusersElement,
    CommunesElement,
    ParagraphElement,
    CheckboxesElement,
    RadioElement,
    DateElement,
    TimeElement,
    DropdownElement,
    EmailElement,
    NameElement,
    SimpleNameElement,
    AddressElement,
    PhoneElement,
    FileElement,
    PaymentElement,
    TermsElement,
    PageBreakElement,
    ImageElement,
    SectionBreakElement,
    PassagersElement,
    HiddenElement,
  },
  data() {
    const myLocale = {
      /* starting with Sunday */
      days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
      months:
        'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
      monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split('_'),
      firstDayOfWeek: 0,
    };

    return {
      tab: 'nouveau',
      Alert_NewForm: false,
      showBuilder: true,
      fields: [],
      fieldData: [],
      fieldsModel: {},
      currentFormName: 'vide',
      vdbname:'mongodb',
      vtablename:'',
      formName: '',
      formAcc: [],
      vtype: 'publique',
      currentFormId: '',
      showPopUp: false,
      showTimePopUp: false,
      FormValid: true,
      showAdminMenu: false,
      showUserMenu: false,
      showParticules: false,
      currentTitle: '',
      selectedDate: date.formatDate(Date.now(), 'DD/MM/YYYY'),
      selectedTime: date.formatDate(Date.now(), 'HH:mm'),

      sfVisiteurs: {
        arriveed: date.formatDate(Date.now(), 'DD/MM/YYYY'),
        arriveeh: date.formatDate(Date.now(), 'HH:mm'),
        sortieh: date.formatDate(Date.now(), 'HH:mm'),
      },
    };
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
    }),
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      savedForm: (state) => state.savedform,
    }),
    ...mapState('auth', {
      currentUserId: (state) => state.user.sAMAccountName,
    }),
    rformAcc() {
      if (!Object(this.formData[0]).hasOwnProperty('accusers')) return [];
      return this.formData[0].accusers;
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
    async gotoAccueil() {
      this.$router.push('/formulaires');
    },
    async onSave(value, formName, formType, accusers,dbname,tablename) {
      console.log('onSave :', value, formName);
      if (Array.isArray(value) && value.length === 0) {
        this.$q.notify({
          message: 'Formulaire vide sauvegarde impossible',
          color: 'negative',
        });
        this.Alert_NewForm = true;
      } else {
        if (formName.trim() === '') {
          this.$q.notify({
            message: 'Formulaire vide sauvegarde impossible',
            color: 'negative',
          });
        } else {
          if (this.currentFormId && this.currentFormId.trim() != '') {
            await this.updateForm({
              uid: this.currentFormId,
              nom: formName,
              data: value,
              user: this.currentUserId,
              type: formType,
              accusers: accusers,
              dbname: dbname,
              tablename: tablename
            });
          } else {
            await this.saveForm({
              nom: formName,
              data: value,
              user: this.currentUserId,
              type: formType,
              accusers: accusers,
              dbname: dbname,
              tablename: tablename
            });
          }

          await this.updateDisplayForm(this.savedForm.uid);
          //await this.getForm({ nom: this.currentFormName })
          //console.log('Donnée du formulaire visiteurs :', this.formData);
          //let dtform = Object.assign([],this.formData)
          if (this.formData.length > 0 && this.formData[0].data.length > 0) {
            const fv = Object.assign([], this.formData);
            const ffields = Object.assign([], fv[0].data);
            this.setForm(ffields, {});
          }
          this.$q.notify({
            message: 'Formulaire mémoriser avec succès',
            color: 'positive',
          });
          console.log('Donnees form :', this.fieldData);
        }
      }

      /*await this.saveForm({ nom: value.formName, data: value.data , user:this.currentUserId, type:'privé' })

            await this.updateDisplayForm(this.savedForm._id)
            //await this.getForm({ nom: this.currentFormName })
            //console.log('Donnée du formulaire visiteurs :', this.formData);
            //let dtform = Object.assign([],this.formData)
            if (this.formData.length > 0 && this.formData[0].data.length > 0) {
                const fv = Object.assign([], this.formData)
                const ffields = Object.assign([], fv[0].data)
                this.setForm(ffields, {})
            }
            this.$q.notify({
                message: 'Formulaire mémoriser avec succès',
                color: 'positive'
            })
            console.log('Donnees form :', this.fieldData)*/
    },
    showListForms(evt) {
      this.$q
        .dialog({
          component: DiagVvTable,
          dbname: 'formulaires',
          dbtype: 'cacemdb',
          twidth: '70%',
        })
        .onOk(async (evt) => {
          console.log('OK', evt);
          this.currentFormId = evt.uid;

          await this.updateDisplayForm(this.currentFormId);
        })
        .onCancel(() => {
          console.log('Cancel');
        })
        .onDismiss(() => {
          console.log('Called on OK or Cancel');
        });
    },
    showSettings(evt) {
      this.$q
        .dialog({
          component: DiagSettings,
          config: this.fconfig,
          twidth: '70%',
        })
        .onOk(async (conf) => {
          console.log('OK settings', conf);
          await this.writeConfig(conf);
          if (Object(conf).hasOwnProperty('bgright')) {
            colors.setBrand('bgright', conf.bgright);
          }
        })
        .onCancel(() => {
          console.log('Cancel');
        })
        .onDismiss(() => {
          console.log('Called on OK or Cancel');
        });
    },
    async setForm(fvalues, fmodel) {
      let arrKeys = Object.keys(fmodel);
      let arrVal = Object.entries(fmodel);
      this.fieldData = arrKeys.reduce(
        (column, key) => ((column[key] = fmodel[key]), column),
        {}
      );

      //console.log('Field Datas :',this.fieldData)
      //fieldData.push({ `${field}`:})
      const fdta = Object.assign([], fvalues);
      this.fields = Object.assign([], fdta);

      this.fieldsModel = Object.assign({}, fmodel);
      //this.fieldData = Object.assign({}, fmodel);
    },
    /**
     * Quand la valeur d'un champ du formulaire change
     */
    onInput(val, id) {
      //if (id!=null) {
      console.log(`${id}: ` + JSON.stringify(val));
      console.log('Field Datas :', this.fieldData);
      //}
    },
    /**
     * Obtient l'element composant du formulaire basé sur 'field_type' de l'obet field champ  ex: type text => TextElement
     */
    getElement(field) {
      const nameParts = field.field_type.split('_');
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] =
          nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1);
      }
      return nameParts.join('') + 'Element';
    },
    /**
     *
     */
    async updateDisplayForm(fid) {
      await this.getForm(fid);
      console.log('Donnée du formulaire chargée :', this.formData);

      if (Object(this.formData[0]).hasOwnProperty('titre')) {
        this.currentTitle = this.formData[0].titre;
      }
      this.formName = this.formData[0].nom;
      this.vtype = this.formData[0].type;
      this.vdbname = this.formData[0].dbname;
      this.vtablename = this.formData[0].tablename;
      this.currentFormId = this.formData[0].uid;
      const usersacc = this.formData[0].accusers;
      Object.assign(this.formAcc, this.formData[0].accusers); //
      console.log('Données accès :', this.formAcc);
      //let dtform = Object.assign([],this.formData)
      if (this.formData && this.formData.length > 0 && this.formData[0].data && this.formData[0].data.length > 0) {
        const fv = Object.assign([], this.formData);
        const ffields = Object.assign([], fv[0].data);
        this.setForm(ffields, {
          datearr: date.formatDate(Date.now(), 'DD/MM/YYYY'),
        });
      }
    },
  },
  async beforeMount() {
    console.log('Parms ID :',this.$route.params.id)
    this.currentFormId  = this.$route.params.id;
    if (this.currentFormId!='') {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      await this.updateDisplayForm(this.currentFormId)
      this.$q.loading.hide();
    }
  },
  async mounted() {
    //setBrand('bgright', '#10cb23')

    if (this.showParticules) {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000',
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: 'img/github.svg',
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 20,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: false,
              mode: 'grab',
            },
            onclick: {
              enable: false,
              mode: 'push',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: false,
      });
    }

    
    
    /**/
  },
  watch: {
    fields: {
      handler(val) {
        console.log('FormData :', val);
      },
      deep: true,
    },
  },
});
</script>


