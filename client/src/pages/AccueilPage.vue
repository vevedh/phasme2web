<template>
  <q-page class="container q-pa-none vertical-top">
    <!--class="flex flex-center"-->
    <!--<div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>-->
    <!-- content -->
    <div class="column full-width items-end q-px-sm">
      <div class="row items-center q-px-sm text-center text-h5 bg-white rounded-borders">
        <span class="text-center">
          <q-icon
            name="time"
            size="10px"
            color="secondary"
          ></q-icon>
          Compteurs des visites pour le {{datedujour}}
        </span>

      </div>

    </div>
    <q-separator
      color="teal"
      size="2px"
    />

    <div class="row q-py-sm q-pb-md q-gutter-lg">
      <div class="col-12 col-md q-pa-none">


            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item style="background-color: #4fbb91" class="q-pa-xs q-ml-xs rounded-borders">
                <q-item-section side style="background-color: #419e7a" class="q-pa-lg q-mr-none text-white">
                  <q-icon name="support_agent" color="white" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{totalRdcVisiteurs}}</q-item-label>
                  <q-item-label class="text-white text-h7 text-bold">Total Visiteurs Accueil</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!--<q-card class="my-card text-white bg-transparent q-pa-none">
          <q-card-section class="q-pa-none">
              <div class="text-center text-bold bg-blue-9">Total Visiteurs Accueil</div>
            <q-avatar
              size="100px"
              font-size="52px"
              text-color="white"
              icon="support_agent"
            >

            </q-avatar>

            <q-knob
              readonly
              v-model="totalRdcVisiteurs"
              show-value
              size="90px"
              :thickness="0.22"
              color="white"
              track-color="white-3"
              class="text-white q-ma-md"
            /></q-card-section>
        </q-card>
            -->


      </div>
      <div class="col-12 col-md q-pa-none">

            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item  class="q-pa-xs q-ml-xs bg-blue-7 rounded-borders">
                <q-item-section side  class="q-pa-lg q-mr-none text-white bg-blue-8">
                  <q-icon name="directions_car_filled" color="white" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{totalParkingVisiteurs}}</q-item-label>
                  <q-item-label class="text-white text-h7 text-bold">Total Visiteurs Parking</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <!--
              <q-card class="my-card text-white bg-transparent">
          <q-card-section>
              <div class="text-center text-bold bg-blue-9">Total Visiteurs Parking</div>
            <q-avatar
              size="100px"
              font-size="52px"
              text-color="white"
              icon="directions_car_filled"
            >

            </q-avatar>
            <q-knob
              readonly
              v-model="totalParkingVisiteurs"
              show-value
              size="90px"
              :thickness="0.22"
              color="secondary"
              track-color="secondary-3"
              class="text-secondary q-ma-md"
            /></q-card-section>
        </q-card>
            -->

      </div>
      <div class="col-12 col-md q-pa-none">

            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item  class="q-pa-xs q-ml-xs bg-teal-7 rounded-borders">
                <q-item-section side  class="q-pa-lg q-mr-none text-white bg-teal-8">
                  <q-icon name="people" color="white" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{totalVisiteurs}}</q-item-label>
                  <q-item-label class="text-white text-h7 text-bold">Visiteurs à la CACEM le {{datedujour}}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <!--
              <q-card class="my-card text-white bg-transparent q-pa-none">
          <q-card-section>
              <div class="text-center text-bold bg-blue-9"> Visiteurs à la CACEM le {{datedujour}}</div>
            <q-avatar
              size="100px"
              font-size="52px"
              text-color="white"
              icon="people"
            ></q-avatar>
            <q-knob
              readonly
              v-model="totalVisiteurs"
              show-value
              size="90px"
              :thickness="0.22"
              color="yellow"
              track-color="yellow-5"
              class="text-yellow q-ma-md"
            />
            <q-tooltip content-class="bg-amber-4 text-dark text-bold text-h6 text-center">
              Le nombre de visiteurs à la CACEM le {{datedujour}}
            </q-tooltip>
            </q-card-section>
        </q-card>
            -->

      </div>
    </div>

    <q-separator
      color="teal"
      size="2px"

    />

    <div class="col-12 col-md q-px-none q-pt-md">
      <f-acceuil-grid
        :ref="'myTable'"
        :titre="'Registre Visiteur '"
        :dbname="'dbf_accueil'"
        :dbtype="'db_regvisiteurs'"
        :selectable="isSiteAdmin||isAdmin"
        :editable="isSiteAdmin||isAdmin"
        :useAdmin="isAdmin"
        :columns_filter="true"
        :showAdd="true"
        @row-click="onRowClick"
        :style="
              $q.platform.is.mobile ? { width: '100%' } : { width: '100%' }
            "
      ></f-acceuil-grid>


    </div>

    <q-dialog v-model="showMailMessage">
      <q-card
        class="email-card"
        bordered
      >
        <q-toolbar class="full-width bg-primary">
          <div class="q-pt-xs">
            <img src="~assets/cacemx200.png">
          </div>

          <q-toolbar-title class="text-center text-white">
            <!--<span class="text-weight-bold">Quasar</span> Framework-->
            <q-icon
              name="mail"
              class="q-px-md text-white"
            />
            Envoi d'un mail
          </q-toolbar-title>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="white"
            v-close-popup
          />
        </q-toolbar>

        <q-card-section>
          <div class="row q-pa-xs">
            <div class="col-12 q-pa-xs">
              <q-input
                label="Envoyé vers :"
                v-model="senderTo"
              ></q-input>
            </div>
            <div class="col-12 q-pa-xs">
              <q-input
                label="Objet :"
                v-model="subjectTo"
              ></q-input>
            </div>
            <div class="col-12">
              <q-editor
                ref="mailContent"
                v-model="messageTo"
                min-height="15rem"
              />
            </div>
            <div class="col-12 q-gutter-md q-py-md">
              <q-btn
                icon="save"
                color="primary"
                text-color="white"
                no-caps
                label="Memoriser le message et le destinataire"
                @click="saveSendMail()"
              />
              <q-btn
                icon="mail"
                color="blue-3"
                text-color="black"
                label="Envoyé"
                @click="testSendMail()"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showAdminMenu"
      :position="'left'"
      full-height
    >
      <q-card style="width: 280px">
        <q-linear-progress
          :value="1"
          color="amber"
        />

        <q-card-section class="row items-start no-wrap">
          <q-list>
            <q-item-label
              header
              class="text-h6 text-grey-8 q-pt-xs"
            >
              Menu Administrateur
            </q-item-label>
            <q-item
              clickable
              to="/"
            >
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

    <q-dialog
      v-model="showUserMenu"
      :position="'left'"
      full-height
    >
      <!-- v-if="!isSiteAdmin" -->
      <q-card style="width: 280px">
        <q-linear-progress
          :value="1"
          color="amber"
        />

        <q-card-section class="row items-start no-wrap">
          <q-list>
            <q-item-label
              header
              class="text-h6 text-grey-8 q-pt-xs"
            >
              Menu Utilisateur
            </q-item-label>
            <q-item
              clickable
              :to="'/'"
            >
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
            <q-item
              clickable
              @click="openExtURL('http://svrsharepoint2/sites/DAG/DAAP/Documents%20partages/Forms/AllItems.aspx')"
            >
              <q-item-section avatar>
                <q-icon name="doc" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Documentation</q-item-label>
                <q-item-label caption>
                  Archives et Acceuil du public
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
import { defineComponent } from '@vue/composition-api';
import { mapState, mapActions } from 'vuex';
import { colors, QSpinnerGears, QSpinnerPie } from 'quasar';
const { lighten, setBrand } = colors
import { date, openURL } from 'quasar';
import FAcceuilGrid from '../components/FAcceuilGrid.vue';
import FVvForm from '../components/FVvForm.vue';
import FAccueil from '../components/FAccueil.vue';
import FParking from '../components/FParking.vue';
import DiagSettings from 'components/Settings.vue';

export default defineComponent({
  components: {
    FAcceuilGrid,
    FVvForm,
    FAccueil,
    FParking
  },
  name: 'PageAcceuil',
  data () {
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
      senderTo: '',
      subjectTo: '',
      messageTo: '',
      tabForm: 'accueil',
      showAdminMenu: false,
      showUserMenu: false,
      showMailMessage: false,
      datedujour: date.formatDate(Date.now(), 'DD/MM/YYYY'),
      myLocale: myLocale,
      showParticules:true
      //displayName: this.currentUsername
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
      visiteurs: (state) => state.visiteurs
    }),
    ...mapState('auth', {
      currentUsername: (state) => state.user.displayName,
    }),
    displayName () {
      return this.currentUsername;
    },
    othersMenu () {
      return this.plusMenu;
    },
    totalVisiteurs () {
      if (!this.visiteurs || !Array.isArray(this.visiteurs))
        return
      return this.visiteurs.filter(elt => (elt.datevisite == this.datedujour)&& (elt.etat != 'attente')).length
    },
    totalRdcVisiteurs () {
      if (!this.visiteurs || !Array.isArray(this.visiteurs))
        return
      return this.visiteurs.filter(elt => ((elt.datevisite == this.datedujour) && (elt.typeacces == 'RDC'))).length
    },
    totalParkingVisiteurs () {
      if (!this.visiteurs || !Array.isArray(this.visiteurs))
        return
      return this.visiteurs.filter(elt => ((elt.datevisite == this.datedujour) && (elt.typeacces == 'PARKING') && (elt.etat != 'attente'))).length
    },
  },
  methods: {
    ...mapActions('admin', [
      'getAllVisiteurs',
      'getAllUsers',
      'addVisiteur',
      'getForm',
      'saveForm',
      'getConfig',
      'writeConfig',
      'sendMail'
    ]),
    async saveSendMail () {
      const newconfig = Object.assign({}, this.fconfig);
      newconfig['mail'] = Object.assign({}, {
        to: this.senderTo,
        subject: this.subjectTo,
        message: this.messageTo
      });
      console.log('New config :', newconfig);
      this.$q.loading.show({
        spinner: QSpinnerPie,
        spinnerColor: 'blue',
        message: 'Chargement en cours...'
      })
      await this.writeConfig(newconfig);
      this.$q.loading.hide()
      this.$q.dialog({
        message: "Paramettre de la messagerie sauvegardée!"
      })
    },
    saveDate () {
      console.log('Nouvelle date :', this.datedujour)
    },
    async testSendMail () {
      console.log('Message à envoyé :', this.messageTo)
      this.sendMail({
        to: this.senderTo,
        subject: this.subjectTo,
        message: this.messageTo
      }).then(() => {
        this.$q.dialog({
          message: "Message envoyé!"
        })
      }).catch(() => {
        this.$q.dialog({
          message: "!! Message non envoyé!"
        })
      });

    },
    openExtURL (urlpath) {
      openURL(urlpath, null)
    },
    showSettings (evt) {
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
    changeDate (value, reason, details) {
      console.log('click date :', value)
      if (value == null) {
        this.datedujour = date.formatDate(Date.now(), 'DD/MM/YYYY')
      }
      this.$root.$emit("changeDate", this.datedujour)

      this.$refs.ladatedujour.hide()
    },
    onRowClick (evt, row) {
      console.log('Ligne sélectionnée : ', evt, row);
      if (row) {
        this.selectedUser = row;
        if (evt != 'case à cocher') {
          this.showUserInfos = true;
        }
        //
        console.log('Table ref :', this.$refs.myTable)
      }
    },
  },
  async beforeMount () {
    this.plusMenu = await this.$store.dispatch('tables/find', {
      query: {
        tableDb: 'db_regvisiteurs',
        tableName: 'plusMenu',
        query: JSON.stringify({ query: {} }),
      },
    });
    console.log('Menus ajoutes :', this.plusMenu);

  },
  async mounted () {
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
    //await this.getAllUsers();
     console.log("Result auth:", this.$store.state.auth)
          await this.$store.dispatch('adinfos/getRole', this.$store.state.auth.user)
        await this.$store.dispatch('adinfos/getSiteRole')
     await this.getConfig();
    if (Object(this.fconfig).hasOwnProperty('bgright')) {
      colors.setBrand('bgright', this.fconfig.bgright);
    }
    console.log('Meta infos :', this.$route.query.type);
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    await this.getAllVisiteurs();
    this.$q.loading.hide();
    console.log('Les visiteurs :', this.visiteurs)
  },
});
</script>
<style lang="scss">
.mainTabs {
  .q-tab--active {
    .q-tab__indicator {
      height: 5px;
      /*width: 100%;*/
      opacity: 1;
      transform-origin: left /* rtl:ignore */;
    }
    .q-tab__indicator:after,
    .q-tab__indicator:before {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: '';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    .q-tab__indicator:after {
      border-color: rgba(136, 183, 213, 0);
      border-bottom-color: #88b7d5;
      border-width: 8px;
      margin-left: -8px;
    }
    .q-tab__indicator:before {
      border-color: rgba(194, 225, 245, 0);
      border-bottom-color: #c2e1f5;
      border-width: 10px;
      margin-left: -10px;
    }
  }
}
</style>
