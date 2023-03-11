<template>
  <div class="q-gutter-md row">
    <q-form
      ref="myForm"
      @submit="onSubmit"
      :style="$q.platform.is.mobile ? { width: '95%' } : { width: '100%' }"
    >
      <div class="q-gutter-none row">
        <div
          :class="($q.platform.is.mobile )?'col-md-12 ':field.span ? `col-${field.span}` : `col-auto`"
          v-for="(field, index) in visibleFields"
          :key="index"
        >
          <component
            v-model="fieldData[field.id]"
            v-on:input="onInput"
            v-bind:is="getElement(field)"
            :label="field.label"
            :labelToolTip="field.labelToolTip"
            :required="field.required"
            :field_options="field.field_options"
            :id="field.id"
            :cid="field.cid"
            :ref="field.cid"
            debounce="500"
            v-if="setShow[field.id]"
          />
        </div>
      </div>
      <div class="row q-gutter-xl item-center justify-center q-pt-md">

        <q-btn
          v-if="showSave"
          class="q-pa-sm "
          icon="save"
          color="primary"
          no-caps
          label="Enregistrer"
          type="submit"
        >
          <q-tooltip content-class="bg-amber text-center text-h6 text-dark">
            Enregistrer
          </q-tooltip>
        </q-btn>

      </div>

    </q-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import { date, QSpinnerGears , QBtn, QTooltip} from 'quasar';
import { event } from 'quasar'
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
  HiddenElement
} from 'components/form/index';

export default defineComponent({
  name: 'FVvJsonForm',
  components: {
    QBtn,
    QTooltip,
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
    HiddenElement
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    tablename: {
      type: String,
      required: false,
    },
    fieldsData: {
      type: Array,
      required: false
    },
    fieldsmodel: {
      type: Object,
      required: false
    },
    showSave: {
      required: false,
      default:false,
      type: Boolean
    },
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
      //fields: [],
      setShow: [],
      //fieldData: [],
      //fieldsModel: {},
      FormValid: true,
      selectedDate: date.formatDate(Date.now(), 'DD/MM/YYYY'),
      selectedTime: date.formatDate(Date.now(), 'HH:mm'),
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
    }),
    visibleFields() {
      if (!this.fields)
        return
      return this.fields.filter(obj => obj.field_type != 'hidden')
    },
    fields() {
      if (!this.fieldsData)
        return
      return this.fieldsData
    }

  },
  methods: {
    ...mapActions('admin', [
      'getAllVisiteurs',
      'addVisiteur',
      'getForm',
      'saveForm',
      'getConfig',
      'writeConfig',
    ]),
    onSubmit(evt) {
        console.log('Form submit :', this.$refs.myForm);
      this.$refs.myForm
        .validate()
        .then(async (valid) => {
          console.log('Valid :', valid);

          console.log('Form :', this.fieldData);
          let fieldResults = Object.assign({}, this.fieldsmodel,this.fieldData);
          console.log('Form result :', fieldResults);

          /*for (const [key, value] of Object.entries(this.fieldData)) {
            //if (!Object.keys(this.fieldsmodel).includes(key)) {
            this.fieldData[key] = '';
            //}
          }

          //  pour chaque champ/field type passagers
          let objsType = this.fields.filter(
            (o) => o.field_type === 'passagers'
          );
          objsType.forEach((elt) => {
            this.fieldData[`${elt.id}`] = Object.assign(
              [],
              [{ nom: null, prenom: null, societe: null }]
            );
          });
          this.$refs.myForm.reset();*/
          
          this.$emit('onFormAdded', fieldResults);
          //await this.updateDisplayForm(this.nameForm);
          /*
          await this.addVisiteur(this.fieldData);
          //await this.updateDisplayForm('ACCPARK');
          this.$q.notify({
            message: 'Visiteur ajouté avec succès',
            color: 'positive',
          });
          console.log('Valeur des champs :', this.fieldData);

          for (const [key, value] of Object.entries(this.fieldData)) {
            if (!Object.keys(this.fieldsmodel).includes(key)) {
              this.fieldData[key] = '';
            }

          }

          //  pour chaque champ/field type passagers
          let objsType = this.fields.filter(o => o.field_type==='passagers')
          objsType.forEach((elt)=> {
            this.fieldData[`${elt.id}`]=Object.assign([],[{ nom: null, prenom: null, societe:null }])
          })
          this.$refs.myForm.reset();
          this.$emit('onFormAdded')*/
        })
        .catch((err) => {
          this.$q.notify({
            message: 'Formulaire incomplet !!!',
            color: 'negative',
          });
        });
    },

    async setForm(fvalues, fmodel) {



      let arrKeys = Object.keys(fmodel);
      let arrVal = Object.entries(fmodel);
      this.fieldData = arrKeys.reduce(
        (column, key) => ((column[key] = fmodel[key]), column),
        {}
      );



      console.log('Field Datas :',this.fieldData)
      //fieldData.push({ `${field}`:})
      const fdta = Object.assign([], fvalues);

      this.fields = Object.assign([], fdta);
      console.log('Field form :',this.fields);



      //this.fieldsmodel = Object.assign({}, fmodel);
      //console.log('Field model :',this.fieldsModel)


      let arrFields =this.fields.map(o => (`${o.id}`))
      this.setShow = arrFields.reduce(
        (column, key) => ((column[key] = true), column),
        {}
      );
      console.log("Show fields :",this.setShow)
       console.log("Show fields model  :",this.fieldsmodel)

      this.initConds()

      //this.fieldData = Object.assign({}, fmodel);
      this.fields.forEach((elt,index)=> {

        // champs cachés
      /*if (elt.field_type=="hidden") {
          this.setShow[`${elt.id}`] = false

      }*/

      // application des conditions
        if (Object(elt).hasOwnProperty('show_options') && Array.isArray(elt.show_options) && (elt.show_options.length > 0)) {

          elt.show_options.forEach(cond => {
            console.log('Champ cible:',elt.id)
            let chp = cond.id_field
            console.log('Champ source :',chp)
            let chpValue = cond.valcalc
            console.log('Champ source valeur de comparaison :',chpValue)
            if (Object(this.fieldsmodel).hasOwnProperty(`${chp}`)) {
              console.log(' Champ source réel :',this.fieldsmodel[`${chp}`])
              this.setShow[`${elt.id}`] = (this.fieldsmodel[`${chp}`] == chpValue)
            }
          })





        }
      })
      console.log('SET SHOW :',this.setShow)
    },
    initConds() {
        this.fields.forEach((elt,index)=>{
         if (Object(elt).hasOwnProperty('show_options') && Array.isArray(elt.show_options) && (elt.show_options.length > 0)) {

              this.setShow[`${elt.id}`] = false
          }
        })

    },
    /**
     * Quand la valeur d'un champ du formulaire change
     */
    onInput(val, id) {

      //if (id!=null) {
      console.log(`${id}: ` + JSON.stringify(val));
      /*if (this.hiddenFields){
            Object.keys(this.hiddenFields).forEach((key)=>{
              if (Object(this.fieldData).hasOwnProperty(key)) {
                this.fieldData[key] =Object.assign(null,this.hiddenFields[key])
              }

            });
        }*/
        console.log('I SHOW FIELDS :',this.setShow)
        console.log('I SHOW FIELDS DATA :',this.fieldData)
        console.log('I SHOW FIELDS :',this.fields)
        const chgFields = Object.assign([],this.fields)
        const chgFieldData = Object.assign([],this.fieldData)

        chgFields.filter(o => o.field_type==='passagers').forEach((elt)=> {
          chgFieldData[`${elt.id}`]=Object.assign([],[{ nom: null, prenom: null, societe:null }])
        })


      chgFields.forEach((elt,index)=> {

        if (Object(elt).hasOwnProperty('id') && Object(elt).hasOwnProperty('show_options') && Array.isArray(elt.show_options) && (elt.show_options.length > 0)) {

            if (elt.id != id ) {

              elt.show_options.forEach(cond => {
                console.log('Champ cible:',elt.id)
                const chp = cond.id_field
                console.log('Champ source :',chp)
                const chpValue = cond.valcalc
                console.log('Champ source valeur de comparaison :',chpValue)
                if (Object(chgFieldData).hasOwnProperty(`${chp}`)) {
                  console.log(' Champ source réel :',chgFieldData[`${chp}`])
                  this.setShow[`${elt.id}`] = (chgFieldData[`${chp}`] == chpValue)
                }
              });
            }






        }
      })
      console.log('SET SHOW :',this.setShow)

      //console.log("THIS :",this.onInput,event)
      //event.prevent();
      //event.stop();
      //event.stopAndPrevent();
      //this.event.preventDefault()
      //this.$event.preventDefault()
      //this.$event.stopPropagation()
      //event.stopAndPrevent(val)
      //}
    },
    /**
     * Obtient l'element composant du formulaire basé sur 'field_type' de l'obet field champ  ex: type text => TextElement
     */
    getElement(field) {
      if (field.field_type!='hidden') {
      const nameParts = field.field_type.split('_');
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] =
          nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1);
      }
      return nameParts.join('') + 'Element';
      } else {
        return null
      }
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

      //let dtform = Object.assign([],this.formData)
      if (this.formData.length > 0 && this.formData[0].data.length > 0) {
        this.fields = Object.assign([], this.formData[0].data);
        const fv = Object.assign([], this.formData);
        const ffields = Object.assign([], fv[0].data);

        if (this.fieldsmodel) {
          this.setForm(ffields, this.fieldsmodel);
        } else {
          this.setForm(ffields, (this.fieldsmodel)?this.fieldsmodel:{});
        }
      }
    },
  },
  async mounted() {
    if (this.fieldsmodel) {
          this.setForm(this.fields, this.fieldsmodel);
    } else {
          this.setForm(this.fields, (this.fieldsmodel)?this.fieldsmodel:{});
    }
    /*this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    //let formId = this.$route.params.id;
    await this.updateDisplayForm(this.idForm);



    this.$q.loading.hide();*/
  },
  watch: {
    fields: {
      handler(val) {
        console.log('FormData :', val);
      },
      deep: true,
    },
   /* hiddenFields: {
      handler(val) {
        console.log('Hidden fields :', val);
      },
      deep: true,
    },*/
  },
});
</script>
