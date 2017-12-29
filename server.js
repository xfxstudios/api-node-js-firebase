var express = require('express')  
var http = require('http')  
var app = express()  
var bodyParser = require("body-parser")
var methodOverride  = require("method-override")
var port = process.env.PORT || 3000

app.use(express.static('public/'))

  var admin = require("firebase-admin");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "PROJECT ID",
        clientEmail: "CLIENTE EMAIL",
        privateKey: "PRIVATE KEY",
      }),
      databaseURL: "FIREBASE DATABASE URL",
    });

  //Ruta Directa
  /*var router = express.Router();
  router.get('/', function(req, res) {
    res.send("HITCEL Test Server");
  });
  app.use(router);*/


    //Peticion de datos de Usuario
    var prueba = express.Router();
    prueba.get('/getUser/:id', function(req, res) {
        var email = req.params.id;
        //var email = 'a@a.com';
        admin.auth().getUserByEmail(email)
          .then(function(userRecord) {
              var data = {
                  uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
              console.log("Error fetching user data:", error);
              res.status(404).jsonp(error);
          });
    });
    app.use(prueba);


    //Crear un Usuario
    var crear = express.Router();
    crear.post('/addUser/:email/:phone/:password/:name', function(req, res) {
        var email    = req.params.email;
        var nombre   = req.params.name;
        var phone    = req.params.phone;
        var password = req.params.password;
        
        admin.auth().createUser({
            email: email,
            emailVerified: false,
            phoneNumber: phone,
            password: password,
            displayName: nombre,
            photoURL: "http://www.example.com/12345678/photo.png",
            disabled: false
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                datos : {
                  email : userRecord.email,
                  nombre : userRecord.displayName,
                  foto : userRecord.photoURL,
                  telefono : userRecord.phoneNumber,
                },
                estados : {
                  emailVerificado : userRecord.emailVerified,
                  suspendido : userRecord.disabled,
                },
                tiempos : {
                  ultimoLogin : userRecord.metadata.lastSignInTime,
                  ultimoUpdate : userRecord.metadata.creationTime,
                }
              }
            res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(crear);


    //Crear un Usuario UID Personalizado
    var crearuid = express.Router();
    crearuid.post('/addUserUid/:email/:phone/:password/:name/:uid', function(req, res) {
        var email    = req.params.email;
        var nombre   = req.params.name;
        var phone    = req.params.phone;
        var password = req.params.password;
        var uid = req.params.uid;
        
        admin.auth().createUser({
            uid: uid,
            email: email,
            emailVerified: false,
            phoneNumber: phone,
            password: password,
            displayName: nombre,
            photoURL: "http://www.example.com/12345678/photo.png",
            disabled: false
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                datos : {
                  email : userRecord.email,
                  nombre : userRecord.displayName,
                  foto : userRecord.photoURL,
                  telefono : userRecord.phoneNumber,
                },
                estados : {
                  emailVerificado : userRecord.emailVerified,
                  suspendido : userRecord.disabled,
                },
                tiempos : {
                  ultimoLogin : userRecord.metadata.lastSignInTime,
                  ultimoUpdate : userRecord.metadata.creationTime,
                }
              }
            res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(crearuid);
    
    
    
    //Actualiza Telefono y Nombre de un Usuario en Firebase
    var updateuid = express.Router();
    updateuid.put('/updateUserUid/:uid/:phone/:name', function(req, res) {
        
        var uid = req.params.uid;
        var phone    = req.params.phone;
        var nombre   = req.params.name;
        
        admin.auth().updateUser(uid, {
            phoneNumber: phone,
            displayName: nombre,
            disabled: false
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateuid);
    
    
    //Actualiza Email de un Usuario
    var updateemail = express.Router();
    updateemail.put('/updateUserEmail/:uid/:email', function(req, res) {
        
        var uid   = req.params.uid;
        var email = req.params.email;
        
        admin.auth().updateUser(uid, {
            email: email,
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateemail);


    //Verifica Email de un Usuario
    var validatemail = express.Router();
    validatemail.put('/validateUserEmail/:uid', function(req, res) {
        
        var uid   = req.params.uid;
        
        admin.auth().updateUser(uid, {
            emailVerified: true,
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(validatemail);


    //Actualiza Foto de un Usuario
    var updateFoto = express.Router();
    updateFoto.put('/updateUserPhoto/:uid/:photo', function(req, res) {
        
        var uid   = req.params.uid;
        var photo = req.params.photo;
        
        admin.auth().updateUser(uid, {
            photoURL: photo,
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateFoto);


    //Actualiza Clave de un Usuario
    var updatePass = express.Router();
    updatePass.put('/updateUserPhoto/:uid/:pass', function(req, res) {
        
        var uid   = req.params.uid;
        var pass = req.params.pass;
        
        admin.auth().updateUser(uid, {
            password: pass,
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                    telefono : userRecord.phoneNumber,
                  },
                  estados : {
                    emailVerificado : userRecord.emailVerified,
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updatePass);
    
    
    //Suspende un Usuario por su UID
    var suspenduid = express.Router();
    suspenduid.put('/suspendUser/:uid', function(req, res) {
        
        var uid = req.params.uid;
        
        admin.auth().updateUser(uid, {
            disabled: true
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                  },
                  estados : {
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoLogin : userRecord.metadata.lastSignInTime,
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(suspenduid);
    
    
    //Activar un Usuario por su UID
    var activeuid = express.Router();
    activeuid.put('/activateUser/:uid', function(req, res) {
        
        var uid = req.params.uid;
        
        admin.auth().updateUser(uid, {
            disabled: false
          })
          .then(function(userRecord) {
            var data = {
              uid : userRecord.uid,
                  datos : {
                    email : userRecord.email,
                    nombre : userRecord.displayName,
                    foto : userRecord.photoURL,
                  },
                  estados : {
                    suspendido : userRecord.disabled,
                  },
                  tiempos : {
                    ultimoUpdate : userRecord.metadata.creationTime,
                  }
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(activeuid);

     //Eliminar un Usuario
     var deletUser = express.Router();
     deletUser.delete('/deleteUser/:uid', function(req, res) {
         
         var uid = req.params.uid;
         admin.auth().deleteUser(uid)
        .then(function() {
          var data = {
                code:'200',
                message:'User Success Delete'
            }
          res.status(200).jsonp(data);
        })
        .catch(function(error) {
          res.status(404).jsonp(error);
        });
         
     });
     app.use(deletUser);




var server = http.createServer(app).listen(port, function() {  
  console.log('Express server listening on port ' + port);
});