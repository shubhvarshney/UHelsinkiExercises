import express from 'express';
import diagnosesRouter from './routes/diagnoses'
import patientsRouter from './routes/patients'

const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.use('/diagnoses', diagnosesRouter);
app.use('/patients', patientsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});