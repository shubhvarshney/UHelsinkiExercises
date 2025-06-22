import patientsData from '../../data/patients'
import { PatientsNoSSN, NewPatient, Patient } from '../types'
import { v4 as uuidv4 } from 'uuid';


const getPatients = (): PatientsNoSSN[] => {
    return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }))
};

const addPatient = (patient: NewPatient): Patient => {
    const newPatient = {
        id: uuidv4(),
        ...patient
    };

    patientsData.push(newPatient);
    return newPatient;
}

export default {
    getPatients,
    addPatient
};