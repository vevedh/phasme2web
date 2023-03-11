<template>
  <q-layout view="hHh LpR fFf">
    <!--hHh Lpr fff  lHr lpr lFf-->

    <q-drawer show-if-above v-model="left" side="left">
      <!-- drawer content -->
      <draggable
        :list="sourceFields"
        :clone="createField"
        v-bind="sourceOptions"
        :sort="false"
      >
        <div
          class="source-field q-gutter-sm row items-center justify-center no-wrap col-12"
          v-for="(sourceField, idx) in sourceFields"
          :key="idx"
        >
          <q-btn
            type="button"
            size="12px"
            dense
            stack
            outline
            color="primary"
            align="center"
            @click="onAddFieldClick(sourceField.type)"
            :icon="sourceField.icon"
            :label="sourceField.label"
            v-if="sourceField.type !== ''"
          />
        </div>
      </draggable>
      <q-separator class="q-my-md" />
      <div class="q-pa-none q-gutter-md">
        <div class="row items-center justify-center q-gutter-md q-px-none">
          <q-btn
            color="primary"
            icon="save"
            glossy
            text-color="white"
            dense
            no-caps
            label="Enregistrer"
            @click="saveForm()"
          >
            <q-tooltip
              content-class="bg-amber-5 text-dark"
              content-style="font-size: 1.2em"
            >
              <div class="text-justify-center text-bold text-size-16">
                Enregistrement du formulaire en cours <br />ou création d'un
                nouveau
              </div>
            </q-tooltip>
          </q-btn>

          <!--<q-btn
            color="primary"
            icon="list"
            glossy
            text-color="white"
            dense
            no-caps
            label="Formulaires"
            @click="onList()"
          >
          </q-btn>-->
        </div>
        <q-separator class="q-my-md" />

        <q-expansion-item
          dense
          class="text-center tex-bold bg-blue-3"
          label="Export/Import en JSON"
        >
          <q-card>
            <q-card-section>
              <div class="row items-center full-width">
                <div class="col-6">
                  <q-btn
                    dense
                    color="primary"
                    class="q-pa-xs no-wrap"
                    icon="save_alt"
                    no-caps
                    label="Export "
                    @click="exportToJSON()"
                  />
                </div>
                <div class="col-6">
                  <q-file
                    dense
                    v-model="jsonFile"
                    label="Import ..."
                    accept=".json, text/json"
                    outlined
                    class="q-pa-none no-wrap"
                    @input="importFromJSON()"
                  >
                    <template v-slot:prepend>
                      <q-icon dense name="file_upload" />
                    </template>
                  </q-file>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right">
      <!-- drawer content -->
      <div class="text-left text-bold bg-blue-4 q-px-md q-py-sm">
        PROPRIETE
      </div>
      <q-expansion-item
        dense
        expand-separator
        label="Géneral"
        class="text-left text-bold bg-red-3 q-pa-none"
      >
        <q-card class="my-card">
          <q-card-section class="q-pa-none">
            <div class="row items-center full-width q-pa-xs">
              <q-input
                dense
                square
                outlined
                v-model="dbname"
                label="Nom de la base"
                class="full-width"
              />
              <q-input
                dense
                square
                outlined
                v-model="tablename"
                label="Nom de la table"
                class="full-width"
              />
            </div>
            <div class="row items-center full-width q-pa-xs">
              <q-input
                dense
                square
                outlined
                v-model="formName"
                label="Nom du formulaire"
                class="full-width"
              />
              <div
                class="row items-center justify-center full-width q-px-md q-py-sm"
              >
                <div class="q-px-md">Accès</div>
                <q-toggle
                  dense
                  v-model="formT"
                  checked-icon="check"
                  color="green"
                  :label="formT"
                  false-value="publique"
                  true-value="privé"
                  unchecked-icon="clear"
                  class="q-pa-none"
                />
              </div>
            </div>
            <q-separator class="q-my-xs" v-if="formT == 'privé'" />
            <cacemusers-list :value.sync="accusers" v-if="formT == 'privé'" @update="accusers = $event;" />


          </q-card-section>
        </q-card>
      </q-expansion-item>
      <div class="text-left text-bold bg-blue-4 q-px-md q-py-sm" v-if="
          Object(currentField).hasOwnProperty('field_type') &&
          currentField.field_type != 'hidden'
        ">
         -- PARAMETRES COMPOSANT --
      </div>
      <!-- v-if="Object(currentField).hasOwnProperty('field_type') && (currentField.field_type!='hidden')"-->
      <editable-element-options
        v-if="
          Object(currentField).hasOwnProperty('field_type') &&
          currentField.field_type != 'hidden'
        "
        class="q-py-sm"
        v-model="currentField"
        :type-info="sourceFields"
        :fields-list="fields"
        :submitOptions="submitOptions"
      />
      <q-expansion-item
        dense
        expand-separator
        icon="visibility_off"
        label="Champs cachés"
        class="text-left tex-bold bg-blue-3"
      >
        <editable-hidden-element-options
          class="q-pa-sm"
          v-model="hiddenFields"
          :type-info="sourceFields"
          :fields-list="fields"
          :submitOptions="submitOptions"
        />

        <!--<q-card-section class="q-py-none bg-blue-1" v-for="(hField, indx) in hiddenFields"
          :key="`${indx}_hidden`">
          <div class="row  q-px-none q-py-none"  >
          <div class="col-12">
          <div class="row text-left q-pa-none">
            <q-chip square dense :icon="'hide_source'" >
              Caché
            </q-chip>
          </div>
          <q-input
            dense
            v-model="hField.label"
            placeholder="nom du champ"
            label="Nom du champ"

          />
          <q-input
            dense
            v-model="hField.id"
            placeholder="id du champ"
            label="ID du champ"

            label-color="negative"
          />
          </div>

          </div>
        </q-card-section>
         <q-card-actions class="q-pa-xs justify-center">
             <q-btn dense flat class="q-pa-none text-caption" color="primary" text-color="primary" label="Ajouter" icon="add" @click="addHiddenField()"/>
          </q-card-actions>-->
      </q-expansion-item>
    </q-drawer>

    <q-header unelevated class="bg-primary text-white">
      <!--style="width:100%;max-width:100%"-->
      <q-toolbar class="full-width">
        <!--style="width:100%;max-width:100%"-->
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/logo.png" class="bg-white" />
          </q-avatar>
          Créateur de formulaires ({{ nameForm }})
        </q-toolbar-title>
        <!--<q-btn flat :label="(idForm!='')?`[${nameForm}]:${idForm}`:null" :to="`/form/${idForm}`" />-->
        <q-btn
          flat
          round
          dense
          icon="home"
          class="q-mr-xs"
          @click="$emit('goBack')"
        />
        <q-btn
          flat
          round
          dense
          icon="preview"
          :color="(showpreview)?'red':null"
          class="q-mr-xs"
          @click="doShowPreview()"
        >
          <q-tooltip
            content-class="bg-amber text-dark"
            content-style="font-size: 1.2em"
          >
            Apercu de votre formulaire
          </q-tooltip>
        </q-btn>
        <!-- @click="doShowMail()"-->
        <q-btn
          flat
          round
          dense
          icon="email"
          class="q-mr-xs"
          :to="`/emailbuilder/${nameForm}`"
        >
          <q-tooltip
            content-class="bg-amber text-dark"
            content-style="font-size: 1.2em"
          >
            Notification builder
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-form-builder-page bg-white" v-show="!showpreview">
        <draggable
          v-model="fields"
          @change="onChange"
          :options="destinationOptions"
          :class="{
            'q-form-builder-elements-container': true,
            empty: fields.length == 0,
            row: true,
            'q-gutter-none': true,
          }"
          style="width: 100%; max-width: 100%"
        >
          <div
            :class="
              field.span
                ? `col-${field.span} editable-element-container`
                : `col-auto editable-element-container`
            "
            v-for="(field, idx) in fields"
            :key="idx"
          >
            <editable-element
              v-if="field.field_type != 'hidden'"
              v-model="fields[idx]"
              @click="selectForEdit"
              :class="{ selected: isSelectedForEdit(idx) }"
              :ref="fields[idx].cid"
            />
            <div class="editable-element-action-buttons">
              <q-btn
                class="editable-element-button"
                v-if="isSelectedForEdit(idx)"
                @click="deleteField(idx)"
                color="red"
                icon="delete"
                round
                size="xs"
              >
                <q-tooltip>Effacer ce champ</q-tooltip>
              </q-btn>
              <q-btn
                class="editable-element-button"
                v-if="isSelectedForEdit(idx)"
                @click="duplicateField(idx)"
                color="primary"
                icon="file_copy"
                round
                size="xs"
              >
                <q-tooltip>Dupliquer ce champ</q-tooltip>
              </q-btn>
            </div>
          </div>
        </draggable>
      </q-page>

      <q-page class="full-width bg-white" v-show="showpreview">
        <div class="q-gutter-sm row">
          <!--<div class="q-gutter-none row">-->
          <div
            :class="field.span ? `col-${field.span}` : `col-auto`"
            v-for="(field, index) in fields"
            :key="index"
          >
            <component
              v-if="field.field_type != 'hidden'"
              disabled="true"
              v-bind:is="getElement(field)"
              :show_options="field.field_show_options"
              :ofields="fields"
              :label="field.label"
              :labelToolTip="field.labelToolTip"
              :required="field.required"
              :field_options="field.field_options"
              :id="field.id"
              :name="field.id"
              :cid="field.cid"
              :ref="field.cid"
              :mask="field.mask"
              debounce="500"
            />
          </div>
          <!--</div>-->
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QPageContainer,
  QPage,
  QDrawer,
  QTab,
  QTabs,
  QTabPanel,
  QTabPanels,
  QTooltip,
  QBtn,
  QImg,
  uid,
  extend,
  exportFile,
} from 'quasar';

import draggable from 'vuedraggable';
import EditableElement from './editable/EditableElement';
import EditableElementOptions from './editable/EditableElementOptions';
import EditableHiddenElementOptions from './editable/EditableHiddenElementOptions';
import TextElement from './elements/TextElement';
import CacemusersElement from './elements/CacemusersElement';
import CommunesElement from './elements/CommunesElement';
import ParagraphElement from './elements/ParagraphElement';
import CheckboxesElement from './elements/CheckboxesElement';
import RadioElement from './elements/RadioElement';
import DateElement from './elements/DateElement';
import TimeElement from './elements/TimeElement';
import DropdownElement from './elements/DropdownElement';
import EmailElement from './elements/EmailElement';
import NameElement from './elements/NameElement';
import SimpleNameElement from './elements/SimpleNameElement';
import AddressElement from './elements/AddressElement';
import PhoneElement from './elements/PhoneElement';
import FileElement from './elements/FileElement';
import PaymentElement from './elements/PaymentElement';
import TermsElement from './elements/TermsElement';
import SectionBreakElement from './elements/SectionBreakElement';
import PageBreakElement from './elements/PageBreakElement';
import ImageElement from './elements/ImageElement';
import PassagersElement from './elements/PassagersElement';
import HiddenElement from './elements/HiddenElement';
import CacemusersList from './CacemusersList.vue';
import * as utils from './utils';

export default {
  name: 'VvFormBuilder',
  components: {
    CacemusersList,
    EditableElement,
    EditableElementOptions,
    EditableHiddenElementOptions,
    draggable,
    QLayout,
    QPageContainer,
    QPage,
    QDrawer,
    QTab,
    QTabs,
    QTabPanel,
    QTabPanels,
    QTooltip,
    QBtn,
    QImg,
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
    return {
      left: false,
      right: false,
      jsonFile: null,
      formT: this.formType,
      accusers: this.formAcc,
      //formName:'',
      fields: this.value,
      hiddenFields: this.value.filter((obj) => obj.type == 'hidden'),
      drawer: true,
      showpreview: false,
      tab: 'add',
      currentField: false,
      hovered: [],
    };
  },
  props: {
    navPosition: {
      type: String,
      default: 'left',
    },
    fieldIdName: {
      default: '_id',
    },
    value: {
      required: true,
      type: Array,
    },
    idForm: {
      required: false,
      type: String,
      default: '',
    },
    formName: {
      required: false,
      type: String,
      default: '',
    },
    formType: {
      required: true,
      type: String,
      default: 'privé',
    },
    formAcc: {
      required: false,
      type: Array
    },
    nameForm: {
      required: false,
      type: String,
      default: '',
    },
    dbname: {
      required: false,
      type: String,
      default: '',
    },
    tablename: {
      required: false,
      type: String,
      default: '',
    },
    submitOptions: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    sourceFields: {
      required: false,
      default: () => [
        { type: 'text', icon: 'text_format', label: 'Text' },
        { type: 'paragraph', icon: 'text_fields', label: 'Paragraphe' },
        { type: 'checkboxes', icon: 'check_box', label: 'Case à cocher' },
        { type: 'radio', icon: 'radio_button_checked', label: 'Choix multi' },
        { type: 'date', icon: 'event', label: 'Date' },
        { type: 'time', icon: 'access_time', label: 'Heure' },
        { type: 'dropdown', icon: 'arrow_drop_down', label: 'Liste Choix' },
        { type: 'email', icon: 'email', label: 'E-mail' },
        { type: 'image', icon: 'image', label: 'Image' },
        { type: 'cacemusers', icon: 'person', label: 'Util. CACEM' },
        { type: 'communes', icon: 'home', label: 'Communes' },
        { type: 'passagers', icon: 'people', label: 'Passagers' },
        { type: 'section_break', icon: 'view_agenda', label: 'Section' },
        { type: 'hidden', icon: 'visibility_off', label: 'Element Caché' },
        //{ type: 'simple_name', icon: 'person_outline', label: 'Simple Nom' },
        //{ type: 'address', icon: 'home', label: 'Addresse' },
        //{ type: 'phone', icon: 'phone', label: 'Téléphone' },
        { type: 'file', icon: 'cloud_upload', label: 'Téléchargement de fichier' },
        //{ type: 'payment', icon: 'payment', label: 'Paiement' },
        //{ type: 'terms', icon: 'ballot', label: 'Charte' },
        //{ type: '' },
        //{ type: '' },
        //{ type: '' },
        //{ type: 'section_break', icon: 'view_agenda', label: 'Section' },
        //{ type: 'page_break', icon: 'call_to_action', label: 'Retour chariot' }
      ],
    },
  },
  methods: {
    doShowPreview() {
      this.showpreview = !this.showpreview;
      if (this.showpreview == true) {
        this.drawer = false;
      } else {
        this.drawer = true;
      }
    },

    /**
     *  Enregistrement en base de donnée
     */
    saveForm() {
      let val = Object.assign([], this.fields);
      /*
       let nameForm = 'accueil'
       if ((this.nameForm != '') && (this.nameForm != 'accueil') && (this.nameForm != 'parking')) {
            nameForm = 'autre';
       }
       this.$q.dialog({
        title: 'Sauvegarde du formulaire',
        message: 'Vous souhaitez ce formulaire pour ',
        options: {
          type: 'radio',
          model: nameForm,
          // inline: true
          items: [
            { label: 'L\' Accueil', value: 'accueil', color: 'secondary' },
            //{ label: 'Le Parking', value: 'parking' },
            { label: 'Autre..', value: 'autre' }
          ]
        },

        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log('>>>> OK, received', data)
        if (data == 'autre') {
          let otherForm = 'Nom'
          if (this.nameForm != '') {
            otherForm = this.nameForm.toUpperCase();
          }
           this.$q.dialog({
              title: 'Nom du formulaire',
              message: 'Merci de donner un nom au formulaire ',
              prompt: {
                model: otherForm,
                isValid: val => val.length > 2 && val.length <30 && /^[A-Za-z0-9]+$/.test(val) == true && /accueil/.test(val.toLowerCase()) ==false && /parking/.test(val.toLowerCase()) ==false, // << here is the magic
                type: 'text'
              },
              cancel: true,
              persistent: true
           }).onOk(newdata => {
            this.$emit('save',{ formName: newdata.toUpperCase(), data: val})
           });
        } else {
          this.$emit('save',{ formName: data, data: val})
        }

      })*/
      this.$emit('save', val, this.formName, this.formType, this.accusers,this.dbname,this.tablename);
    },
    onList() {
      let val = Object.assign([], this.fields);
      this.$emit('onlist', val);
    },
    toggleLeftDrawer() {
      this.drawer = !this.drawer;
    },
    createField(item) {
      console.log('Field to create :', item);
      if (item.type == 'hidden') {
        return {
          label: utils.defaultLabel(item.type),
          field_type: item.type,
          cid: uid(),
          id: item.id,
          name: item.id,
          show_options: [],
          event_options: [],
        };
      } else if (['section_break'].includes(item.type)) {
        return {
          label: utils.defaultLabel(item.type),
          field_type: item.type,
          cid: uid(),
          name: item.type,
          show_options: [],
          event_options: [],
        };
      } else {
        return {
          label: utils.defaultLabel(item.type),
          field_type: item.type,
          required: true,
          cid: uid(),
          id: item.id,
          name: item.id,
          span: 12,
          mask:'',
          show_options: [],
          field_options: utils.defaultFieldOptions(item.type),
        };
      }
    },
    createHiddenField(item) {
      return {
        label: utils.defaultLabel(item.type),
        field_type: item.type,
        cid: uid(),
        id: item.id,
        name: item.id,
        event_options: [],
      };
    },
    deleteField(idx) {
      //let val = Object.assign([],this.fields)
      this.currentField = false;
      //this.tab = 'add'
      this.$delete(this.fields, idx);
    },
    duplicateField(idx) {
      //let val = Object.assign([],this.fields)

      const newField = extend(true, {}, this.fields[idx]);
      newField.cid = uid();
      // newField[this.fieldIdName] = null
      delete newField[this.fieldIdName];
      this.fields.push(newField);
      this.selectForEdit(newField);
    },
    onChange(evt) {
      if (evt.added) {
        this.selectForEdit(evt.added.element);
      }
    },
    onAddFieldClick(type) {
      if (type == 'hidden') {
        const fieldHidden = this.createHiddenField({ type });

        this.fields.push(fieldHidden);
        //this.selectForEdit(fieldHidden)
      } else {
        const field = this.createField({ type });
        this.fields.push(field);
        this.selectForEdit(field);
      }
    },
    selectForEdit(field) {
      /*if (this.drawer == false) {
        this.drawer = true
      }*/
      this.currentField = field;
      //this.tab = 'edit'
    },
    isSelectedForEdit(idx) {
      //let val = Object.assign([],this.fields)
      return this.currentField.cid === this.fields[idx].cid;
    },
    getFieldByCid(cid) {
      //let val = Object.assign([],this.fields)
      for (const field of this.fields) {
        if (field.cid === cid) return field;
      }
      return false;
    },
    /**
     * Obtient l'element composant du formulaire basé sur 'field_type' de l'obet field champ  ex: type text => TextElement
     */
    getElement(field) {
      //if (field.field_type!='hidden') {
      const nameParts = field.field_type.split('_');
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] =
          nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1);
      }
      return nameParts.join('') + 'Element';
      /*} else {
        return null
      }*/
    },
    /**
     *   Export du formulaire en format JSON
     */
    exportToJSON() {
      const status = exportFile(
        'form.json',
        JSON.stringify(this.fields),
        'text/json'
      );

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        });
      }
    },
    importFromJSON() {
      console.log('Fichier sélectionné :', this.jsonFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Contenu :', e.target.result);
        let newFormContent = JSON.parse(e.target.result);
        this.fields = Object.assign([], newFormContent);
      };
      reader.readAsText(this.jsonFile);
    },
  },
  computed: {
    /*fields() {
    let res = Object.assign([],this.value)
    return res
    },*/

    sourceOptions: () => {
      return {
        group: {
          name: 'q-form-builder',
          pull: 'clone',
          put: false,
        },
      };
    },
    destinationOptions: () => {
      return {
        group: {
          name: 'q-form-builder',
          pull: false,
          put: true,
        },
      };
    },
  },
  beforeMount() {
    // make sure fields is an array in the model
    this.formT = this.formType;
    if (!this.fields || !(this.fields instanceof Array)) {
      this.fields = [];
    }

  },
  watch: {
    fields(val) {
      //const newval = Object.assign([],val)
      console.log('Form :', val);
      this.hiddenFields = Object.assign(
        [],
        val.filter((obj) => obj.field_type == 'hidden')
      );
      this.$emit('input', val);
    },
    hiddenFields(val) {
      //const newval = Object.assign([],val)
      console.log('Form hidden change :', val);
      //this.hiddenFields = Object.assign([],val.filter(obj => obj.field_type=='hidden'));
      //this.$emit('input', val)
    },
    value(val) {
      this.fields = val; // Object.assign([],val)
      if (val) {
        this.hiddenFields = Object.assign(
        [],
        val.filter((obj) => obj.field_type == 'hidden')
      );
      }
      
      if (this.currentField)
        this.selectForEdit(this.getFieldByCid(this.currentField.cid));
    },
    formAcc(val) {
      this.accusers = Object.assign([],val)
    }
  },
  errorCaptured(err, vm, info) {
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.
    // TODO: Perform any custom logic or log to server
    // return false to stop the propagation of errors further to parent or global error handler
    console.log('Error :', error);
    console.log('Vm component :', vm);
    console.log('Info :', info);
  },
};
</script>

<style lang="scss">
.q-form-section-break-title {
  position: relative;
  bottom: -12px;
  left: -15px;
}
.q-field--filled .q-field__control {
  padding: 0 12px;
  background: #d7ecf7;
  border-radius: 4px 4px 0 0;
}
.source-field {
  width: 129px;
  display: inline-block;
  margin: 0px 2px 5px 2px;
}
.source-field .q-btn {
  width: 100%;
}
.q-page {
  padding: 20px;
}
.q-form-builder-elements-container {
  width: 100%;
  min-height: 100px;
}
.q-form-builder-elements-container.empty {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='200px' width='500px'><text x='0' y='15' fill='lightgray' font-size='14' font-family='Roboto, Helvetica, sans-serif'>Déplacer un composant ici pour commencer.</text></svg>");
  background-repeat: no-repeat;
  background-position: 0 40px;
}
.q-editable-element.selected {
  background-color: $blue-1;
  border-color: $blue-6;
  border-style: dashed;
  border-width: 0.1em;
}
.editable-element-container {
  position: relative;

}
.editable-element-action-buttons {
  position: absolute;
  bottom: -11px;
  right: 0;
  z-index: 2;
}
.editable-element-button {
  float: right;
  margin-right: 5px;

}
.q-field__bottom {
  font-size: 12px;
  min-height: 20px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.54);
  padding: 1px 10px 0;
}
</style>
