var ldap = require('ldapjs');
var decodeSearchEntry = require('./decodeSearchEntry');

var LdapLookup = module.exports = function(options) {
  this._options = options;

  this._search_query = options.search_query ||
    '(&(objectclass=user)(|(sAMAccountName={0})(UserPrincipalName={0})))';

  console.log('Search query :',this._search_query);

  this._client = ldap.createClient({
    url:             options.url,
    //maxConnections:  options.maxConnections || 10,
    bindDN:          options.bindDN,
    bindCredentials: options.bindCredentials,
    //tlsOptions:      options.tlsOptions,
    //reconnect:       options.reconnect,
    //timeout:         options.timeout,
    //connectTimeout:  options.connectTimeout,
    //idleTimeout:     options.idleTimeout
  });

  console.log('Client ldap :',this._client);

  this._client.on('error', function(e){
    // Suppress logging of ECONNRESET if ldapjs's Client will automatically reconnect.
    if (e.errno === 'ECONNRESET' && self._client.reconnect) return;

    console.log('LDAP connection error:', e);
  });

  if (this._client.connected) {
    console.log('Ldap connected :',true);
    this.clientConnected = true;
    return;
  }

  this._queue = [];
  var self = this;
  this._client.bind(options.bindDN, options.bindCredentials, function(err) {
    if(err){
      return console.log('Error binding to LDAP', 'dn: ' + err.dn + '\n code: ' + err.code + '\n message: ' + err.message);
    }
    self.clientConnected = true;
    self._queue.forEach(function (cb) { cb(); });
  });
};

LdapLookup.prototype.search = function (username, callback) {
  var self = this;
  function exec(){
    var opts = {
      scope: 'sub',
      filter: self._search_query.replace(/\{0\}/ig, username)
    };
    console.log('Base :',self._options.searchBase);
    //console.log('Option:',opts);
    self._client.search(self._options.searchBase, opts, (err, res) => {
      //console.log('User :',res);
      var entries = [];
      res.on('searchEntry', function(entry) {
        entries.push(entry);
      });
      res.on('error', function(err) {
        callback(err);
      });
      res.on('end', function() {
        if(entries.length === 0) return callback(null, null);
        callback(null, decodeSearchEntry(entries[0]));
      });
    });
  }

  if(this.clientConnected){
    exec();
  } else {
    this._queue.push(exec);
  }
};
