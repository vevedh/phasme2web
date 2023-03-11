


/* eslint-disable no-unused-vars */
exports.LdapSearch = class LdapSearch {


  constructor (options,app) {
    this.options = options || {};
    this.ldapSearch = (filter) => {

      const configuration = app.get('authentication').ldap;
      const client = app.get('ldapClient');
      const decodeSearchEntry = require('../../decodeSearchEntry');

      if (client.connected) {
        try {
          client.undind();
        } catch (error) {
          console.log('End search');
        }

      }

      if (!client.connected) {
        client.bind(configuration.bindDN, configuration.bindCredentials, (err, res) => {
          if (err) {
            console.log('Echec auth-sso de connexion ldap !');
          }
          if (res) {
            console.log('Connexion auth-sso ldap etablie avec succès!');
          }
        });
      }

      var opts = {
      //  filter: '(objectClass=*)',  //simple search
      //  filter: '(&(uid=2)(sn=John))',// and search
        filter: filter, // '(&(samAccountType=805306368)(!(sn=Exchange))(mail=*))',//'(|(uid=*)(sAMAccountName=*))',//'(|(uid=2)(sn=John)(cn=Smith))', // or search
        scope: 'sub',
        sizeLimit: 3000,
        paged: true,
      //attributes: adMap.filter(elt => attribs.includes(elt.ad)).map(obj => (obj.ld))
      };

      return new Promise((resolve, reject) => {
        if (!Date.fromLDAPString) {
          Date.fromLDAPString = function (s) {
            var b = s.match(/\d\d/g);
            return new Date(Date.UTC(b[0] + b[1], b[2] - 1, b[3], b[4], b[5], b[6]));
          };
        }

        var values = [];
        client.search(configuration.searchBase, opts, (err, resp) => {
          if (err) {
            console.log('Error in search ' + err);
          } else {
            resp.on('searchEntry', (entry) => {
            //console.log('entry: ' + JSON.stringify(entry.object));
              values.push(entry);
            });
            resp.on('searchReference', (referral) => {
              console.log('referral: ' + referral.uris.join());
            });
            resp.on('error', (err) => {
              console.error('error: ' + err.message);
              // reject(err);
            });
            resp.on('end', () => {
              client.unbind();
              // console.log('status: ' + result.status);

              // res.json(values);
              let value;
              if (values && values.length > 0) {
                value = [];
                values.forEach(elt => {
                  value.push(decodeSearchEntry(elt));
                });
                //value = decodeSearchEntry(values[0]);
              } else {
                value = {};
              }
              //console.log('Ldap search result :',value);
              resolve(value);
            });
          }
        });

      });
    };
  }

  async find (params) {
    if (params.query) {
      let search = await this.ldapSearch(params.query);
      return search;
    } else {
      return [];
    }

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
