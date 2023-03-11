<template>
  <q-page class="fit row items-center justify-center q-pa-md q-pt-md">
    <div class="column justify-center self-center" style="width: 75%">
      <div
        class="row justify-center self-center rounded-borders q-pa-xs q-ma-sm"
        style="width: 200px"
      >
        <q-img :src="url" spinner-color="white" class="rounded-borders" />
      </div>
      <div class="row justify-center text-center text-white q-py-none">
        <h3>Actualités de la DSI</h3>
      </div>
      <div class="row justify-center q-px-md full-width">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          :autoplay="autoplay"
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = true"
          class="rounded-borders full-width"
        >
          <q-carousel-slide
            :name="idx"
            class="column no-wrap flex-center self-start items-start q-pt-none"
            v-for="(info, idx) in actus"
            :key="`slide_${idx}`"
          >
            <q-icon :name="info.icon" size="56px" />
            <div class="q-mt-md text-center">
              <q-editor
                v-model="info.detail"
                class="no-border"
                :dense="$q.screen.lt.md"
                :toolbar="(isAdmin)?[
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                    
                  ],
                  [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                  ],
                  ['token', 'hr', 'link', 'custom_btn'],
                  ['print', 'fullscreen'],
                  [
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: [
                        'p',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'code',
                      ],
                    },
                    {
                      label: $q.lang.editor.fontSize,
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                    'removeFormat',
                  ],
                  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                  ['undo', 'redo'],
                  ['viewsource'],
                ]:[]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              />
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      slide: 1,
      autoplay: true,
      url: 'cacem.png',
      linfos: [
        {
          icon: 'home',
          detail: 'info 1',
        },
        {
          icon: 'unsubscribe',
          detail: 'info 2',
        },
        {
          icon: 'feed',
          detail: 'info 3',
        },
      ],
    };
  },
  computed: {
      ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      users: (state) => state.users,
    }),
    actus() {
      return this.linfos;
    },
    
  },
  methods: {
     
  },
};
</script>

<style>
</style>