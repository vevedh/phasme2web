<template>
    <q-page class="flex flex-center">
        <div id="particles-js" :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"></div>
        <!--<div class="absolute-top-right q-gutter-sm row q-pt-md">
                    <q-btn color="white" text-color="black" icon="home" flat @click="showBuilder=false" />



                </div>-->
        <q-form-builder v-if="showBuilder" :value="fields" @save="onSave" @goBack="gotoAccueil()" @onlist="showListForms" :nameForm="currentFormName" />
        <q-card v-if="!showBuilder" :style="($q.platform.is.mobile || $q.screen.sm || $q.screen.xs) ? { width: '95%' } : { width: '75%' }">
            <!--style="max-width:800px"-->
            <q-toolbar v-if="isSiteAdmin" class="text-primary">
                <q-btn flat round dense icon="menu" @click="showAdminMenu=!showAdminMenu" />
                <q-toolbar-title>
                    Paramètres Administrateur
                </q-toolbar-title>
                <q-btn flat round dense icon="settings" @click="showSettings">
                  <q-tooltip content-class="bg-amber text-center text-h6 text-dark" >
                  Réglages divers...
                  </q-tooltip>

                </q-btn>
                <q-btn icon="edit" flat @click="showBuilder=true" >
                <q-tooltip content-class="bg-amber text-center text-h6 text-dark" >
                  Modification du formulaire...
                  </q-tooltip>
                </q-btn>
            </q-toolbar>
            <q-card-section dense class="row no-wrap justify-center items-center q-py-md  bg-primary text-white">
                <div class="text-h6 full-width">{{currentTitle}}</div>

                <q-btn icon="menu" flat round dense  @click="showUserMenu=!showUserMenu" >
                <q-tooltip content-class="bg-amber text-center text-h6 text-dark" >
                  Affiche le menu principal
                  </q-tooltip>
                </q-btn>
            </q-card-section>

            <q-card-section class="q-gutter-md row">
                <q-form ref="myForm" @submit="onSubmit" :style="$q.platform.is.mobile ? { width: '95%' } : { width: '100%' }">
                    <div class="q-gutter-none row">
                        <div :class="field.span ? `col-${field.span}` : `col-auto`" v-for="(field, index) in fields" :key="index">
                            <component v-model="fieldData[field.id]" @input="onInput" v-bind:is="getElement(field)" :label="field.label" :labelToolTip="field.labelToolTip" :required="field.required" :field_options="field.field_options" :id="field.id" :cid="field.cid" :ref="field.cid"
                                debounce="500" />
                        </div>
                    </div>
                </q-form>
            </q-card-section>

            <q-card-actions align="center">
             <q-btn color="negative" no-caps icon="list" label="Liste des données" :to="{ path:'donnees', query:{ type: currentFormName } }" >
             <q-tooltip content-class="bg-amber text-center text-h6 text-dark" >
                  Liste des données du formulaire...
                  </q-tooltip>
             </q-btn>
             <q-space />
             <q-btn class="q-pa-sm" icon="save" color="primary" no-caps label="Ajouter" @click="$refs.myForm.submit()" >
             <q-tooltip content-class="bg-amber text-center text-h6 text-dark" >
                  Ajoute une donnée
                  </q-tooltip>
             </q-btn>
            </q-card-actions>
            <q-card-actions align="right">


            </q-card-actions>
        </q-card>
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
                                <q-item-label caption>
                                    Retour à l'accueil
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="showUserMenu" :position="'left'" full-height ><!-- v-if="!isSiteAdmin" -->
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
                                <q-item-label caption>
                                    Retour à l'accueil
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable :to="{ path:'nouveau', query:{ type:'parking' } }">
                            <q-item-section avatar>
                                <q-icon name="directions_car_filled" />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Packing</q-item-label>
                                <q-item-label caption>
                                    Formulaire packing
                                </q-item-label>
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
import { colors, QSpinnerGears } from 'quasar'
const { lighten, setBrand } = colors
import { date } from 'quasar';
import { QFormBuilder, TextElement, CacemusersElement, ParagraphElement, ImageElement, CheckboxesElement, RadioElement, DateElement, TimeElement, DropdownElement, EmailElement, NameElement, SimpleNameElement, AddressElement, PhoneElement, FileElement, PaymentElement, TermsElement, PageBreakElement, SectionBreakElement } from 'components/form/index'
import FVvTable from 'components/FVvTable.vue';
import DiagVvTable from 'components/DiagVvTable.vue';
import DiagSettings from 'components/Settings.vue'

export default defineComponent({
    name: 'PageNouveau',
    components: {
        QFormBuilder,
        TextElement,
        CacemusersElement,
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
        SectionBreakElement
    },
    data() {
        const myLocale = {
            /* starting with Sunday */
            days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
            daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
            months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
                '_'
            ),
            monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split('_'),
            firstDayOfWeek: 0
        };


        return {
            tab: 'nouveau',
            showBuilder: false,
            fields: [],
            fieldData: [],
            fieldsModel: {},
            showPopUp: false,
            showTimePopUp: false,
            FormValid: true,
            showAdminMenu: false,
            showUserMenu: false,
            showParticules: true,
            currentTitle: '',
            selectedDate: date.formatDate(Date.now(), 'DD/MM/YYYY'),
            selectedTime: date.formatDate(Date.now(), 'HH:mm'),

            sfVisiteurs: {
                arriveed: date.formatDate(Date.now(), 'DD/MM/YYYY'),
                arriveeh: date.formatDate(Date.now(), 'HH:mm'),
                sortieh: date.formatDate(Date.now(), 'HH:mm')
            }
        };
    },
    computed: {
        ...mapState('adinfos', {
            isAdmin: state => state.isAdmin,
            isSiteAdmin: state => state.isSiteAdmin
        }),
        ...mapState('admin', {
            formData: state => state.getform,
            fconfig: state => state.config
        }),

        ffields() {
            return Object.assign([], this.fields)
        }
    },
    methods: {
        ...mapActions('admin', ['getAllVisiteurs', 'addVisiteur', 'getForm', 'saveForm', 'getConfig', 'writeConfig']),
        async gotoAccueil() {
            this.currentFormName = 'accueil'
            await this.updateDisplayForm('accueil')
            this.showBuilder = false
        },
        onSubmit(evt) {
            console.log("Form submit :", this.$refs.myForm)
            this.$refs.myForm.validate().then(async (valid) => {
                console.log('Valid :', valid)
                console.log('Form :', this.fieldData)
                await this.addVisiteur(this.fieldData)
                this.$q.notify({
                    message: 'Visiteur ajouté avec succès',
                    color: 'positive'
                })
                console.log('Valeur des champs :', this.fieldData)

                for (const [key, value] of Object.entries(this.fieldData)) {
                    this.fieldData[key] = '';
                }
                this.$refs.myForm.reset()

            }).catch((err) => {
                this.$q.notify({
                    message: 'Formulaire incomplet !!!',
                    color: 'negative'
                })
            })



        },
        selVisiteur(evt, row, index) {
            console.log('Selection du visiteur :', row);
        },
        async onSave(value) {
            console.log('onSave :', value);
            await this.saveForm({ nom: value.formName, data: value.data })
            await this.updateDisplayForm(this.currentFormName)
            //await this.getForm({ nom: this.currentFormName })
            //console.log('Donnée du formulaire visiteurs :', this.formData);
            //let dtform = Object.assign([],this.formData)
            if (this.formData.length > 0 && this.formData[0].data.length > 0) {
                const fv = Object.assign([], this.formData)
                const ffields = Object.assign([], fv[0].data)
                this.setForm(ffields, {})
            }
            this.$q.notify({
                message: 'Visiteur ajouté avec succès',
                color: 'positive'
            })
            console.log('Donnees form :', this.fieldData)
        },
        saveDate() {
            console.log('Selected Date :', this.selectedDate);
            console.log('My form :', this.$refs.myForm);
            this.$refs.myForm.fieldInput({
                id: 'arriveed',
                value: date.formatDate(this.selectedDate, 'DD/MM/YYYY')
            });
            //this.sfVisiteurs.arrdate = this.selectedDate;
        },
        saveTime() {
            console.log('Selected Time :', this.selectedDate);
            console.log('My form :', this.$refs.myForm);
            this.$refs.myForm.fieldInput({
                id: 'arriveeh',
                value: date.formatDate(this.selectedTime, 'HH:mm')
            });
            //this.sfVisiteurs.arrdate = this.selectedDate;
        },
        showListForms(evt) {
            this.$q.dialog({
                component: DiagVvTable,
                dbname: 'formulaires',
                dbtype: 'db_regvisiteurs',
                twidth: '70%'

            }).onOk(async (evt) => {
                console.log('OK', evt)
                this.currentFormName = evt.nom


                await this.updateDisplayForm(this.currentFormName)

            }).onCancel(() => {
                console.log('Cancel')
            }).onDismiss(() => {
                console.log('Called on OK or Cancel')
            })
        },
        showSettings(evt) {
            this.$q.dialog({
                component: DiagSettings,
                config: this.fconfig,
                twidth: '70%'

            }).onOk(async (conf) => {
                console.log('OK settings', conf)
                await this.writeConfig(conf)
                if (Object(conf).hasOwnProperty('bgright')) {
                    colors.setBrand('bgright', conf.bgright)
                }


            }).onCancel(() => {
                console.log('Cancel')
            }).onDismiss(() => {
                console.log('Called on OK or Cancel')
            })
        },
        async setForm(fvalues, fmodel) {


            let arrKeys = Object.keys(fmodel);
            let arrVal = Object.entries(fmodel);
            this.fieldData = arrKeys.reduce((column, key) => (column[key] = fmodel[key], column), {});

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
            console.log(`${id}: ` + JSON.stringify(val))
            console.log('Field Datas :', this.fieldData)
            //}

        },
        /**
         * Obtient l'element composant du formulaire basé sur 'field_type' de l'obet field champ  ex: type text => TextElement
         */
        getElement(field) {
            const nameParts = field.field_type.split('_')
            for (let i = 0; i < nameParts.length; i++) {
                nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
            }
            return nameParts.join('') + 'Element'
        },
        /**
         *
         */
        async updateDisplayForm(fname) {
            await this.getForm({ nom: fname })
            console.log('Donnée du formulaire chargée :', this.formData);
            if (fname == 'accueil') {
                this.currentTitle = 'ACCUEIL: Saisie d\'un nouveau visiteur '
            }
            if (fname == 'parking') {
                this.currentTitle = 'PARKING : Saisie d\'un nouveau visiteur '
            }
            if (Object(this.formData[0]).hasOwnProperty('titre')) {
                this.currentTitle = this.formData[0].titre
            }
            //let dtform = Object.assign([],this.formData)
            if (this.formData.length > 0 && this.formData[0].data.length > 0) {
                const fv = Object.assign([], this.formData)
                const ffields = Object.assign([], fv[0].data)
                this.setForm(ffields, {
                    datearr: date.formatDate(Date.now(), 'DD/MM/YYYY')
                })
            }
        }
    },
    async beforeRouteUpdate(to,from,next) {
      console.log("Form change :",to.query.type)
        this.currentFormName = to.query.type
        console.log("Current form :",this.currentFormName)
        if (this.currentFormName == 'accueil') {
            this.currentTitle = 'ACCUEIL: Saisie d\'un nouveau visiteur '
        }
        if (this.currentFormName == 'parking') {
            this.currentTitle = 'PARKING : Saisie d\'un nouveau visiteur '
        }
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...'
        })
        await this.getForm({ nom: this.currentFormName })
        this.$q.loading.hide()
        console.log('Donnée du formulaire  :', this.formData);

        if (Object(this.formData[0]).hasOwnProperty('titre')) {
            this.currentTitle = this.formData[0].titre
        }
        //let dtform = Object.assign([],this.formData)
        if (this.formData.length > 0 && this.formData[0].data.length > 0) {
            const fv = Object.assign([], this.formData)
            const ffields = Object.assign([], fv[0].data)
            this.setForm(ffields, {})
        } else {
            this.setForm(
                [{
                        id: 'datearr',
                        field_type: 'date',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Date ',
                        required: true
                    },
                    {
                        id: 'heurearr',
                        field_type: 'time',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Heure d\'arrivée ',
                        required: true
                    },
                    {
                        id: 'visiteur',
                        field_type: 'name',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Visiteur ',
                        required: true
                    },
                    {
                        id: 'status',
                        field_type: 'text',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Status ',
                        required: false
                    },
                    {
                        id: 'motif',
                        field_type: 'dropdown',
                        field_options: {
                            description: '',
                            options: [
                                { checked: false, label: 'simple visite' },
                                { checked: false, label: 'Rdv prestataire' },
                                { checked: false, label: 'Rdv bureau' }
                            ],
                            filled: true
                        },
                        span: 12,
                        label: 'Motif de la visite ',
                        required: false
                    }
                ], {
                    datearr: date.formatDate(Date.now(), 'DD/MM/YYYY')
                }
            );
        }
      next()
    },
    async beforeMount() {
        //setBrand('bgright', '#fff')
        //setBrand('bgright', '#10cb23')
        await this.getConfig()
        if (Object(this.fconfig).hasOwnProperty('bgright')) {
            colors.setBrand('bgright', this.fconfig.bgright)
        }
        console.log('Meta infos :', this.$route.query.type)
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...'
        })
        await this.getAllVisiteurs();
        this.$q.loading.hide()


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
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#ffffff'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        },
                        polygon: {
                            nb_sides: 5
                        },
                        image: {
                            src: 'img/github.svg',
                            width: 100,
                            height: 100
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 20,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
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
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: false,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: false,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: false
            });
        }

        //let dtform = Object.assign([],this.formData)
        this.currentFormName = this.$route.query.type
        console.log("Current form :",this.currentFormName)
        if (this.currentFormName == 'accueil') {
            this.currentTitle = 'ACCUEIL: Saisie d\'un nouveau visiteur '
        }
        if (this.currentFormName == 'parking') {
            this.currentTitle = 'PARKING : Saisie d\'un nouveau visiteur '
        }
         this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...'
        })
        await this.getForm({ nom: this.currentFormName })
        console.log('Donnée du formulaire  :', this.formData);

        if (Object(this.formData[0]).hasOwnProperty('titre')) {
            this.currentTitle = this.formData[0].titre
        }
        //let dtform = Object.assign([],this.formData)
        if (this.formData.length > 0 && this.formData[0].data.length > 0) {
            const fv = Object.assign([], this.formData)
            const ffields = Object.assign([], fv[0].data)
            this.setForm(ffields, {})
        } else {
            this.setForm(
                [{
                        id: 'datearr',
                        field_type: 'date',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Date ',
                        required: true
                    },
                    {
                        id: 'heurearr',
                        field_type: 'time',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Heure d\'arrivée ',
                        required: true
                    },
                    {
                        id: 'visiteur',
                        field_type: 'name',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Visiteur ',
                        required: true
                    },
                    {
                        id: 'status',
                        field_type: 'text',
                        field_options: {
                            description: '',
                            filled: true
                        },
                        span: 12,
                        label: 'Status ',
                        required: false
                    },
                    {
                        id: 'motif',
                        field_type: 'dropdown',
                        field_options: {
                            description: '',
                            options: [
                                { checked: false, label: 'simple visite' },
                                { checked: false, label: 'Rdv prestataire' },
                                { checked: false, label: 'Rdv bureau' }
                            ],
                            filled: true
                        },
                        span: 12,
                        label: 'Motif de la visite ',
                        required: false
                    }
                ], {
                    datearr: date.formatDate(Date.now(), 'DD/MM/YYYY')
                }
            );
        }
 this.$q.loading.hide()
        /**/
    },
    watch: {
        'fields': {
            handler(val) {
                console.log('FormData :', val)
            },
            deep: true
        }
    }
});
</script>


