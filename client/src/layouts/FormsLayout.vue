<template>
  <q-layout view="hHh lpR fFf">
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <q-header bordered class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar
          rounded
          size="200px"
          class="absolute"
          style="top: 0; right: 15px; transform: translateY(-75px) translateX(-45px)"
        >
          <div class="q-pa-sm"><img src="~assets/cacemx200.png" /></div>
        </q-avatar>
         {{currentDisplayName}} - Mes Formulaires...
        </q-toolbar-title>
        <q-space/>
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="Accueil"
          to="/"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data () {
    return {
      showParticules: true,
    }
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      users: (state) => state.users,
    }),
    ...mapState('auth', {
      currentUserName: state => state.user.sAMAccountName,
      currentDisplayName: state => state.user.displayName,
      currentAvatar: state =>
        state.user.img64
          ? 'data:image/jpeg;base64,' + state.user.img64
          : 'https://cdn.quasar.dev/img/boy-avatar.png'
    }),
  },
  mounted() {
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
  },
}
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