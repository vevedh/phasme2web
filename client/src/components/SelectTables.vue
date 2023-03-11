<template>
  <q-table  :data="getDatas" :editable="false" style="width: 100%; height: 100%" ref="dqsd" ></q-table>
</template>

<script>
import FVvTable from './FVvTable.vue';
import feathersClient from '../boot/feathers-client';
import { defineComponent, computed } from '@vue/composition-api';
export default defineComponent({
  components: {
    FVvTable,
  },
  data() {
    return {
      donnees: [],
    };
  },
  methods: {},
  name: 'SelectTables',
  props: {
    table: {
      type: String,
    },
  },
  computed: {
    getDatas() {
        if (!this.donnees)
        return
      return [...this.donnees];
    },
  },
  async mounted() {
      
  
   
    const tables = await feathersClient.service('checkdbs').find({
      query: {
        todb: `${this.table}`,
      },
    });
    console.log('Les tables :', tables);
   
        this.donnees = Object.assign([], tables);
    
    
  },
  async activated() {
      const tables = await feathersClient.service('checkdbs').find({
      query: {
        todb: `${this.table}`,
      },
    });
    console.log('Les tables :', tables);
    this.donnees = Object.assign([], tables);
  }
 
});
</script>

<style>
</style>