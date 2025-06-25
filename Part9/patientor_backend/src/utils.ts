import { NewPatient, Gender, Entry, Diagnosis, HealthCheckRating, Discharge, NewEntry, SickLeave } from './types';
import { z } from 'zod'

const newPatientSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    dateOfBirth: z.string().date(),
    gender: z.nativeEnum(Gender),
    ssn: z.string(),
})

export const toNewPatient = (object: unknown): NewPatient => {
    return { ...newPatientSchema.parse(object), entries: new Array<Entry> };
}

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
}

const parseType = (type: unknown): string => {
    if ( !type || !isString(type) ) {
        throw new Error('Incorrect or missing type');
    }

    return type;
}

const parseDescription = (description: unknown): string => {
    if ( !description || !isString(description) ) {
        throw new Error('Incorrect or missing description');
    }

    return description;
}

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
}

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date');
    }
    return date;
}

const parseSpecialist = (specialist: unknown): string => {
    if ( !specialist || !isString(specialist) ) {
        throw new Error('Incorrect or missing specialist');
    }

    return specialist;
}

const parseDiagnosisCodes = (object: unknown):
    Array<Diagnosis['code']> => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        return [] as Array<Diagnosis['code']>;
    }
    
    return object.diagnosisCodes as Array<Diagnosis['code']>;
}

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).map(v => Number(v)).includes(param);
}

const parseHealthCheckRating = (rating: unknown): number => {
    if ( isNaN(Number(rating)) || !isHealthCheckRating(Number(rating))) {
        throw new Error('Incorrect or missing rating');
    }

    return Number(rating);
}


const parseEmployerName = (employerName: unknown): string => {
    if ( !employerName || !isString(employerName) ) {
        throw new Error('Incorrect or missing specialist');
    }

    return employerName;
}

const parseDischarge = (discharge: unknown): Discharge => {
    if (
        !discharge || typeof discharge !== 'object' || !('date' in discharge) || !('criteria' in discharge)
    ) {
        throw new Error('Incorrect or missing discharge');
    }
    
    const d = discharge as { date: unknown; criteria: unknown };

    if (!isString(d.date) || !isString(d.criteria)) {
        throw new Error('Invalid discharge field types');
    }

    return {
        date: d.date,
        criteria: d.criteria,
    };
}

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
    if (!sickLeave) {
        return;
    }
    if (sickLeave && typeof sickLeave === 'object' && ('startDate' in sickLeave) && ('endDate' in sickLeave) && isString(sickLeave.startDate) && isDate(sickLeave.startDate) && isString(sickLeave.endDate) && isDate(sickLeave.endDate)) {
        return sickLeave as SickLeave;
    } else {
        throw new Error('Invalid sick leave');
    }
}

export const toNewEntry = (object: unknown): NewEntry => {
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
    }

    let type = null;
    if ('type' in object) {
        type = parseType(object.type);
    } else {
        throw new Error('Incorrect data: type of entry is missing');
    }

    if (type === 'HealthCheck') {
        if ('description' in object && 'date' in object && 'specialist' in object && 'healthCheckRating' in object) {
            const newEntry: NewEntry = {
                type: type,
                description: parseDescription(object.description),
                date: parseDate(object.date),
                specialist: parseSpecialist(object.specialist),
                healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
                diagnosisCodes: parseDiagnosisCodes(object)
            };

            return newEntry;
        } else {
            throw new Error('Incorrect data: some fields are missing');
        }
    } else if (type === 'OccupationalHealthcare') {
        if ('description' in object && 'date' in object && 'specialist' in object && 'employerName' in object) {
            if ('sickLeave' in object) {
                const newEntry: NewEntry = {
                    type: type,
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    employerName: parseEmployerName(object.employerName),
                    sickLeave: parseSickLeave(object.sickLeave),
                    diagnosisCodes: parseDiagnosisCodes(object)
                };

                return newEntry;
            } else {
                const newEntry: NewEntry = {
                    type: type,
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    employerName: parseEmployerName(object.employerName),
                    diagnosisCodes: parseDiagnosisCodes(object)
                };

                return newEntry;
            }

            
        } else {
            throw new Error('Incorrect data: some fields are missing');
        }
    } else if (type === 'Hospital') {
        if ('description' in object && 'date' in object && 'specialist' in object && 'discharge' in object) {
            const newEntry: NewEntry = {
                type: type,
                description: parseDescription(object.description),
                date: parseDate(object.date),
                specialist: parseSpecialist(object.specialist),
                discharge: parseDischarge(object.discharge),
                diagnosisCodes: parseDiagnosisCodes(object)
            };

            return newEntry;
        } else {
            throw new Error('Incorrect data: some fields are missing');
        }

    } else {
        throw new Error('Invalid type')
    }
}
