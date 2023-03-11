<template>
  <q-layout>
    <!-- Be sure to play with the Layout demo on docs -->
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <q-page-container class="flex flex-top q-pt-xs">
      <!-- This is where pages get injected -->
      
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';

import { mapState, mapActions } from 'vuex';
export default defineComponent({
  name: 'Empty',
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,
      users: (state) => state.users,
    }),
    ...mapState('SimplyDesk', {
      symUsers: (state) => state.users,
      symOpenTickets: (state) => state.openTickets,
      symClosedTickets: (state) => state.closedTickets,
    }),
    allowRegistre(){
      if (this.grpUser) {
        return this.grpUser.includes('Application WEB REGISTRE');
      } else {
        return false
      }
    },
    sOpenTickets() {
      if (this.symOpenTickets) {
        return this.symOpenTickets.length;
      }
    },
    sClosedTickets() {
      if (this.symClosedTickets) {
        return this.symClosedTickets.length;
      }
    },
    showDev() {
      return process.env.NODE_ENV!='production'
    }
  },
  methods: {
    ...mapActions('SimplyDesk', [
      'getSimplyUsers',
      'getSimplyServices',
      'getSimplyAgents',
      'getSimplyIncidents',
      'getSimplyTypes',
      'getSimplyTickets',
      'getSimplyCategories',
      'getSimplyOpenTickets',
      'getSimplyClosedTickets'
    ]),
  },
  async mounted() {
    particlesJS('particles-js', {
      particles: {
        number: { value: 160, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' },
          polygon: { nb_sides: 5 },
          image: { src: 'img/github.svg', width: 100, height: 100 },
        },
        opacity: {
          value: 1,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false, speed: 4, size_min: 0.3, sync: false },
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 600 },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'bubble' },
          onclick: { enable: true, mode: 'repulse' },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 5 },
          repulse: { distance: 400, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
    await this.$store.dispatch('adinfos/getRole', this.$store.state.auth.user)
    await this.$store.dispatch('adinfos/getSiteRole')
    console.log('Path :',this.$router.currentRoute.path);
    this.$q.fullscreen.request()
    .then(() => { // v1.5.0+
      // success!
      console.log('Plein ecran')
    })
    .catch(err => { // v1.5.0+
      // oh, no!!!
    })
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
</style>
