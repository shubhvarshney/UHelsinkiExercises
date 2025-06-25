import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';
import { z } from 'zod'

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const patient = patientService.getPatient(id)
    res.json(patient);
    if (!patient) {
        res.status(404).send({ error: "patient not found" })
    }
})

router.post('/', (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).send(error.issues[0].message);
            console.log(error.issues)
        } else if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('unknown error');
        }
    }
});

router.post('/:id/entries', (req, res) => {
    const id = req.params.id
    try {
        const newEntry = toNewEntry(req.body);
        const addedEntry = patientService.addEntry(id, newEntry);
        res.json(addedEntry);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
            res.status(400).send(error.message)
        }
    }
})

export default router;