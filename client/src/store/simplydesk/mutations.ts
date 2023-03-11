import { MutationTree } from 'vuex';
import { SimplyDeskStateInterface } from './state';

const mutation: MutationTree<SimplyDeskStateInterface> = {
  changeUsers ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.users = payload
  },
  changeServices ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.services = payload
  },
  changeAgents ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.agents = payload
  },
  changeCategories ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.categories = payload
  },
  changeTickets ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.tickets = payload
  },
  changeOpenTickets ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.openTickets = payload
  },
  changeClosedTickets ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.closedTickets = payload
  },
  changeIncidents ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.incidents = payload
  },
  changeTypes ( state: SimplyDeskStateInterface, payload) {
    // your code
    state.types = payload
  }
};

export default mutation;
