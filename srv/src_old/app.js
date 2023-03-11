

const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const { errorHandler } = require('@feathersjs/express');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const ldap = require('./ldap');

const authentication = require('./authentication');
const jetpack = require('fs-jetpack');
const os = require('os');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const ffs = require('feathers-fs');
const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');
const history = require('connect-history-api-fallback');
const fallback = require('express-history-api-fallback');
const MongoClient = require('mongodb').MongoClient;



//const PnpNode = require("sp-pnp-node").PnpNode;
//const pnp = require("sp-pnp-js");

const blobStorage = fs(__dirname + '/uploads');

const publicStorage = fs(__dirname + '/public/assets');

const mongodb = require('./mongodb');
const powershell = require('./powershell');
const logger = require('./logger');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
//const auth_sso = require('./auth-sso');

const app = express(feathers());

const nocache = require('nocache');

app.use(nocache());

if (os.platform() === 'win32') {
  logger.info('Plaform Windows');
  logger.info(`Node version : ${process.version}`);
  const { sso } = require('node-expose-sspi');
  // configure pour l'authentication  sso sspi  uniquement sur platform windows
  app.use(sso.auth({ forceNTLM: true }));
  logger.info('Authentification SSO avec protocole sspi en NTLM actif');
} else {
  const ntlm = require('express-ntlm');
  app.use(ntlm({
    debug: function() {
      var args = Array.prototype.slice.apply(arguments);
      //console.log.apply(null, args);
    },
    domain: 'AGGLO.LOCAL',
    domaincontroller: 'ldap://agglo.local',

  }));
}


// Load app configuration
app.configure(configuration());


//app.use(auth_sso(app));
app.use(history());
// Enable security, CORS, compression, favicon and body parsing
app.set('trust proxy', true);
//app.enable('trust proxy')




// pour obliger des requetes en ssl
//app.use((req, res, next) => {
//  req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
//});

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
    //origin: req.headers.origin,
    optionsSuccessStatus: 204,
  })
);

app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'html');

if (jetpack.exists(app.get('public')) == 'dir') {
  //app.use(favicon(path.join(app.get('public'), '../favicon.ico'))); //+ __dirname , '../favicon.ico')

  // racine du dossier du site web du serveur public defini dans la configuration
  app.use('/', express.static(app.get('public')));
}


/**************
 *
 * traitement particulier  répertoire utilisateurs site de blogs utilisateurs
 *
 */
if (jetpack.exists(`${process.cwd()}/users`)) {
  let lstusers = jetpack.list(`${process.cwd()}/users`);
  for (let index = 0; index < lstusers.length; index++) {
    let userfolder = lstusers[index];
    if (
      jetpack.exists(`${process.cwd()}/users/${userfolder}/default/site`) ==
      'dir'
    ) {
      app.use(
        `/docs/${userfolder}`,
        express.static(`${process.cwd()}/users/${userfolder}/default/site`)
      );
    }
    if (jetpack.exists(`${process.cwd()}/users/${userfolder}`) == 'dir') {
      let lstdocsusers = jetpack
        .list(`${process.cwd()}/users/${userfolder}`)
        .filter((elt) => String(elt) != 'default');
      logger.info(
        `liste des dossiers utilisateur ${userfolder} :%j`,
        lstdocsusers
      );
      for (let j = 0; j < lstdocsusers.length; j++) {
        let docsuser = lstdocsusers[j];
        logger.info(
          `Site   :/docs/${userfolder}/${docsuser}   ->  ${process.cwd()}/users/${userfolder}/${docsuser}/site`
        );
        let sitepath = `/docs/${userfolder}/${docsuser}`;
        let fpath = `${process.cwd()}/users/${userfolder}/${docsuser}/site`;
        app.use(sitepath, express.static(fpath));
        logger.info(`Site :${sitepath}`);
      }
    }
  }
} else {
  jetpack.dir(`${process.cwd()}/users`);
}
logger.info('Chemin du dossier public ' + app.get('public'));

// Initialise les infos nombre de sites et nombre de sites actifs
app.set('nb_ensites', 0);
app.set('nb_sites', 0);


/**************
 *
 * TRAITEMENT de sites si le parametre de dossier de sites est défini
 *
 */
if (
  app.get('prj_folder') &&
  app.get('prj_folder') != '' &&
  jetpack.exists(app.get('prj_folder')) == 'dir'
) {
  this.projList = jetpack.list(app.get('prj_folder')); // [];
  var nbensites = 0;

  app.set('nb_sites', this.projList.length);
  for (let index = 0; index < this.projList.length; index++) {
    const projetName = this.projList[index];

    if (
      jetpack.exists(`${app.get('prj_folder')}/${projetName}/www`) == 'dir' &&
      !(jetpack.exists(`${app.get('prj_folder')}/${projetName}/site`) == 'dir')
    ) {
      nbensites++;

      //  definition du chemin static du site
      app.use(
        `/${projetName}`,
        express.static(`${app.get('prj_folder')}/${projetName}/www`)
      );
      app.use(`/${projetName}`,fallback('index.html', { root: `${app.get('prj_folder')}/${projetName}/www` }));
      logger.info(
        'Source pour site web détecté chemin : %s',
        `${app.get('prj_folder')}/${projetName}/www`
      );


    }

  }
  app.set('nb_ensites', nbensites);
}

//************************************************************************************************/

// configure le 'middleware' pour les requetes REST
app.configure(express.rest());

app.use((req, res, next) => {
  req.feathers.url = req.url;
  if (req.sso) {
    req.feathers.sso = req.sso;
    console.log('SSo memorise :', req.sso);
  }
  if (req.ntlm) {
    req.feathers.sso = req.ntlm;
    console.log('SSo ntlm :', req.ntlm);
  }

  res.header('Access-Control-Allow-Origin','*'); //req.headers.origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Auth-Token'
  );
  res.header('Content-Type: text/javascript; charset=utf8');
  res.header('Content-Type: text/html; charset=utf8');
  res.header('Cache-Control: no-cache');

  res.header('ContentSecurityPolicy: upgrade-insecure-requests');

  next();
});

/*
app.use('/authentication',(req, res, next) => {
  req.feathers.url = req.url;
  if (req.sso) {
    req.feathers.sso = req.sso;
    console.log('SSo memorise :', req.sso);
  }

  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Auth-Token'
  );
  res.header('Content-Type: text/javascript; charset=utf8');
  res.header('Content-Type: text/html; charset=utf8');

  res.header('ContentSecurityPolicy: upgrade-insecure-requests');

  next();
});
*/



app.configure(
  socketio(
    {
      transports: ['polling', 'websocket'],
      pingInterval: 100000,
      pingTimeout: 500000,
      timeOut: 50000,
    },
    (io) => {
      io.sockets.setMaxListeners(0);
    }
  )
);

app.configure(ldap);
app.configure(powershell);
app.configure(mongodb);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);

app.configure(authentication);

app.use(history());
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
//app.use(express.notFound());
//app.use(express.errorHandler({ logger }));
app.use(
  errorHandler({
    html: function (error, req, res, next) {
      // render your error view with the error object
      res.render('error', error);
      next();
    },
  })
);

app.use(
  errorHandler({
    html: {
      404: '/',
      500: '/login',
    },
  })
);

/************************************************************************************************ */
/*	Upload	Service	avec	support multipart
/*   pour chaque sites
/********************************************/
if (
  app.get('prj_folder') &&
  app.get('prj_folder') != '' &&
  jetpack.exists(app.get('prj_folder')) == 'dir'
) {
  this.projList = jetpack.list(app.get('prj_folder'));
  for (let index = 0; index < this.projList.length; index++) {
    const projetName = this.projList[index];
    if (
      jetpack.exists(`${app.get('prj_folder')}/${projetName}/www`) == 'dir' &&
      !(jetpack.exists(`${app.get('prj_folder')}/${projetName}/site`) == 'dir')
    ) {
      // definition d'une api d'upload d'images
      //  url d'upload https://localhost:3030/uploadimg/${projetName}
      //const siteStorage = fs(`${app.get("prj_folder")}/${projetName}/www`);
      app.use(
        `/uploadimg/${projetName}`,
        multipartMiddleware.single('image'),
        (req, res, next) => {
          req.feathers.file = req.file;
          next();
        },
        blobService({
          Model: fs(`${app.get('prj_folder')}/${projetName}/www`),
        })
      );
      app.service(`/uploadimg/${projetName}`).hooks({
        before: {
          create: [
            async (context) => {
              if (!context.data.uri && context.params.file) {
                const file = context.params.file;
                const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
                context.data = {
                  uri: uri,
                };
              }
            },
          ],
        },
      });
      //--------------------------------------
      // read write json file
      app.use(
        `/json_${projetName}`,
        ffs({ root: `${app.get('prj_folder')}/${projetName}/www` })
      );
      // database name by site
      const connection = 'mongodb://admcacem:Cacem972%24@localhost:27018/cacemdbdemo?authSource=admin'; //vvtool.decrypt(app.get("mongodb"));
      const database = `db_${projetName}`;
      const mongoClient = MongoClient.connect(connection, {
        useNewUrlParser: true,
      }).then((client) => client.db(database));

      app.set(`db_${projetName}`, mongoClient);
    }
  }
}

/***
 *
 */
// read write json file
app.use(
  '/json_www',
  ffs({ root: `${app.get('public')}` })
);

/**
 *   Chemin d'upload général sur serveur
 */
app.use(
  '/uploads',
  //	multer	parses	the	file	named	'uri'.
  //	Without	extra	params	the	data	is
  //	temporarely	kept	in	memory
  multipartMiddleware.single('uri'),
  //	another	middleware,	this	time	to
  //	transfer	the	received	file	to	feathers
  (req, res, next) => {
    req.feathers.file = req.file;
    next();
  },
  blobService({
    Model: blobStorage,
  })
);

app.use(
  '/pubupload',
  multipartMiddleware.single('image'),
  (req, res, next) => {
    req.feathers.file = req.file;
    next();
  },
  blobService({
    Model: publicStorage, //fs(__dirname + "/public/assets");
  })
);

app.service('/uploads').hooks({
  before: {
    create: [
      async (context) => {
        console.log('File infos:',context);
        /*if (!context.data.uri && context.params.file) {
          const file = context.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          context.data = {
            uri: uri,
          };
        }*/
      },
    ],
  },
});

// ------------------------------------------------------------------

// Configure a middleware for 404s and the error handler
// app.use(express.notFound())
// app.use(express.errorHandler({ logger }))

app.set('platform', os.platform());

/**************************************************************** */

/** Sharepoint  */
/*
const configexg = require("../config/private.config.json");
new PnpNode({
  siteUrl: "http://svrsharepoint3",
  authOptions: configexg,
})
  .init()
  .then((settings) => {
    console.log("Settings :", settings);
    // Here goes PnP JS Core code
    let web = new pnp.Web(settings.siteUrl + "/sites/DAG");

    // ... do whatever you like with PnP JS Core
    web.lists.get().then((w) => {
      //console.log(`Web Title: `, w);
      console.log(
        "Il y a au total " + w.length + " lists disponibles sur ce site"
      );
      for (var i = 0; i < w.length; i++) {
        console.log("List Title : " + w[i].Title);

        console.log("List Id    : " + w[i].Id);

        console.log("---------------------------------");
        if (w[i].Title == "Assistante_DAG") {
          web.lists
            .getByTitle("Assistante_DAG")
            .items.get()
            .then((items) => {
              console.log("Assitantes :", items);
            });
        }
      }
    });
  });
*/
app.hooks(appHooks);

module.exports = app;
