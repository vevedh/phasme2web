<template>
  <q-page class="flex flex-center">
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <!-- content -->
    <div class="column full-width justify-center full-height">
      <div class="row full-width  full-height justify-center">
        <q-card
          class="login-form"
          v-bind:style="
            $q.platform.is.mobile
              ? { width: '95%' }
              : { width: '95%', height: `${$q.screen.height - 150}px` }
          "
        >
          <q-card-section class="row q-gutter-md q-pa-none " >
            <q-btn
              color="white"
              text-color="black"
              icon="home"
              no-caps
              label="Retour"
              :to="{ path: 'nouveau', query: { type: 'accueil' } }"
            />
            <q-file
              @input="convertAndDownload"
              label="Choisissez un fichier modèle docx"
              borderer
              dense
              filled
              class="bg-white q-px-sm"
              accept=".docx, application/*"
              style="width:100% ;max-width: 320px"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <q-tooltip content-class="bg-white text-dark" content-style="font-size: 1.2em">
                <div>
                  Sélectionner un fichier .docx , tous les noms "{nom colonne}" <br>
                  seront remplacés par les données de la ligne sélectionnée <br>
                  le document ainsi généré peut etre imprimé ou envoyé par mail
                </div>
                <div>Exemple :</div>
                <div>
                 <q-img src='CACEM Registre visiteurs.png'></q-img>
                </div>
              </q-tooltip>
            </q-file>
          </q-card-section>
          <q-card-section
            class="q-pa-none full-height"
            style="height: 100%;max-height:100%"
          >
            <FVvTable
            ref="myTable"
              :dbname="dbname"
              :dbtype="'db_regvisiteurs'"
              :editable="true"
:useAdmin="true"
              @row-click="onRowClick"
              :style="
                $q.platform.is.mobile ? { width: '95%' } : { width: '100%' }
              "
            ></FVvTable>
          </q-card-section>
        </q-card>
      </div>
      <!--:selectable="true"<div class="row full-width  justify-center text-h2 text-dark">
        <q-card class="bg-transparent" flat>
          <q-card-section>
            <span class="text-h6 text-bold">Bienvenue {{ displayName }}</span>
          </q-card-section>
        </q-card>
      </div>-->
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { mapState, mapActions } from 'vuex';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import FVvTable from 'components/FVvTable.vue';
export default defineComponent({
  name: 'PageDonnees',
  components: {
    FVvTable
  },
  data() {
    return {
      dbname: '',
      selectedRow:{},
      //displayName: this.currentUsername
    };
  },
  computed: {
    ...mapState('auth', {
      currentUsername: state => state.user.displayName
    }),
    displayName() {
      return this.currentUsername;
    },
    othersMenu() {
      return this.plusMenu;
    },
    docDatas() {
      return this.selectedRow
    }
  },
  methods: {
    ...mapActions('admin', ['getAllUsers']),
    onRowClick(evt, row) {
      this.selectedRow = Object.assign({},row)
      console.log('row :',this.selectedRow)
      console.log('row :', row);

    },
    convertAndDownload(file) {
      console.log(this.$refs)
      const datas = Object.assign({},this.docDatas)
      var reader = new FileReader();

      reader.readAsBinaryString(file);

      reader.onerror = function(evt) {
        console.log('Erreur de lecture du fichier docx', evt);
        this.$q.notify({ message: 'error reading file' + evt });
      };
      reader.onload = function(evt) {
        const content = evt.target.result;
        var zip = new PizZip(content);
        // generation du document à partir du template.
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true
        });

        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        console.log(datas)
        doc.render(datas);

        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        // Output the document using Data-URI
        saveAs(out, 'output.docx');
      };
    }
  },
  beforeMount() {
    console.log('Données du formulaire :', this.$route.query.type);
    this.currentFormName = this.$route.query.type;
    if (this.$route.query.type != '') {
      this.dbname = 'dbf_' + this.currentFormName;
    } else {
      this.dbname = 'dbf_vide';
    }
  },
  async mounted() {
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
            speed: 40,
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
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
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
      retina_detect: true
    });
    await this.getAllUsers();
  }
});
</script>


