<template>
  <div>
    <q-input
      class="q-pt-md"
      filled
      dense
      v-model="id"
      :rules="['DD/MM/YYYY']"
      bg-color="white"
      mask="##/##/####"
      @input="emitInput"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="id"
              mask="DD/MM/YYYY"
              :event-color="date => date[date.now()]"
              :locale="myLocale"
            >
              <div class="row items-center justify">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'VvDatePicker',
  props: {
    id: String,
    value: [String, Array],
    type: String,
    name: String
  },
  data() {
    //const name = JSON.stringify(this.options);
    const myLocale = {
      /* starting with Sunday */
      days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
      months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
        '_'
      ),
      monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split('_'),
      firstDayOfWeek: 0
    };
    return {
      myLocale
    };
  },
  methods: {
    emitInput(o) {
      this.$emit('input', o.value);
    }
  }
});
</script>
