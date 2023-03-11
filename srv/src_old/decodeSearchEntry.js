const base64js = require('base64-js');
function formatGuid(data) {
  var format = '{3}{2}{1}{0}-{5}{4}-{7}{6}-{8}{9}-{10}{11}{12}{13}{14}{15}';
  for (var i = 0; i < data.length; i++) {
    var re = new RegExp('\\{' + i + '\\}', 'g');
    // Leading 0 is needed if value of data[i] is less than 16 (of 10 as hex).
    var dataStr = data[i].toString(16);
    format = format.replace(re, data[i] >= 16 ? dataStr : '0' + dataStr);
  }
  return format;
}

module.exports = function(entry) {
  var obj = {
    dn: entry.dn.toString(),
    controls: []
  };

  entry.attributes.forEach(function (a) {
    var buf = a.buffers;
    var val = a.vals;
    var item;
    let thumbNail;

    switch (a.type) {
    case 'thumbnailPhoto':
      item = buf;//buf.toString('base64');//buf;//base64js.fromByteArray(buf.toString('base64'));//Buffer.from(buf,'base64');//.toString('base64');
      thumbNail = a._vals[0].toString('base64');
      obj.img64 = thumbNail;
      break;
    case 'accountExpires':
      // new Date(n/1e4 - 1.16444736e13);
      item = (new Date(Number(String(buf.slice()).match(/\d/g).join('')) / 1e4 - 1.16444736e13)).toLocaleString('fr-FR');
      break;
    case 'whenChanged':

      item = (new Date(Date.fromLDAPString(String(buf.slice())))).toLocaleString('fr-FR');
      break;
    case 'modifyTimeStamp':
      item = (new Date(Date.fromLDAPString(String(buf.slice())))).toLocaleString('fr-FR');
      break;
    case 'whenCreated':
      item = (new Date(Date.fromLDAPString(String(buf.slice())))).toLocaleString('fr-FR');
      break;
    case 'objectGUID':
      item = formatGuid(buf[0]);
      break;
    default:
      item = val;
    }

    if (item && item.length) {
      if (item.length > 1) {
        obj[a.type] = item.slice();
      } else {
        obj[a.type] = item[0];
      }
    } else {
      obj[a.type] = [];
    }
  });

  entry.controls.forEach(function (element) {
    obj.controls.push(element.json);
  });

  return obj;
};
