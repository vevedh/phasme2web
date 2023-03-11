export interface SimplyDeskStateInterface {
  users: Array<any>;
  tickets: Array<any>;
  openTickets: Array<any>;
  closedTickets: Array<any>;
  incidents: Array<any>;
  types:Array<any>;
  services: Array<any>;
  agents: Array<any>;
  categories: Array<any>;
}

function state(): SimplyDeskStateInterface {
  return {
    users: [],
    tickets: [],
    openTickets: [],
    closedTickets: [],
    incidents: [],
    types:[],
    services:[],
    agents:[],
    categories:[]
  };
}

export default state;
