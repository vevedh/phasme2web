<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-8 text-white ">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="row items-center no-wrap">
          <div class="column  items-center q-px-xs bg-white">
            <img src="~assets/favicon-96x96.png" style="max-height: 54px;" />
          </div>
          <div class="q-px-md">CACEM Registre Visiteurs</div>
        </q-toolbar-title>

        <div class="column items-end  q-px-xs no-wrap">
          <div
            class="column justify-center q-pa-md"
            style="height:54px;max-height: 54px;"
          >
            <q-input
              class="q-pt-md"
              filled
              dense
              v-model="date"
              :rules="['DD/MM/YYYY']"
              bg-color="white"
              mask="##/##/####"

            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="date"
                      mask="DD/MM/YYYY"
                      :event-color="date => date[date.now()]"
                      :locale="myLocale"

                    >
                      <div class="row items-center justify">
                        <q-btn
                          v-close-popup
                          label="Fermer"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="q-px-md">{{ currentDisplayName }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Liens Administrateur
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

import { mapState, mapActions } from 'vuex';
import { defineComponent, ref } from '@vue/composition-api';
import { date } from 'quasar';
export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  data() {
    return {
      date: date.formatDate(Date.now(), 'DD/MM/YYYY'),
      search: '',
      myLocale: {
        /* starting with Sunday */
        days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
        monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split(
          '_'
        ),
        firstDayOfWeek: 0
      },
      essentialLinks: linksData
    };
  },
  computed: {
    ...mapState('auth', {
      currentUserName: state => state.user.sAMAccountName,
      currentDisplayName: state => state.user.displayName,
      currentAvatar: state =>
        state.user.img64
          ? 'data:image/jpeg;base64,' + state.user.img64
          : 'https://cdn.quasar.dev/img/boy-avatar.png'
    }),
    ...mapState('adinfos', {
      isAdmin: state => state.isAdmin,
      isSiteAdmin: state => state.isSiteAdmin
    }),
    ...mapState('admin', {
      leftMenu: state => state.leftMenu
    }),
    leftDrawerOpen: {
      get() {
        return this.leftMenu;
      },
      set(value) {
        this.$store.commit('admin/setLeftDrawer', value);
      }
    }
  },
  methods: {
    ...mapActions('admin', ['toggleLeftDrawer']),
    async toggleMenu() {
      await this.toggleLeftDrawer();
      this.leftDrawerOpen = this.leftMenu;
    },
    hideMenu() {
      this.$store.commit('admin/setLeftDrawer', false);
    },
    onClear() {
      this.search = '';
    },
    changeDate(value, reason, details) {
      console.log('click date :',this.date)
      this.$root.$emit("changeDate",this.date)
    }
  },
  async mouted() {}
});
</script>
