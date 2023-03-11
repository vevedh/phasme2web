const jetpack = require('fs-jetpack');
const path = require('path');
const mjml2html = require('mjml');
/* eslint-disable no-unused-vars */
exports.Mjml = class Mjml {
  constructor(options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find(params) {
    params.query = {};
    return new Promise((resolve, reject) => {
      /*var conf = jetpack.read(path.resolve('./config/default.json'), 'utf8');
      console.log('Config :', conf);
      if (conf) {
        resolve(JSON.parse(conf));
      } else {
        reject('error');
      }*/
      resolve({});
    });
  }

  async get(id, params) {
    console.log('------------------------------------------------ MJML :', id);
    console.log('---------------------------------------------------------',mjml2html(id).html);
    return  mjml2html(id).html;
  }

  async create(data, params) {


    return  mjml2html(data).html;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
