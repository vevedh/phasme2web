const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const {
  errorHandler
} = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const authentication = require('./authentication')
const jetpack = require('fs-jetpack')
const os = require('os')
const blobService = require('feathers-blob')
const fs = require('fs-blob-store')
const multer = require('multer')
const multipartMiddleware = multer()
const dauria = require('dauria')
const history = require('connect-history-api-fallback')

const {
  sso
} = require('node-expose-sspi');


const blobStorage = fs(__dirname + '/uploads')

const publicStorage = fs(__dirname + '/public/assets')

const mongodb = require('./mongodb')


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
//app.use(history());
// Enable security, CORS, compression, favicon and body parsing
app.set('trust proxy', true);
app.use(helmet({
  contentSecurityPolicy: false
}));
//app.use(cors());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  //origin: req.headers.origin,
  optionsSuccessStatus: 204
}))

app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public') , 'favicon.ico')));//+ __dirname , '../favicon.ico')
// Host the public folder
app.use('/', express.static(app.get('public')));

const subApps = [];

const newSubApp = (base,srcfolder) => {
  let objApp = express(feathers());
  // Load app configuration
  objApp.configure(configuration());
  //app.use(history());
  // Enable security, CORS, compression, favicon and body parsing
  objApp.set('trust proxy', true);
  objApp.use(helmet({
    contentSecurityPolicy: false
  }));
  //app.use(cors());

  objApp.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
    //origin: req.headers.origin,
    optionsSuccessStatus: 204
  }))

  objApp.use(compress());
  objApp.use(express.json());
  objApp.use(express.urlencoded({ extended: true }));
  //objApp.use(favicon(path.join(app.get('public') , 'favicon.ico')));//+ __dirname , '../favicon.ico')
  // Host the public folder
  objApp.use(base, srcfolder);

  app.use(base,objApp)
  subApps.push(objApp)

}

//************/
if (jetpack.exists(`${process.cwd()}/users`)) {
  let lstusers = jetpack.list(`${process.cwd()}/users`)
  for (let index = 0; index < lstusers.length; index++) {
    let userfolder = lstusers[index];
    if (jetpack.exists(`${process.cwd()}/users/${userfolder}/default/site`) == 'dir') {
      //app.use(`/docs/${userfolder}`, express.static(`${process.cwd()}/users/${userfolder}/default/site`));
      newSubApp(`/docs/${userfolder}`, express.static(`${process.cwd()}/users/${userfolder}/default/site`))

    }
    if (jetpack.exists(`${process.cwd()}/users/${userfolder}`) == 'dir') {
      let lstdocsusers = jetpack.list(`${process.cwd()}/users/${userfolder}`).filter(elt => (String(elt) != 'default'));
      logger.info(`liste des dossiers utilisateur ${userfolder} :%j`, lstdocsusers);
      for (let j = 0; j < lstdocsusers.length; j++) {
        let docsuser = lstdocsusers[j];
        logger.info(`Site   :/docs/${userfolder}/${docsuser}   ->  ${process.cwd()}/users/${userfolder}/${docsuser}/site`)
        let sitepath = `/docs/${userfolder}/${docsuser}`;
        let fpath = `${process.cwd()}/users/${userfolder}/${docsuser}/site`
        app.use(sitepath, express.static(fpath));
        logger.info(`Site :${sitepath}`)
      }
    }
  }
} else {
  jetpack.dir(`${process.cwd()}/users`)
}
// console.log("Serveur web racine :",app.get('public'))
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
app.set('nb_ensites', 0);
app.set('nb_sites', 0);
if (app.get('prj_folder') && (app.get('prj_folder') != '') && (jetpack.exists(app.get('prj_folder')) == 'dir')) {
  this.projList = jetpack.list(app.get('prj_folder')); // [];
  var nbensites = 0;

  app.set('nb_sites', this.projList.length);
  for (let index = 0; index < this.projList.length; index++) {
    const projetName = this.projList[index];


    if ((jetpack.exists(`${app.get('prj_folder')}/${projetName}/www`) == 'dir') && !(jetpack.exists(`${app.get('prj_folder')}/${projetName}/site`) == 'dir')) {
      nbensites++;

      app.use(`/${projetName}`, express.static(`${app.get('prj_folder')}/${projetName}/www`));
      logger.info("Path to project source : %s", `${app.get('prj_folder')}/${projetName}/www`)
      app.get(`/${projetName}/*`, (req, res) => {


        if (!jetpack.exists(req.url)) {
          logger.info("Path to project : %s", req.url)
          req.next()
        }
        /*res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        })*/
        //res.redirect(`/${projetName}/`);
        //res.sendFile(`${app.get('prj_folder')}`+req.url.replace(`/${projetName}/`,`/${projetName}/www/`));
        /*if (req.url != 'docs') {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
          })
          res.sendFile(`${app.get('prj_folder')}`+req.url.replace(`/${projetName}/`,`/${projetName}/www/`));

        }*/


      })
    }
    if ((jetpack.exists(`${app.get('prj_folder')}/${projetName}/site`) == 'dir') && !(jetpack.exists(`${app.get('prj_folder')}/${projetName}/www`) == 'dir')) {
      nbensites++;
      app.use(`/${projetName}/docs/`, express.static(`${app.get('prj_folder')}/${projetName}/site`));
      app.get(`/${projetName}/docs/*`, (req, res) => {
        logger.info("Path to : %s", req.url)
        /*res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        })*/
        res.sendFile(`./${projetName}/site/doc/*`, {
          root: __dirname
        });
        //res.redirect(`/${projetName}/`);
        //.sendFile(`${app.get('prj_folder')}/` + req.url.replace(`/${projetName}/`,`/${projetName}/www/`));
      })
    }
  }
  app.set('nb_ensites', nbensites);
}


//****************/

// Set up Plugins and providers
app.configure(express.rest());
app.use(
  sso.auth()
);

app.use((req, res, next) => {
  req.feathers.url = req.url

  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Auth-Token')
  res.header('Content-Type: text/javascript; charset=utf8')
  res.header('Content-Type: text/html; charset=utf8')

  res.header('ContentSecurityPolicy: upgrade-insecure-requests')

  next()
})

app.configure(socketio({
  transports: ['polling', 'websocket'],
  pingInterval: 100000,
  pingTimeout: 500000,
  timeOut: 50000
}, (io) => {
  io.sockets.setMaxListeners(0);


}));
  //socketio());

app.configure(mongodb)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
//app.use(express.notFound());
//app.use(express.errorHandler({ logger }));
app.use(errorHandler({
  html: function (error, req, res, next) {
    // render your error view with the error object
    res.render('error', error)
  }
}))

app.use(errorHandler({
  html: {
    404: '/',
    500: '/login'
  }
}))


/************************************************************************************************ */
/*	Upload	Service	with	multipart	support */
app.use('/uploads',
  //	multer	parses	the	file	named	'uri'.
  //	Without	extra	params	the	data	is
  //	temporarely	kept	in	memory
  multipartMiddleware.single('uri'),
  //	another	middleware,	this	time	to
  //	transfer	the	received	file	to	feathers
  (req, res, next) => {
    req.feathers.file = req.file
    next()
  },
  blobService({
    Model: blobStorage
  })
)

app.use('/pubupload', multipartMiddleware.single('image'), (req, res, next) => {
    req.feathers.file = req.file
    next()
  },
  blobService({
    Model: publicStorage
  })
)

app.service('/uploads').hooks({
  before: {
    create: [
      async (context) => {
        if (!context.data.uri && context.params.file) {
          const file = context.params.file
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype)
          context.data = {
            uri: uri
          }
        }
      }
    ]
  }

})

// ------------------------------------------------------------------

// Configure a middleware for 404s and the error handler
// app.use(express.notFound())
// app.use(express.errorHandler({ logger }))
app.use(history());
app.set('platform', os.platform())

logger.info('PLATFORM : ' + app.get('platform'))

/**************************************************************** */

app.hooks(appHooks);

module.exports = app;
