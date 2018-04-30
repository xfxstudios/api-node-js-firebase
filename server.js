var express = require('express');
var app = express();
var path = require('path');
var admin = require("firebase-admin");

app.use(express.static(path.join(__dirname, 'public')));

  var admin = require("firebase-admin");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "PROJECT ID",
        clientEmail: "CLIENTE EMAIL",
        privateKey: "PRIVATE KEY",
      }),
      databaseURL: "FIREBASE DATABASE URL",
    });


//Peticion de datos de Usuario por Email
//Request of User data by Email
app.get('/getUser/:id', function(req, res) {
  var email = req.params.id;

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
            },
            code:'200',
            message:'Datos del usuario ' + userRecord.displayName
          }
        res
          .status(200)
          .json(data);
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
        res
          .status(404)
          .json(error);
    });
});

//Crear un Usuario
//Create a User
app.post('/addUser/:email/:phone/:password/:name', function(req, res) {
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
      photoURL: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-male-circle-blue-512.png",
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
          },
          code:'200',
          message:'Usuario '+userRecord.displayName+' Creado Exitosamente'
        }
      res
          .status(200)
          .json(data);
    })
    .catch(function(error) {
      res
          .status(404)
          .json(error);
    });
});

//Crear un Usuario UID Personalizado
//Create a Custom UID User
app.post('/addUserUid/:email/:phone/:password/:name/:uid', function(req, res) {
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
      photoURL: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-male-circle-blue-512.png",
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
          },
          code:'200',
          message:'Usuario '+userRecord.displayName+' Creado extosamente'
        }
      res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Actualiza Telefono y Nombre de un Usuario en Firebase
//Update Phone and User Name in Firebase
app.put('/updateUserUid/:uid/:phone/:name', function(req, res) {
      
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
            },
            code:'200',
            message:''
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Actualiza Email de un Usuario
//Update a User's Email
app.put('/updateUserEmail/:uid/:email', function(req, res) {
      
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
            },
            code:'200',
            message:'Email del usuario '+userRecord.displayName+' Actualizado'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Verifica Email de un Usuario
//Verify a User's Email
app.put('/validateUserEmail/:uid', function(req, res) {
      
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
            },
            code:'200',
            message:'Email del usuario '+userRecord.displayName+' validado'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Actualiza Foto de un Usuario
//Update a User's Photo
app.put('/updateUserPhoto/:uid/:photo', function(req, res) {
      
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
            },
            code:'200',
            message:'Foto del Usuario '+userRecord.displayName+' Actualizada'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});


//Actualiza Clave de un Usuario
//Update a User's Password
app.put('/updateUserPassword/:uid/:pass', function(req, res) {
      
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
            },
            code:'200',
            message:'Clave del Usuario '+userRecord.displayName+' actualizada'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});


//Suspende un Usuario por su UID
//Suspend a User for his UID
app.put('/suspendUser/:uid', function(req, res) {
      
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
            },
            code:'200',
            message:'El usuario '+userRecord.displayName+' ha sido suspendido'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Activar un Usuario por su UID
//Activate a User by his UID
app.put('/activateUser/:uid', function(req, res) {
      
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
            },
            code:'200',
            message:'El usuario '+userRecord.displayName+' ha sido reactivado'
          }
        res.status(200).json(data);
    })
    .catch(function(error) {
      res.status(404).json(error);
    });
});

//Eliminar un Usuario
//Delete a User
app.delete('/deleteUser/:uid', function(req, res) {
       
  var uid = req.params.uid;
  
  admin.auth().deleteUser(uid)
 .then(function() {
   var data = {
         code:'200',
         message:'El Usuario ha Sido Eliminado'
     }
   res.status(200).json(data);
 })
 .catch(function(error) {
   res.status(404).json(error);
 });
});


var server = app.listen(process.env.PORT || 3000, function () {
var port = server.address().port;
console.log("Express is working on port " + port);
});