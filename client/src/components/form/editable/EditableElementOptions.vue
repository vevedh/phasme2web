<template>
  <form v-if="value" v-on:submit.prevent>
    <div class="text-right q-px-sm">
      <q-chip square dense :icon="typeIcon" class="text-uppercase"
        >{{ typeName }}
      </q-chip>
    </div>
    <q-input
      dense
      v-model="value.label"
      placeholder="nom du champ"
      label="Nom du champ"
      class="q-px-sm"
      v-if="ifNotTypes(['image'])"
    />
    <q-input
      dense
      v-model="value.id"
      placeholder="id du champ"
      label="ID du champ"
      class="q-px-sm"
      v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
      label-color="negative"
    />
    <q-input
      dense
      v-model="value.mask"
      class="q-px-sm"
      label="Masque :"
      v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
    />

    <q-input
      dense
      type="number"
      min="1"
      max="12"
      v-model="value.span"
      :value="12"
      class="q-px-sm"
      placeholder="12"
      label="Nb col/12"
    />
    <!-- <div class="text-caption q-pt-sm text-weight-light">A longer description to display</div> -->
    <!-- <q-editor dense v-model="value.field_options.description" :toolbar="[
                                  ['bold', 'italic', 'underline'],
                                  ['unordered', 'ordered', 'link', 'hr']
                                ]" /> -->

    <editable-checkboxes-options
      v-model="value.field_options"
      v-if="ifType('checkboxes')"
    />
    <editable-radio-options
      v-model="value.field_options"
      v-if="ifType('radio')"
    />
    <editable-dropdown-options
      v-model="value.field_options"
      v-if="ifType('dropdown')"
    />

    <q-expansion-item
      dense
      expand-separator
      label="Description"
      caption="information sous le champ"
      header-class="bg-blue-2"
      class="q-px-none q-py-md"
      v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
    >
      <q-card>
        <q-card-section>
          <q-input
            dense
            v-model="value.field_options.description"
            type="textarea"
            class="q-pt-md"
            label="Description :"
            filled
            v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
          />

          <q-input
            dense
            v-model="value.labelToolTip"
            type="textarea"
            label="Bulle d'aide :"
            filled
            class="q-pt-sm"
            v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-toggle
      class="q-px-sm"
      v-model="value.required"
      label="Obligatoire"
      v-if="ifNotTypes(['section_break', 'page_break', 'image'])"
    />
    <q-toggle
      class="q-px-sm"
      v-model="value.field_options.filled"
      :value="true"
      label="Remplie"
      v-if="
        ifNotTypes([
          'section_break',
          'page_break',
          'image',
          'radio',
          'checkboxes',
          'hidden',
        ])
      "
    />
    <q-toggle
      class="q-px-sm"
      v-model="value.field_options['stack-label']"
      :value="true"
      label="Au dessus"
      v-if="
        ifNotTypes([
          'section_break',
          'page_break',
          'image',
          'radio',
          'checkboxes',
        ])
      "
    />

    <q-file
      dense
      outlined
      class="q-pa-md"
      label="Sélectionnez une Image..."
      v-model="imgFile"
      @input="fileSelect"
      accept=".png, application/*"
      v-if="ifType('image')"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <q-input
      dense
      class="q-px-md"
      label="Largeur :"
      type="number"
      v-model="value.field_options.img_width"
      :value="150"
      v-if="ifType('image')"
    />
    <q-input
      dense
      class="q-px-md"
      label="Hauteur :"
      type="number"
      v-model="value.field_options.img_height"
      :value="250"
      v-if="ifType('image')"
    />
    <div class="q-pa-md" v-if="ifType('image')">
      <div>Position :</div>
      <div class="q-gutter-sm">
        <q-radio
          v-model="value.field_options.img_position"
          val="start"
          label="Debut"
        />
        <q-radio
          v-model="value.field_options.img_position"
          val="center"
          label="Milieu"
        />
        <q-radio
          v-model="value.field_options.img_position"
          val="end"
          label="Fin"
        />
      </div>
    </div>

    <editable-show-options
      v-model="value"
      :fieldsList="fieldsList"
      v-if="ifNotTypes(['section_break', 'page_break'])"
    />
  </form>
</template>

<script>
import { QInput, QToggle, QChip, QFile } from 'quasar';
import EditableCheckboxesOptions from './EditableCheckboxesOptions';
import EditableRadioOptions from './EditableRadioOptions';
import EditableDropdownOptions from './EditableDropdownOptions';
import EditableShowOptions from './EditableShowOptions.vue';
export default {
  name: 'EditableElementOptions',
  components: {
    QInput,
    QToggle,
    QChip,
    QFile,
    EditableCheckboxesOptions,
    EditableRadioOptions,
    EditableDropdownOptions,
    EditableShowOptions,
  },
  props: ['value', 'typeInfo', 'fieldsList', 'submitOptions'],
  data() {
    return {
      imgFile: null,
      foption: null,
      fcalc: '',
      useShowOption: false,
      expandVisible: false,
    };
  },
  methods: {
    ifType(type) {
      return this.value.field_type === type;
    },
    ifNotTypes(types) {
      if (!Array.isArray(types)) {
        types = [types];
      }
      return types.indexOf(this.value.field_type) < 0;
    },
    getTypeInfo() {
      for (const i in this.typeInfo) {
        if (this.typeInfo[i].type === this.value.field_type) {
          return this.typeInfo[i];
        }
      }
      return false;
    },
    fileSelect(file) {
      const reader = new FileReader();
      console.log('Event file image :', file);
      reader.onload = (event) => {
        if (event.target.readyState == FileReader.DONE) {
          console.log('File data :', event.target.result);
          console.log('File data infos :', event.target);
          const img = new Image();
          img.src = event.target.result;
          img.onload = (ev) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            this.value.field_options.img_width = img.width;
            this.value.field_options.img_height = img.height;
            canvas.width = img.width; //Number(this.field_options.img_width)
            canvas.height = img.height; //Number(this.field_options.img_height)
            ctx.drawImage(img, 0, 0);
            //console.log('Image data :',canvas.toDataURL('image/png'))
            this.value.field_options.img_src = canvas.toDataURL('image/png');
            //return canvas.toDataURL('image/png')
          };
        }
      };
      //console.log("Type imgdata :",(typeof this.field_options.img_data))
      //if(this.field_options.img_data.type.match('image.*')) {
      reader.readAsDataURL(file); //new Blob([this.field_options.img_data]));
    },
    /*startShowOptions() {
      if (this.expandVisible == true) {
        if (Object(this.foption).hasOwnProperty('id')) {
          console.log('Option :', this.foption);
          console.log(` Option : ${this.foption.id} : ${this.fcalc}`);
        }
      }
    },
    checkOptions() {
      if (
        (this.fcalc == null || this.fcalc == '') &&
        !Object(this.foption).hasOwnProperty('id')
      ) {
        if (Object(this.value).hasOwnProperty('show_options')) {
          delete this.value.show_options;
        }
        this.$q.notify({
          message: 'Vous devez definir une condition',
          color: 'negative'
        });
      } else {
        if (Object(this.value).hasOwnProperty('show_options')) {
          delete this.value.show_options;
        }
        console.log('Option :', this.foption);
        console.log(` Option : ${this.foption.id} : ${this.fcalc}`);
      }
    }*/
  },
  computed: {
    typeName() {
      return this.getTypeInfo().label;
    },
    typeIcon() {
      return this.getTypeInfo().icon;
    },
  },
  watch: {
    value: {
      handler(val) {
        console.log('Proprietes :', val);
      },
    },
    /*fcalc: {
      handler(val) {
        //this.expandVisible = !this.expandVisible
        if (val && this.expandVisible) {
          this.value.show_options = [
            { id_field: this.foption.id, op: 'eq', valcalc: val }
          ];
          console.log('Visible Options :', this.value);
        }
      }
    }*/
  },
};
</script>
