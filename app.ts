import express from 'express';
import router from './src/routes/router';

const app = express();

app.use(express.json());
app.use(router);

const server = app.listen(process.env.PORT??3000, () => {
    console.log(`server listen on port ${server.address().port}`);
});