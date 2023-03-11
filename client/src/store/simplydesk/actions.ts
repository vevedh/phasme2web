
import { ActionTree } from 'vuex';

import axios from "axios";
import feathersClient from "src/boot/feathers-client";
import { SimplyDeskStateInterface } from './state';

const actions: ActionTree<SimplyDeskStateInterface, any> = {
  async getSimplyUsers(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/CustomerManagement.svc/GetUsers?p=1&datemin=2020-01-01&datemax=2020-10-01',{headers:httpOptions})

    console.log("Utilisateurs simplydesk :",results.data)
    context.commit('changeUsers',results.data)
  },
  async getSimplyIncidents(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetLinkedTicketCatgoriesByTicketTypeID?ticketTypeId=5f4cba96-6438-4afe-89a9-10b566125b30',{headers:httpOptions})

    console.log("Incidents simplydesk :",results.data)
    context.commit('changeIncidents',results.data)
  },
  async getSimplyTickets(context,params) {
    console.log("Tickets simplydesk :",params)
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    const rtickets = await axios.get(`http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetLinkedTicketCatgoriesByTicketTypeID?ticketTypeId=${params}`,{headers:httpOptions})

    console.log("Tickets simplydesk :",rtickets.data)
    context.commit('changeTickets',rtickets.data)
  },
  async getSimplyOpenTickets(context) {
    
    // your code
    /*let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    const rtickets = await axios.get(`http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetOpenTickets?p=0&datemin=2020-01-01`,{headers:httpOptions})

    console.log("Tickets ouverts simplydesk :",rtickets.data)*/
    const rtickets = await feathersClient.service('simtickets').find({});
    //context.commit('changeOpenTickets',rtickets.data)
    context.commit('changeOpenTickets',rtickets)
  },
  async getSimplyClosedTickets(context) {
   
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    const rtickets = await axios.get(`http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetClosedTickets?p=0&datemin=2020-01-01`,{headers:httpOptions})

    console.log("Tickets clos simplydesk :",rtickets.data)
    context.commit('changeClosedTickets',rtickets.data)
  },
  async getSimplyTypes(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTicketTypes',{headers:httpOptions})

    console.log("Tickets Types simplydesk :",results.data)
    context.commit('changeTypes',results.data)
  },
  async getSimplyServices(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTeam',{headers:httpOptions})

    console.log("Services simplydesk :",results.data)
    context.commit('changeServices',results.data)
  },
  async getSimplyAgents(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllHelpdeskAgents',{headers:httpOptions})

    console.log("Agents simplydesk :",results.data)
    context.commit('changeAgents',results.data)
  },
  async getSimplyCategories(context) {
    // your code
    let httpOptions = {

        'Content-Type': 'application/json',
        'Authorization': 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3'

    };
    let results = await axios.get('http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetAllTicketCategories',{headers:httpOptions})

    console.log("Categories simplydesk :",results.data)
    context.commit('changeCategories',results.data)
  }
};

export default actions;
