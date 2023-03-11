
const forever = require('forever');
//console.log("Home :",process.env.USERPROFILE)
//forever.load(process.env.USERPROFILE+"/.forever/config.json")


var args = process.argv;

if (args.length <= 2) {
  forever.list(false, function(err, data) {
      if (err) {
        console.log('Error running `forever.list()`');
        console.log(err);
      }

      console.log('Data returned from `forever.list()`');
      console.dir(data);
      //res.json(data)
  });
} else {

  if (args[2] == 'clearlogs') {
    forever.cleanLogsSync()
    console.log('Logs files clear !')
  }

  if (args[2] == 'restart') {
    forever.list(false, function(err, data) {
        if (err) {
          console.log('Error running `forever.list()`');
          console.log(err);
        }


        //console.dir(data);
        if (Array.isArray(data)) {
          procid = data.filter(elt => elt.uid == args[3]);
          console.dir(procid);
        }
        if (procid[0].file) {
          console.log("Fichier :",procid[0].file);
          forever.restart(procid[0].uid, true);
        }
        //res.json(data)
    });

  }


  if (args[2] == 'stopall') {
    forever.stopAll( function(err,data) {
      if (err) {
        console.log('Error running `forever.stopAll()`');
        console.log(err);
      }
      console.log("Tous les jobs sont arretés !")
    })
  }
}




