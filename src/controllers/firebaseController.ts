import {Request, Response} from "express";

const admin = require("firebase-admin");

export class FirebaseController {

    constructor() { 
        this.initFirebase();
    }

    initFirebase() {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.PROJECT_ID,
                clientEmail: process.env. CLIENT_EMAIL,
                privateKey: process.env.PRIVATE_KEY,
            }),
            databaseURL: process.env.DATABASE_URL,
        });
    }

    static getUser(req:Request, res:Response){

        if(req.body.email){
            const data = {
                code:'400',
                error:"Missing email",
            };
            res.status(500).json(data);
            return;
        }

        admin.auth().getUserByEmail(req.body.email)
        .then((response:any) => {
            const data = {
                uid : response.uid,
                datos : {
                    email : response.email,
                    nombre : response.displayName,
                    foto : response.photoURL,
                    telefono : response.phoneNumber,
                },
                estados : {
                    emailVerificado : response.emailVerified,
                    suspendido : response.disabled,
                },
                tiempos : {
                    ultimoLogin : response.metadata.lastSignInTime,
                    ultimoUpdate : response.metadata.creationTime,
                },
                code:'200',
                message:`Datos del usuario ${response.displayName}`
            };

            res.status(200)
            .json(data);
        })
        .catch((error:any) => {
            const data = {
                code:'400',
                error:error,
            };
            res.status(404)
            .json(data);
        });
    }

    static createUser(req:Request, res:Response){
        const email    = req.body.email??false;
        const nombre   = req.body.name??false;
        const phone    = req.body.phone??false;
        const password = req.body.password??false;

        if(!email || !nombre || !phone || !password){
            res
                .status(500)
                .json("Missing data");
            return;
        }else{

            admin.auth().createUser({
                email: email,
                emailVerified: false,
                phoneNumber: phone,
                password: password,
                displayName: nombre,
                photoURL: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/user-male-circle-blue-512.png",
                disabled: false
            })
            .then((userRecord:any)=> {
                const data = {
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
                    message:`Usuario ${userRecord.displayName} creado Exitosamente`
                };

                res
                    .status(200)
                    .json(data);
                })
            .catch((error:any)=> {
            res
                .status(404)
                .json(error);
            });
        }
    
    }


}