import VueCompositionApi from '@vue/composition-api';
import { Dialog } from 'quasar';
import { boot } from 'quasar/wrappers';


export default boot(({ Vue }) => {

  Vue.use(VueCompositionApi);

});
