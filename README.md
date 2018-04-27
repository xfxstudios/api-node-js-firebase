API NODE.JS - GOOGLE FIREBASE
==========

* Autor: __Carlos Quintero__
* Email: __[info.fxstudios&#64;gmail.com](mailto:info.fxstudios@gmail.com).

### [DONATE](https://www.paypal.me/carlos14624/10) ##

Esta API le permite desde un servidor node.js conectarse a su app firebase y administrar usuarios entre otras cosas.

This API allows you from a node.js server to connect to your firebase app and manage users among other things.




Para usar los SDK de administrador de Firebase incluidos en esta API, necesitarás un proyecto de Firebase, una cuenta de servicio para comunicarte con el servicio de Firebase y un archivo de configuración con las credenciales de tu cuenta de servicio.

To use the Firebase Administrator SDKs included in this API, you will need a Firebase project, a service account to communicate with the Firebase service, and a configuration file with the credentials of your service account.

* Navega a la pestaña [Cuentas de servicio](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?authuser=1) en la página de configuración del proyecto.

* Navigate to the tab [Cuentas de servicio](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?authuser=1) on the project settings page.



* Selecciona tu proyecto de Firebase. Si todavía no tienes uno, haz clic en Crear proyecto nuevo. Si ya tienes un proyecto de Google asociado a tu app, haz clic en Importar proyecto de Google.

* Select your Firebase project. If you do not have one yet, click Create new project. If you already have a Google project associated with your app,click on Import Google project.



* Haz clic en el botón Generar nueva clave privada en la parte inferior de la sección SDK de administrador de Firebase, en la pestaña Cuentas de servicio.

* Click the Generate new private key button at the bottom of the Firebase Administrator SDK section, under the Service Accounts tab.




Cuando hagas clic, se descargará un archivo JSON con las credenciales de tu cuenta de servicio. Lo necesitarás para inicializar el SDK en el siguiente paso.

When you click, a JSON file with the credentials of your service account will be downloaded.





> Importante: Este archivo contiene información confidencial, incluida la clave de encriptación privada de la cuenta de servicio.Protege su confidencialidad y nunca la almacenes en un repositorio público.

> Important: This file contains confidential information, including the private encryption key of the service account. Protect your confidentiality and never store it in a public repository.




Este archivo solo se genera una vez. Si esta clave se pierde o se filtra a terceros, puedes repetir las instrucciones anteriores a fin de crear una nueva clave JSON para la cuenta de servicio.

This file is only generated once. If this key is lost or filtered to third parties, you can repeat the previous instructions in order to create a new JSON key for the service account.




Una vez obtengas el archivo json, configura tu archivo __server.js__ con la data que se encuentra en tu archivo __json__.

Once you get the json file, configure your file __server.js__ with the data that is in your file __json__.

```javascript
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "PROJECT ID",//ID del Projecto en tu JSON - Project ID in your JSON
        clientEmail: "EMAIL CLIENT",//Email en tu archivo JSON -  Email to your JSON file
        privateKey: "PRIVATE KEY",//Clave Privada en tu Archivo JSON - Private Key in your JSON File 
      }),
      databaseURL: "FIREBASE DATABASE URL",//URL de tu base de datos en tu archivo JSON - URL of your database in your JSON file
    });
```



Cuando realices tu configuración puedes hacer pruebas iniciando tu servidor de esta manera

When you make your configuration you can do tests starting your server in this way

`node server.js`



La API cuenta con varias funciones preestablecidas, pero pueden crear muchas más tanto para gestión de usuarios como para manejo de base de datos.

The API has several pre-established functions, but they can create many more for both user management and database management.



Con esta API puedes __Crear un Usuario nuevo__, __Actualizar un Usuario__, __Eliminar un Usuario__, __Suspender un Usuario__, __Reactivar un Usuario__, __Buscar un Usuario por su Email__.

With this API you can __Create a new User__, __Update a User__, __Delete a User__, __Suspend a User__, __Reactivate a User__, __Search a User by Email__.



### Buscar Usuario por Email - Search User by Email ###
```javascript
    var getData = express.Router();
        getData.get('/getUser/:id', function(req, res) {
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
                    message:''
                    }
                res.status(200).jsonp(data);
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
                res.status(404).jsonp(error);
            });
        });
        app.use(getData);
```

Esta funcion recibe los parámetros de la siguiente manera:

This function receives the parameters as follows:


`http://tuserver.com/getUser/email@buscado.com`

`http://tuserver.com/getUser/email@searched.com`





Retorna un json con la información sobre el usuario, en caso de no encontrar el usuario o no existir, retorna un error, ver la [tabla de errores de firebase](https://firebase.google.com/docs/auth/admin/errors?authuser=1) para detalles sobre estos

Returns a json with the information about the user, in case of not finding the user or not existing, returns an error, see the [firebase error table](https://firebase.google.com/docs/auth/admin/errors?authuser=1) for details about these





### Crear un Usuario - Create a User ###

```javascript
ar crear = express.Router();
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
                },
                  code:'200',
                  message:''
              }
            res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(crear);
```

Esta funcion recibe 4 parametros para su creación y asigna un uid automatico al usuario creado.

This function receives 4 parameters for its creation and assigns an automatic uid to the created user.


__Ejemplo - Example__

`http://tuserver.com/addUser/EMAIL DE USUARIO/TELÉFONO DEL USUARIO/CLAVE DEL USUARIO/NOMBRE DEL USUARIO`

`http://tuserver.com/addUser/USER EMAIL/USER PHONE/USER PASSWORD/USER NAME`





Retorna un json con la información sobre el usuario, en caso de no encontrar el usuario o no existir, retorna un error, ver la [tabla de errores de firebase](https://firebase.google.com/docs/auth/admin/errors?authuser=1) para detalles sobre estos

Returns a json with the information about the user, in case of not finding the user or not existing, returns an error, see the [firebase error table](https://firebase.google.com/docs/auth/admin/errors?authuser=1) for details about these





Al igual que la anterior podemos crear el usuario pasandole el uid personalizado que queramos

Like the previous one, we can create the user by passing the custom uid that we want

```javascript
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
                },
                  code:'200',
                  message:''
              }
            res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(crearuid);
```
__Ejemplo - Example__

`http://tuserver.com/addUserUid/EMAIL DE USUARIO/TELÉFONO DEL USUARIO/CLAVE DEL USUARIO/NOMBRE DEL USUARIO/UID de USUARIO`

`http://tuserver.com/addUserUid/USER EMAIL/USER PHONE/USER PASSWORD/USER NAME/UID of USER`





# Importante - Important #

> Las funciones de __Actualziacion__, __Eliminación__, __Suspención__ y __Activación__ de un usuario se manejan solo y únicamente a través de __uid__ del usuario a aadministrar.

> The functions of __Update__, __Elimination__, __Suspension__ y __Activation__ of a user are handled only and only through __uid__ of the user to administer.





### Actualizar Nombre y Telefono de un Usuario - Update a User's Name and Phone ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateuid);
```
__Ejemplo - Example__

`http://tuserver.com/updateUserUid/Uid del Usuario/Teléfono del Usuario/Nombre del Usuario`

`http://tuserver.com/updateUserUid/User's Uid / User's Phone / User's Name`






### Actualiza Email del Usuario - Update User Email ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateemail);
```
__Ejemplo - Example__

`http://tuserver.com/updateUserEmail/Uid del Usuario/Nuevo Email`

`http://tuserver.com/updateUserEmail/User's Uid / New Email`





### Validar Email del Usuario - Validate User Email ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(validatemail);
```

__Ejemplo - Example__

`http://tuserver.com/validateUserEmail/Uid del Usuario`

`http://tuserver.com/validateUserEmail/User's Uid`





### Actualizar foto del Usuario - Update User Photo ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updateFoto);
```

__Ejemplo - Example__

`http://tuserver.com/updateUserPhoto/Uid del Usuario/URL de la Foto`

`http://tuserver.com/updateUserPhoto/User's Uid/Photo URL`





### Actualziar Clave del Usuario - Update User Password ###

```javascript
updatePass.put('/updateUserPassword/:uid/:pass', function(req, res) {
        
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
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(updatePass);
```

__Ejemplo - Example__

`http://tuserver.com/updateUserPassword/Uid del Usuario/Nueva Contraseña`

`http://tuserver.com/updateUserPassword/Uid of the User/New Password`





### Suspender un Usuario - Suspend a Users ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(suspenduid);
```

__Ejemplo - Example__

`http://tuserver.com/suspendUser/Uid del Usuario`

`http://tuserver.com/suspendUser/User's Uid`





### Activar un Usuario - Activate User ###

```javascript
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
                  },
                  code:'200',
                  message:''
                }
              res.status(200).jsonp(data);
          })
          .catch(function(error) {
            res.status(404).jsonp(error);
          });
    });
    app.use(activeuid);
```

__Ejemplo - Example__

`http://tuserver.com/activateUser/Uid del Usuario`

`http://tuserver.com/activateUser/User's Uid`





### Eliminar un Usuario - Delete User ###

```javascript
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
```

__Ejemplo - Example__

`http://tuserver.com/deleteUser/Uid del Usuario`

`http://tuserver.com/deleteUser/User's Uid`



### CABECERAS CORS - CORS HEADERS ###

Se ha agregado las cabeceras de respuesta para las peticiones cruzadas.

Added response headers for cross requests.

```javascript
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
```


> Pueden editar esta linea agregando el dominio permitido para las peticiones en caso de ser privada la api:

> You can edit this line by adding the domain allowed for requests in case of being private api:

`res.header('Access-Control-Allow-Origin', '*');`


__Ejemplo - Example__
`res.header('Access-Control-Allow-Origin', 'http://tudominio.com');`


#### Ejemplos de Conexión desde AJAX y PHP - Connection examples from AJAX and PHP ####

__Peticion simple Ajax - Simple petition Ajax__

```javascript
  var url = 'https://tuapp.com/addUser/a@a.com/+5802418474129/123456789/Your Name';
  $.post(url)
  .done(function(resp){ 
    console.log(resp);
    var B = eval('('+resp+')');
    if(B.code=="200"){
      //Success code
    } else{
      //Error code
    }
  }).fail(function(err){ 
    console.log(err);
  });
```



__Petición PHP - Petition PHP__

```php
//Registra un Usuario en Firebase a Través de la API
//Register a User in Firebase through the API
    public function addUser($X){
            $url = $this->url."addUser/".$X->user."/".$X->movil."/".$X->pass."/".str_replace(" ","%20",$X->name);
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_URL            => $url,
                CURLOPT_CUSTOMREQUEST  => 'POST',//POST, GET, PUT, DELETE
                CURLOPT_HEADER         => true,
                CURLOPT_CONNECTTIMEOUT => 120,
                CURLOPT_TIMEOUT        => 120
            ));
            $resp = curl_exec($curl);
            if(!curl_exec($curl)){
                return 'Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl);
            }
            curl_close($curl);
            $data = explode("vegur",$resp);
            $datos json_decode($data[1]);
            if($datos->code!="200"){
              return $datos->message;
            }else{
              return $datos;
            }
    }//
```



Como se menciona al inicio se pueden editar o agregar funciones que necesite para su uso o el de su app.

As mentioned at the beginning you can edit or add functions that you need for your application or your app.





De igual manera deben tener un proyecto creado en la __[Consola de Firebase](https://console.firebase.google.com/?authuser=1)__.

In the same way they must have a project created in the __[Firebase Console](https://console.firebase.google.com/?authuser=1)__.




Pueden montarse un Servidor NODE.js en la plataforma __[HEROKU](http://heroku.com)__ de manera gratuita, esta cuenta le otorga 550 horas de uso mensuales para utilizar el servidor.

A Server NODE.js can be mounted on the platform __[HEROKU](http://heroku.com)__ for free, this account gives you 550 hours of monthly use to use the server.




De igual manera la plataforma le otorga una url segura para su uso, así com las herramientas necesarias para montar su servidor de manera segura.

In the same way, the platform gives you a secure url for its use, as well as the necessary tools to mount your server safely.