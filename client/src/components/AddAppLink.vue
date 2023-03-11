<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card ><!--style="max-width:800px"-->
      <q-card-section
        dense
        class="row no-wrap justify-center items-center q-py-xs  bg-primary text-white"
      >
        <div class="text-h6 full-width">{{labelAction}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <!--<div class="column" style="width:500px;">--></div>
        <!--<vv-form ref="form" :fields="formFields" :edit="false" :readOnly="false" v-model="model"></vv-form>-->
       <q-card-section>
           <!--<f-form ref="form" :schema="fields" :model="fieldsModel" @input="onInput" indiag></f-form>-->
           <f-vv-form ref="form" :ffields="fields" :edit="false" :readOnly="false" :fieldsModel="fieldsModel"></f-vv-form>
       </q-card-section>

      <!--</div>-->

      <q-card-actions align="right">
        <q-btn color="negative" label="Annuler" @click="onCancelClick" />
        <q-btn color="primary" label="Valider" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">

import Vue from 'vue'
import { defineComponent } from '@vue/composition-api';
//import  VVForm  from '../components/VVForm.vue';
import  FVvForm from './FVvForm.vue';
import { mapGetters, mapActions } from 'vuex';
//Vue.component('vv-form', VVForm)


export default defineComponent({
  name: 'AddAppLink',
  components: {
    FVvForm,
  },
  data() {
    return {
      model:{},
      formFields: null || Array || {}
    };
  },
  props: {
    fields: {
      type: Array
    },
    fieldsModel: {
      type: Object||null
    },
    id: {
      type: String||null
    },
      labelAction: {
      type: String,
      required: false
    }
  },
  mounted() {
    //console.log('Fields :', this.fields);


   this.model = Object.assign({},this.fieldsModel)


  },
  methods: {

    show() {
      (this.$refs.dialog as any).show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      (this.$refs.dialog as any).hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },
    onInput(val:any) {
      console.log('Model :',val);
    },
    async onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      let isValid = await (this.$refs.form as any).$refs.myForm.validate();
      if (!isValid) {
        this.$q.notify({
          message: 'Vous devez remplir tous les champs obligatoires',
          color: 'negative'
        })
      } else {
          //(this.$refs.form as any).save()

          //console.log("Form :",this.$refs.form)
          console.log("Save :",(this.$refs.form as any).model, this.id)
          //await this.majRubriqueById([this.id,(this.$refs.form as any).model])
          //if (this.id ) {
            let  res = Object.assign({},(this.$refs.form as any).model)
            let  curId = this.id
            let result = Object.assign({},{ '_id':curId, ...res})
            this.$emit('ok',  { result: result });
          /*} else {
            this.$emit('ok', { result:(this.$refs.form as any).model});
          }*/

          // or with payload: this.$emit('ok', { ... })

          // then hiding dialog
          this.hide();
      }


    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  },
  watch: {
    model: {
      handler(val) {
        console.log("Model :",val,this.id)
      }
    }
  }
});
</script>
