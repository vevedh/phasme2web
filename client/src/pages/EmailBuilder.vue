<template>
  <div class="container full-height">
    <q-toolbar class="bg-primary text-white q-pa-sm q-gutter-md full-width">
      <q-btn flat round dense icon="assignment_ind" />

      <q-toolbar-title> Email modèle création... </q-toolbar-title>
      <q-btn
        color="white"
        no-caps
        outline
        label="definir par défaut"
        :icon="isDefault ? 'done' : ''"
        @click="lierAuFormulaire"
      />

      <q-select
        dense
        outlined
        v-model="currentuid"
        class="bg-white rounded-borders"
        :options="listTemplates"
        :option-value="(item) => (item === null ? null : item.id)"
        :option-label="(item) => (item === null ? 'Null value' : item.id)"
        @input="templateChange"
      />
      <q-input
        dense
        v-model="email"
        label="Email test :"
        class="bg-white text-dark outlined rounded-borders q-pa-xs"
        style="width: 100%; max-width: 300px"
      />
      <q-btn flat round dense icon="home" class="q-mr-xs" to="/" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <div
      id="gjs"
      style="max-height: 100%; height: 0; width: 100%; overflow: hidden"
    >
      <!--calc(100vh - 56px)-->
    </div>
  </div>
</template>

<script>
//import { mjml2html } from 'mjml';
import mjml2html from 'mjml-browser';

import { uid, QSpinnerGears } from 'quasar';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import fr from 'grapesjs/locale/fr';

import grapesJSMJML from 'vv-grapesjs-mjml'; //grapesJSMJML
import mjmlFR from 'vv-grapesjs-mjml/locale/fr';

import { mapActions, mapState } from 'vuex';

import feathersClient from '../boot/feathers-client';
export default {
  name: 'EmailBuilder',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      formID: null,
      editor: null,
      newuid: null,
      currentuid: null,
      defaultId: null,
      listTemplates: [],
      email: 'herve.dechavigny@cacem.fr',
    };
  },
  computed: {
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      ftemplates: (state) => state.ftemplates,
      template: (state) => state.template,
    }),
    getId() {
      if (!this.currentuid) return;
      return this.currentuid.id;
    },
    isDefault() {
      if (!this.defaultId) {
        return false;
      } else {
        return true;
      }
    },
    formFields() {
      if (!this.formData[0].data) return;
      return this.formData[0].data
        .filter((elt) => Object(elt).hasOwnProperty('id'))
        .map((o) => `${o.id}`);
    },
  },
  methods: {
    ...mapActions('admin', [
      'sendMail',
      'getForm',
      'updateForm',
      'updateDatasForm',
      'getTemplatesById',
      'createTemplate',
      'updateTemplate',
    ]),

    change() {
      this.$emit('change', this.editor.getHtml());
    },
    templateChange(value) {
      console.log('Changement de template :', value);
    },
    async lierAuFormulaire() {
      console.log('Id :', this.currentuid);
      if (this.currentuid && this.currentuid.id) {
        this.defaultId = this.currentuid.id;
        await this.updateForm( 
          Object.assign({}, this.formData[0], {
            templateid: this.currentuid.id,
          })
        );
        console.log('Formulaire :', Object.assign({}, this.formData[0], {
            templateid: this.currentuid.id,
          }));//this.formData[0]);
        if (
          this.ftemplates &&
          Array.isArray(this.ftemplates) &&
          (this.ftemplates.find(
            (o) => o._id == this.formData[0].templateid
          ) != -1)
        ) {
          this.defaultId = this.formData[0].templateid;
        }
      }
    },
  },
  async beforeMount() {
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    console.log('Form ID :', this.$route.params.id);
    this.formID = this.$route.params.id;
    if (this.formID != '') {
      await this.getForm(this.formID);
      await this.getTemplatesById(this.formID);
      console.log('Templates :',this.ftemplates)
      console.log('form templateid :',this.formData[0].templateid)
      console.log('Found :',(this.ftemplates.find((o) => o._id == this.formData[0].templateid) != -1))
      if (
        this.ftemplates &&
        Array.isArray(this.ftemplates) &&
        (this.ftemplates.find((o) => o._id == this.formData[0].templateid))
      ) {
        this.defaultId = this.formData[0].templateid;
      }
      console.log('Template par defaut :', this.defaultId);
      if (this.ftemplates.length == 0) {
        //this.newuid = uid();
        let objF = {
          errors: [],
          fields: [],
          html: null,
          json: null,
          uid: this.formID,
        };
        await this.createTemplate(objF);
        this.listTemplates.push({ id: this.template._id });
        this.currentuid = Object.assign({}, { id: this.template._id });
      } else {
        this.listTemplates = Object.assign(
          [],
          this.ftemplates.map((o) => ({ id: o._id }))
        );
        console.log('Liste des templates :', this.listTemplates);
        this.currentuid = Object.assign({}, this.listTemplates[0]);
      }
    }
    this.$q.loading.hide();
  },
  mounted() {
    const myPlugin = (editor) => {
      this.formFields.forEach((elt) => {
        editor.BlockManager.add(`${elt}`, {
          label: `${elt}`,
          content: `<mj-text>{{${elt}}}</mj-text>`,
          attributes: { class: 'gjs-fonts gjs-f-text' },
        });
      });
    };
    this.editor = grapesjs.init({
      fromElement: true,
      container: '#gjs',
      height: this.$q.screen.height-50,
      components: `<mjml>
       <mj-body></mj-body>
     </mjml>`,
      avoidInlineStyle: true,

      i18n: {
        //locale: 'fr', // default locale
        //detectLocale: true, // by default, the editor will detect the language
        localeFallback: 'fr', // default fallback
        messages: { fr: fr },
      },
      plugins: [grapesJSMJML, myPlugin],
      pluginsOpts: {
        [grapesJSMJML]: {
          storageManager: {
            id: 'gjs-', // Prefix identifier that will be used on parameters
            type: 'local', // Type of the storage
            autosave: true, // Store data automatically
            autoload: true, // Autoload stored data on init
            stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
          },
          preMJML: '',
          postMJML: '',
          overwriteExport: true,
          resetBlocks: false,
          resetStyleManager: false,
          i18n: { fr: mjmlFR },
        },
      },
    });

    console.log('editor components :', this.editor.getComponents());
    /*this.editor.addComponents(`<mjml>
       <mj-body></mj-body>
     </mjml>`);*/
     console.log('Templates  :', this.ftemplates);
    if (this.ftemplates.length > 0 && Object(this.ftemplates[0]).hasOwnProperty('mjml')) {
      console.log('Templates :',this.ftemplates)
      console.log('Components :',this.editor)
     
      this.editor.setComponents(this.ftemplates[0].mjml);
      
      this.editor.refresh();
    } /*else {
      this.editor.addComponents(`<mjml>
       <mj-body></mj-body>
     </mjml>`);
    }*/

    console.log('Editor codemanager :', this.editor.CodeManager);
    console.log('Editor html :', this.editor.html);
    
    //this.editor.html = this.template.

    // ---- Send Mail Button
    this.editor.Panels.addButton('options', {
      id: 'send-mail',
      className: 'fa fa-paper-plane',
      command: (editor, sender) => {
        console.log('Editor :', editor.getHtml());

        console.log('Sender :', sender);
        var htmlWithCss = this.editor.runCommand('mjml-get-code').html;
        console.log('Editor HTML :', htmlWithCss);

        this.sendMail({
          to: `${this.email}`,
          subject: 'test',
          message: `${htmlWithCss}`,
        })
          .then(() => {
            this.$q.dialog({
              message: 'Message envoyé!',
            });
          })
          .catch(() => {
            this.$q.dialog({
              message: '!! Message non envoyé!',
            });
          });
        sender && sender.set('active'); // turn off the button
        editor.store();
      },
      attributes: {
        title: 'Envoyé un mail de Test',
      },
    });

    this.editor.on('run:export-template:before', (sender) => {
      console.log('Sender ...',sender)
      console.log('Convert ...',this.editor.store())
      console.log('Convert ...',this.editor.storeData())
      this.editor.store().html.replace('<body>', '').replace('</body>', '');
      this.editor.storeData().html.replace('<body>', '').replace('</body>', '');
      /*console.log(
        'Object code html:',
        this.editor.runCommand('mjml-get-code').html
      );*/
    });
    // save additional data to grapesjs storage
    this.editor.on('storage:start:store', async (objectToStore) => {
      console.log('Plugins :', objectToStore);

      // check if we use mjml plugin
      if (this.editor && this.editor.getConfig().plugins.length == 2) {
        // save converted html from mjml
        //this.editor.html = this.editor.getHtml().replace('body','html')
        console.log('MJML :',this.editor.runCommand('mjml-get-code').html)
        //console.log('HTML :',this.editor.html())
        // see LocalStorage on what is saved.
        console.log(
          'Sauvegarde code html :',
          this.editor.getHtml()
        );
        
        //const lfields = Object.assign([],this.formFields)
        console.log('Objet à sauvegarder :', {
          ...this.editor.runCommand('mjml-get-code'),
          mjml:this.editor.getHtml(),
          uid: this.formID,
          fields: this.formFields,
          _id: this.currentuid.id,
        });
        await this.updateTemplate({
          ...this.editor.runCommand('mjml-get-code'),
          mjml:this.editor.getHtml(),
          uid: this.formID,
          fields: this.formFields,
          _id: this.currentuid.id,
        });
      }
    });
  },
};
</script>

<style>
.gjs-one-bg {
  background-color: #024b94;
}
.gjs-pn-panels {
  background-color: #034872 !important;
}
</style>