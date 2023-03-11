<template>
  <div
    class="fullscreen bg-white text-dark text-center q-pa-md flex flex-center"
  >
    <div>
      <div>
        <img src="~assets/CACEM_sans.png" />
      </div>
      <div style="font-size: 5vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Page inaccessible...
      </div>

      <q-btn
        class="q-mt-xl"
        color="primary"
        text-color="white"
        unelevated
        to="/"
        label="Retour à l'accueil..."
        no-caps
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Error404'
});
</script>
