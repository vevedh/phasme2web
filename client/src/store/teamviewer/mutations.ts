import { MutationTree } from 'vuex';
import { TeamViewerStateInterface } from './state';

const mutation: MutationTree<TeamViewerStateInterface> = {
  changeUsers ( state: TeamViewerStateInterface, payload) {
    // your code
    state.users = payload
  }
};

export default mutation;
