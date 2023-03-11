<template>
  <q-layout view="hHh LpR fFf">
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <q-header id="hbarre" elevated class="text-white q-py-md">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-avatar
          rounded
          size="200px"
          class="absolute"
          style="top: 0; right: 15px; transform: translateY(-75px)"
        >
          <div class="q-pa-sm"><img src="~assets/cacemx200.png" /></div>
        </q-avatar>
        <q-toolbar-title>
          <!--<q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>-->
          Mon Tableau de Bord Agent CACEM
          <span v-if="showDev">*** DEVELOPPEMENT***</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="left"
      :mini="!left || miniState"
      @click.capture="drawerClick"
      :width="300"
      :breakpoint="400"
      content-class="bg-grey-3"
      side="left"
      unelevated
    >
      <!-- drawer content -->

      <div id="profile" class="row">
        <div class="col-3 q-pa-none">
          <q-avatar
            :icon="currentAvatar"
            size="65px"
            class="inline-block q-pa-none"
          ></q-avatar>
        </div>
        <div class="col-9 q-gutter-sm q-pt-xs" v-if="!miniState">
          <!--img src="../img/avatar-1.svg" id="avatar" class="inline-block"-->
          <div class="row q-gutter-xs">
            <span class="text-white"> {{ displayName }} </span>
            <br />
            <span class="text-white"> {{ email }} </span>
          </div>

          <div class="row q-gutter-sm q-pt-sm q-pl-none">
            <div class="text-white">{{ siteRole }}</div>
            <q-space />
            <q-btn
              v-if="isAdmin"
              class="bordered bg-blue small"
              dense
              icon="person"
              color="white"
            ></q-btn>
            <q-btn
              v-if="isAdmin"
              class="bordered bg-blue small"
              dense
              icon="lock"
              color="white"
            ></q-btn>
            <q-btn
              class="bordered bg-blue small"
              dense
              icon="home"
              color="white"
              to="/"
            ></q-btn>
            <!--<q-btn
              class="bordered bg-blue small"
              dense
              icon="exit_to_app"
              color="white"
              @click="exitApp()"
            ></q-btn>-->
          </div>
        </div>
      </div>
      <q-list separator color="bg-grey-4">
        <q-item clickable v-ripple to="/user/profil">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section> Profil utilisateur </q-item-section>
        </q-item>

        <q-item
          v-show="allowRegistre"
          clickable
          v-ripple
          to="/user/regvisiteurs"
        >
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>

          <q-item-section> Registre Visiteurs </q-item-section>
        </q-item>
        <q-item
          v-show="allowParking"
          clickable
          v-ripple
          to="/parking"
        >
          <q-item-section avatar>
            <q-icon name="supervised_user_circle" />
          </q-item-section>

          <q-item-section> Registre Parking </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/user/parking">
          <q-item-section avatar>
            <q-icon name="directions_car_filled" />
          </q-item-section>

          <q-item-section> Demande Parking </q-item-section>
        </q-item>

        <q-item
          v-if="isAdmin || siteRole == 'admparking'"
          clickable
          v-ripple
          to="/user/resparking"
        >
          <q-item-section avatar>
            <q-icon name="emoji_transportation" />
          </q-item-section>

          <q-item-section> Réservations Parking </q-item-section>
        </q-item>

        <q-expansion-item
          v-if="isAdmin"
          expand-separator
          icon="settings"
          label="Options..."
        >
          <q-item clickable v-ripple to="/formulaires">
            <q-item-section avatar class="q-pl-md">
              <q-icon name="feed" />
            </q-item-section>

            <q-item-section> Formulaires... </q-item-section>
          </q-item>
          <q-card class="my-card">
            <q-card-section class="q-pa-none">
              <q-list bordered separator>
                <q-expansion-item
                  dense
                  v-if="isAdmin"
                  expand-separator
                  icon="palette"
                  label="Couleur de fond"
                  caption="Change la couleur de fond"
                  class="q-pl-md"
                >
                  <q-card>
                    <q-card-section>
                      <q-color
                        v-model="col_bgright"
                        class="my-picker"
                        @change="changeBgright"
                      />
                    </q-card-section>
                    <q-card-actions>
                      <q-btn
                        color="primary"
                        class="text-white"
                        @click="saveSettings"
                        >Mémoriser</q-btn
                      >
                    </q-card-actions>
                  </q-card>
                </q-expansion-item>

                <q-expansion-item
                  dense
                  v-if="isAdmin"
                  expand-separator
                  icon="palette"
                  label="Couleur Barre du Haut"
                  caption="Change la couleur de la barre du haut"
                  class="q-pl-md"
                >
                  <q-card>
                    <q-card-section>
                      <q-color
                        v-model="col_hbarre"
                        class="my-picker"
                        @change="changeHbarre"
                      />
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <q-expansion-item
                  dense
                  v-if="isAdmin"
                  expand-separator
                  icon="palette"
                  label="Couleur du fond profile"
                  caption="Change la couleur de la zone utilisateur"
                  class="q-pl-md"
                >
                  <q-card>
                    <q-card-section>
                      <q-color
                        v-model="col_profile"
                        class="my-picker"
                        @change="changeProfile"
                      />
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <!--<menu-one
        v-if="getMenuCollapse"
        :links="links"
      ></menu-one>
      <menu-two
        v-else
        :links="links"
      ></menu-two>-->
      <div
        class="q-mini-drawer-hide absolute no-shadow"
        style="top: 10px; right: -17px"
      >
        <q-btn
          dense
          round
          size="14px"
          color="primary"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
      <div
        class="fixed-bottom text-center text-italic"
        style="width:100%;max-width;60%"
      >
        Réalisé par la DSI
      </div>
    </q-drawer>

    <q-page-container class="flex flex-top justify-center items-start">
      <transition
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut"
  appear
  :duration="300"
>
      <router-view /></transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { defineComponent, ref } from '@vue/composition-api';
import { QSpinnerGears,colors } from 'quasar';

import menuOne from './menuOne.vue';
import menuTwo from './menuTwo.vue';
export default defineComponent({
  components: {
    menuOne,
    menuTwo,
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
      left: false,
      miniState: false,
      showParticules: true,
      col_bgright: '',
      col_profile: '',
      col_hbarre: '',
      photo: '',
      userId: '',
      user: {},
      links: {
        Formulaires: {
          routes: [
            {
              route: '/',
              faIcon: 'fa fa-home',
              materialIcon: 'home',
              name: 'Registre',
            },
          ],
          show: true,
        },
        Vues: {
          routes: [
            {
              route: '/form',
              faIcon: 'fa fa-search',
              materialIcon: 'search',
              name: 'Form find / edit',
            },
            {
              route: '/embeeded',
              faIcon: 'fa fa-check',
              materialIcon: 'check',
              name: 'Embeeded validations',
            },
            {
              route: '/advanced-form-one',
              faIcon: 'fa fa-hdd-o',
              materialIcon: 'filter_1',
              name: 'Adv. Form One',
            },
          ],
          show: false,
        },
        Pages: {
          routes: [
            {
              route: '/login-one',
              faIcon: 'fa fa-unlock-alt',
              materialIcon: 'lock_open',
              name: 'Login One',
            },
            {
              route: '/pricing',
              faIcon: 'fa fa-money',
              materialIcon: 'attach_money',
              name: 'Pricing',
            },
            {
              route: '/drag-and-drop',
              faIcon: 'fa fa-arrows',
              materialIcon: 'move_to_inbox',
              name: 'Drag and Drop',
            },
            {
              route: '/server-side-data-table',
              faIcon: 'fa fa-list-alt',
              materialIcon: 'list_compact',
              name: 'Server Side Data Table',
            },
          ],
          show: false,
        },
      },
    };
  },
  computed: {
    ...mapState('admin', {
      fconfig: (state) => state.config,
    }),
    ...mapGetters('vvstore', ['getLayoutNeeded', 'getMenuCollapse']),
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,
      siteRole: (state) => state.siteRole,
    }),
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      visiteurs: (state) => state.visiteurs,
    }),
    ...mapState('auth', {
      currentUsername: (state) => state.user.displayName,
    }),
    allowRegistre() {
      if (this.grpUser) {
        return this.grpUser.includes('Application WEB REGISTRE');
      } else {
        return false;
      }
    },
    allowParking(){
      if (this.grpUser) {
        return this.grpUser.includes('WebApps - ADM PARKING');
      } else {
        return false //WebApps - ADM PARKING
      }
    },
    displayName() {
      return this.currentUsername;
    },
    email() {
      return this.$store.state.auth.user.mail
        ? this.$store.state.auth.user.mail
        : null;
    },
    othersMenu() {
      return this.plusMenu;
    },
    currentAvatar() {
      return this.$store.state.auth.user.img64
        ? 'img:data:image/jpeg;base64,' + this.$store.state.auth.user.img64
        : 'account_box'; //'https://cdn.quasar.dev/img/boy-avatar.png';
    },
    showDev() {
      return process.env.NODE_ENV!='production'
    }
  },
  methods: {
    changeBgright() {
      colors.setBrand('bgright', this.col_bgright);
    },
    changeHbarre() {
      colors.setBrand('hbarre', this.col_hbarre);
    },
    changeProfile() {
      colors.setBrand('profile', this.col_profile);
    },
    async saveSettings() {
      await this.writeConfig({
        bgright:
          this.col_bgright != '' ? this.col_bgright : this.fconfig.bgright,
        profile:
          this.col_profile != '' ? this.col_profile : this.fconfig.profile,
        hbarre: this.col_hbarre != '' ? this.col_hbarre : this.fconfig.hbarre,
      });
    },
    ...mapActions('adinfos', ['getRole']),
    ...mapActions('admin', [
      'getForm',
      'saveForm',
      'updateForm',
      'getAllForms',
      'getConfig',
      'writeConfig',
    ]),
    drawerClick(e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false;

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        //e.stopPropagation()
      }
    },
    async exitApp() {
      await this.$store.dispatch('auth/logout').then(() => {
        console.log('Vous avez été deconnecté', this.$store.state.auth);
        this.$router.push('/login');
      });
    },
  },
  async beforeMount() {
    //await this.getRole();
    await this.$store.dispatch('adinfos/getRole', this.$store.state.auth.user);
    //colors.setBrand('bgright', '#ebd404')
    await this.getConfig();
    if (Object(this.fconfig).hasOwnProperty('bgright')) {
      colors.setBrand('bgright', this.fconfig.bgright);
    }
    if (Object(this.fconfig).hasOwnProperty('profile')) {
      colors.setBrand('profile', this.fconfig.profile);
    }
    if (Object(this.fconfig).hasOwnProperty('hbarre')) {
      colors.setBrand('hbarre', this.fconfig.hbarre);
    }
  },
  async mounted() {
    
    //$q.dark.set(false)
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    console.log('Auth user:', this.$store.state.auth.user);
    await this.$store.dispatch('adinfos/getRole', this.$store.state.auth.user);
    await this.$store.dispatch('adinfos/getSiteRole');
    await this.getAllForms();
    this.$q.loading.hide();
    console.log('Formulaires autorisés :', this.allForms);
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
    
  },
});
</script>
<style>
#particles-js {
  position: absolute;

  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}

/* ---- particles.js container ---- */

.normal_gradient {
  background: linear-gradient(145deg, rgb(2, 107, 148) 15%, #9c0c02 70%);
}

.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.fixed-bottom {
  margin-bottom: 0%;
}
.fixed-bottom a img {
  width: 25px;
  height: 25px;
}
#avatar {
  padding: 10px;
}
#profile {
  height: 120px;
  background-color: var(--q-color-profile);
}

#hbarre {
  background-color: var(--q-color-hbarre);
}

#user-name {
  left: 90px;
  bottom: 55px;
  position: relative;
  width: 179px;
}
#user-actions {
  left: 170px;
  bottom: 35px;
  position: relative;
  width: 120px;
}
#menu-collapse {
  margin-top: 5%;
}
/*
.q-tab--active .q-tab__indicator {
  height: 100%;
  width: 5px;
  opacity: 1;
  transform-origin: left ;
}
.q-tab--active .q-tab__bindicator {
  border-bottom: $negative solid 5px;
}
.q-tab__indicator:after,
.q-tab__indicator:before {
  left: 100%;
  top: 50%;
  border: solid transparent;
  content: '';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.q-tab__indicator:after {
  border-color: rgba(191, 2, 2, 0);
  border-left-color: $negative;
  border-width: 8px;
  margin-top: -8px;
}
.q-tab__indicator:before {
  border-color: rgba(47, 146, 245, 0);
  border-left-color: $primary;
  border-width: 10px;
  margin-top: -10px;
}

.mnreg_border {
  border-left: solid 5px $negative;
}
.mnreg_select {
  width: 0px;
  background: transparent;
  border-left: 5px solid $negative;
  transform-origin: left;
}

.mnreg_select:after,
.mnreg_select:before {
  left: 0%;
  top: 50%;
  border: solid $negative;
  content: '';
  height: 0;
  width: 0;
  border-width: 10px;
  position: absolute;
  pointer-events: none;
}

.mnreg_select:after {
  border-color: rgba(191, 2, 2, 0);
  border-left-color: $negative;
  border-width: 8px;
  margin-top: -8px;
}
.mnreg_select:before {
  border-color: rgba(47, 146, 245, 0);
  border-left-color: $primary;
  border-width: 10px;
  margin-top: -10px;
}*/
</style>
