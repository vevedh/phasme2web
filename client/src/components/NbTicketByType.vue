<template>
<div>
    <q-avatar
                size="90px"
                icon="las la-check-circle"
                text-color="white"
                color="green"
              >
              {{nbTickets}}
              </q-avatar>
              
</div>
  
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    name:'NbTicketByType',
    data() {
        return {
            nbTickets:0
        }
    },
    props: {
        id: {
            type: String,
            require: false
        }
    },
    methods: {
        ...mapActions({ getTickets:'SimplyDesk/getSimplyTickets'}),
    },
    async beforeMount() {
        
    

        console.log('ID Ticket type :',this.id)
        await this.getTickets(this.id);
        const nbt = Object.assign([],this.$root.$store.state.SimplyDesk.tickets);
        console.log(`Tickets ${this.id} :`,nbt)
        if (Array.isArray(nbt)) {
            this.nbTickets = nbt.length
        }
    },
}
</script>

<style>

</style>