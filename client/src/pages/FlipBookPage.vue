<template>
  <q-page class="flex flex-center">
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <!-- content -->
    <div class="q-pa-sm">
      <div class="row bg-white">
        <q-file
          @input="convertAndDownload"
          label="Choisissez un fichier PDF"
          borderer
          filled
          dense
          bg-color="white"
          accept=".pdf, application/*"
          style="max-width: 400px"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
      <div class="row q-pa-md full-height">
        <flipbook
          ref="myFlipbook"
          class="flipbook"
          :pages="pages"
          v-slot="flipbook"
          :startPage="1"
          :clickToZoom="false"
        >
          <button @click="flipbook.flipLeft">Page précédente</button>
          <button @click="flipbook.flipRight">Page suivante</button>
        </flipbook>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import Flipbook from 'flipbook-vue';
import { date, QSpinnerGears , QBtn, QTooltip} from 'quasar';
//import * as PDFJSViewer from "pdfjs-dist/legacy/web/pdf_viewer";
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js';
export default defineComponent({
  // name: 'PageName'
  components: {
    Flipbook,
  },
  data() {
    return {
      pages: [],
      image: null,
      show: false,
      src: '',
      srcimg: '',
    };
  },
  methods: {
    convertAndDownload(files) {
      //this.pages = ['images/1.jpg','images/2.jpg']
      console.log('Files', files);
      const file = files; //[0]
      console.log('Pages :', this);
      //this.src = files[0]
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.src = event.target.result;
        console.log('RESULT!', img.src);
        //this.src = img.src
        //console.log('MyPDF :', this.$refs.myPDF)
        console.log('Object :', getDocument(img.src));
        const pdfjs = await getDocument(img.src).promise;
        //getDocument(img.src).promise.then(async (pdfjs) => {
        console.log('Pages dans le pdf :', pdfjs);
        const totalPages = pdfjs.numPages;
        console.log('Total de pages :', totalPages);
        //const canvasArr = [];
        this.pages = new Array(totalPages);
        for (let i = totalPages; i > 0; i--) {
          let page = await pdfjs.getPage(i);
          console.log('Page loaded :', page.pageNumber);
          var scale = 1.0;
          var viewport = page.getViewport({
            scale: scale,
          });
          // Prepare canvas using PDF page dimensions
          var canvas = document.createElement('canvas'); //document.getElementById(`canPage${page.pageIndex}`);
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          var renderTask = await page.render(renderContext).promise;
          console.log('Page rendered', renderTask);

          // signature
          context.font = '10px sans-serif';
          context.fillStyle = '#ff0000';
          context.fillText('DSI CACEM', 5, 15);

          this.pages[page.pageNumber - 1] = canvas.toDataURL('image/png');
        }
        //this.$refs.myFlipbook.flipRight()
        //this.$refs.myFlipbook.flipLeft()
        this.$refs.myFlipbook.flipRight();
        console.log('My flipbook :', this.$refs.myFlipbook);
        this.$q.loading.hide();
        //})
      };
      this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Traitement en cours...',
    });
      reader.readAsDataURL(file);
    },
  },
  mounted() {
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
  },
});
</script>

<style>
.flipbook {
  width: 90vw;
  height: 90vh;
}
</style>

