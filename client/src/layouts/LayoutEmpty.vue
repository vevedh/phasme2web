<template>
    <q-layout>
        <!-- Be sure to play with the Layout demo on docs -->

    <div id="particles-js" :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'" ></div>
        <q-page-container>
            <!--This is where pages get injected -->

            <router-view />
        </q-page-container>

    </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent, ref } from '@vue/composition-api'
import { colors } from 'quasar'

export default defineComponent({
    name: 'LayoutEmpty',
    data() {
      return {
        showParticules:true
      }
    },
    computed: {
      ...mapState('admin',{
        fconfig: state => state.config

      })
    },
    methods: {
        ...mapActions('admin', ['getConfig', 'writeConfig']),
    },
    async mounted() {
       if (this.showParticules) {
          particlesJS("particles-js", { "particles": { "number": { "value": 160, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 1, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 600 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 5 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });

      /*colors.setBrand('bgright','#ebd404')
      await this.getConfig()
      if (Object(this.fconfig).hasOwnProperty('bgright')) {
        colors.setBrand('bgright', this.fconfig.bgright)
      }*/
      }

    }
})
</script>

<style lang="scss">
#particles-js {
    position: fixed;

    width: 100%;
    height: 100%;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100% 100%;

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


