import patientsData from '../../data/patients'
import { NonSensitivePatient, NewPatient, Patient, NewEntry, Entry } from '../types'
import { v4 as uuidv4 } from 'uuid';


const getPatients = (): NonSensitivePatient[] => {
    return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }))
};

const getPatient = (id: string): Patient | undefined => {
    return patientsData.find(p => p.id === id)
}

const addPatient = (patient: NewPatient): Patient => {
    const newPatient = {
        id: uuidv4(),
        ...patient
    };

    patientsData.push(newPatient);
    return newPatient;
}

const addEntry = (id: string, entry: NewEntry ): Entry => {
    const newEntry = {
        id: uuidv4(),
        ...entry
    };

    patientsData.find(p => p.id === id)?.entries.push(newEntry);
    return newEntry;
}

export default {
    getPatients,
    getPatient,
    addPatient,
    addEntry
};