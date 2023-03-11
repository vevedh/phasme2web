<template>
  <q-splitter class="compParking" v-model="splitterModel" style="height: 100%">
    <template v-slot:before>
      <q-tabs v-model="tvue" vertical class="text-teal">
        <q-tab name="formulaire" icon="feed" label="Formulaire" />
        <q-tab name="donnees" icon="list_alt" label="Liste" />
      </q-tabs>
    </template>

    <template v-slot:after>
      <q-tab-panels
        v-model="tvue"
        animated
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="formulaire" class="q-pt-none">
          <div class="text-h5 text-center q-mb-md">
            Formulaire pour un nouveau visiteur
          </div>
          <f-vv-form :title="'parking'"></f-vv-form>
        </q-tab-panel>

        <q-tab-panel name="donnees" class="q-pa-none">
          <!--<f-acceuil-table
            ref="myTable"
            :titre="'Données de l\'accueil'"
            :dbname="title"
            :dbtype="'db_regvisiteurs'"
            :editable="true"
            :useAdmin="true"
            @row-click="onRowClick"
            :style="
              $q.platform.is.mobile ? { width: '95%' } : { width: '100%' }
            "
          ></f-acceuil-table>-->
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import FVvForm from './FVvForm.vue';
export default defineComponent({
  name: 'FParking',
   components: {
    //FPackingTable,
    FVvForm,
  },
  data() {
    return {
      tvue: 'formulaire',
      splitterModel: 20,

    };
  },
  props: {
    title: {
      type: String,
      required: false
    }
  },
  methods: {
    onRowClick(evt) {},

  }
});
</script>
<style lang="scss">

.compParking {
  .q-tab--active .q-tab__indicator {
  height: 100%;
  width: 5px;
  opacity: 1;
  transform-origin: left /* rtl:ignore */;
}
}

</style>
