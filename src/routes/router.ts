import express, {Request, Response} from 'express';
import { FirebaseController } from '../controllers/firebaseController';


const router = express.Router();

router.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
})

router.post('/get-user', FirebaseController.getUser);

router.post('new-user', FirebaseController.createUser);

export default router;