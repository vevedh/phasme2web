/* eslint-disable no-unused-vars */
const axios = require('axios');
const { reject } = require('bluebird');
const query = require('query');
const logger = require('../../logger');

exports.Simtickets = class Simtickets {
  constructor (options,app) {
    this.options = options || {};
    this.app = app;
    //this.path = path;
    //this.params = app.params;
  }

  async find (params) {
    let result;

    var data = '';

    var config = {
      method: 'get',
      url: 'http://svrsimplydesk.agglo.local:4000/IncidentManagement.svc/GetOpenTickets?p=0&datemin=2020-01-01',
      headers: {
        Authorization: 'Basic aGRlY2hhdmlnbnk6ZEBuWmVsITc3',
      },
      data: data,
    };

    return new Promise((resolve,reject)=>{
      axios(config)
        .then((response) => {
          logger.info(JSON.stringify(response.data));
          result = response.data;
          if (params.query) {
            console.log('Query :', params.query);
            result = query.query(result, params.query);
          }
          resolve(result);
        })
        .catch((error) => {
          logger.info(error);
          reject([]);
        });
    });    
    
    
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
