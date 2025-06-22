import { NewPatient, Gender } from './types';
import { z } from 'zod'

const newPatientSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    dateOfBirth: z.string().date(),
    gender: z.nativeEnum(Gender),
    ssn: z.string()
})

const toNewPatient = (object: unknown): NewPatient => {
    return newPatientSchema.parse(object);
}

export default toNewPatient;