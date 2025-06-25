import React, { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import { useMatch } from 'react-router-dom';
import type { Patient, Diagnosis, EntryFormValues } from '../../types';
import { Typography, Button, TextField, Select, MenuItem, InputLabel, Alert, Input } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import WorkIcon from '@mui/icons-material/Work'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import FavoriteIcon from '@mui/icons-material/Favorite'
import axios from 'axios'

const PatientInfo = () => {

    const [patient, setPatient] = useState<Patient | null>(null);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
    const [open, setOpen] = useState(false);
    const [entry, setEntry] = useState('HealthCheck');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
    const [employerName, setEmployerName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dischargeDate, setDischargeDate] = useState('');
    const [criteria, setCriteria] = useState('');
    const [error, setError] = useState('');

    const match = useMatch('/patients/:id');
    
      useEffect(() => {
        const fetchPatient = async (id: string) => {
          const patient = await patientService.getOne(id);
          setPatient(patient)
        }
        if (match?.params.id) {
          try {
            fetchPatient(match.params.id)
          } catch (error) {
            console.error(error)
          }
        }
      }, [match])

      useEffect(() => {
        const fetchDiagnoses = async () => {
          const diagnoses = await diagnosisService.getAll();
          setDiagnoses(diagnoses)
        }
        fetchDiagnoses();
      }, [])

    const assertNever = (value: never): never => {
      throw new Error (
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };

    const handleEntryAdd = async (event: React.SyntheticEvent) => {
      event.preventDefault();
      if (!patient) {
        return;
      }

      let entryObject: EntryFormValues;

      if (entry === "HealthCheck") {
        entryObject = {
            type: "HealthCheck",
            description,
            date,
            specialist,
            healthCheckRating,
        }
      } else if (entry === "OccupationalHealthcare") {
        entryObject = {
            type: "OccupationalHealthcare",
            description,
            date,
            specialist,
            employerName,
        } 

        if (startDate.length > 0 || endDate.length > 0) {
          entryObject = { ...entryObject, sickLeave: { startDate, endDate } }
        }

      } else if (entry === "Hospital") {
          entryObject = {
            type: "Hospital",
            description,
            date,
            specialist,
            discharge: { date: dischargeDate, criteria },
          } 
        } else {
          return;
        }
      
      if (diagnosisCodes.length > 0) {
        entryObject = { ...entryObject, diagnosisCodes }
      }

      try {
          const newEntry = await patientService.addEntry(patient.id, entryObject)
          setDescription('');
          setDate('');
          setSpecialist('');
          setHealthCheckRating(0);
          setDiagnosisCodes([]);
          setOpen(false);
          setEmployerName('');
          setStartDate('');
          setEndDate('');
          setDischargeDate('');
          setCriteria('');

          if (patient && newEntry) {
            setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
          }
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            if (e?.response?.data && typeof e?.response?.data === "string") {
                const message = e.response.data.replace('Something went wrong. Error: ', '');
                console.error(message);
                setError(message);
                } else {
                  setError("Unrecognized axios error");
                }
                setTimeout(() => {
                  setError('');
                }, 5000);
            }
          }
    };

    const handleCancel = () => {
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating(0);
      setDiagnosisCodes([]);
      setOpen(false);
      setEmployerName('');
      setStartDate('');
      setEndDate('');
      setDischargeDate('');
      setCriteria('');
    }

    if (!patient) {
      return null
    }

    return (
        <div>
            <div> 
                {error && <Alert style={{ marginTop: 10 }}severity="error">{error}</Alert>}
                <Typography sx={{ mt: 2 }} variant="h4">
                        <b style={{ marginRight: 5 }}>{patient.name}</b>
                        {patient.gender === 'male' ?
                            <MaleIcon />
                        : patient.gender === 'female' ? 
                            <FemaleIcon /> 
                        : <TransgenderIcon />
                        }
                    </Typography>
                    <p>
                        ssn: {patient.ssn}
                        <br/>
                        occupation: {patient.occupation}
                    </p>
                    {open &&
                      <div>
                        <InputLabel style={{ marginTop: 20 }}>Select Entry</InputLabel>
                        <Select style={{ marginBottom: 20 }} fullWidth label="Entry Type" value={entry} onChange={({target}) => setEntry(target.value)}>
                          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
                          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                          <MenuItem value="Hospital">Hospital</MenuItem>
                        </Select>
                      <form onSubmit={handleEntryAdd}>
                        <div style={{ borderStyle: "dashed", borderWidth: "2px", padding: "10px" }}>
                          <h4>New {entry === "HealthCheck" && "Health Check"} {entry === "OccupationalHealthcare" && "Occupational Healthcare"} {entry === "Hospital" && "Hospital"} Entry</h4>
                          <TextField style={{ marginBottom: 20 }} fullWidth label='Description' value={description} onChange={({target}) => setDescription(target.value)}/>
                          <InputLabel>Date</InputLabel>
                          <Input type='date' fullWidth style={{ marginBottom: 20 }} value={date} onChange={({target}) => setDate(target.value)}/>
                          <TextField style={{ marginBottom: 20 }} fullWidth label='Specialist' value={specialist} onChange={({target}) => setSpecialist(target.value)}/>
                        
                        {entry === 'HealthCheck' && 
                          <div>
                            <InputLabel>Health Check Rating</InputLabel>
                            <Input type='number' style={{ marginBottom: 20 }} fullWidth value={healthCheckRating} onChange={({target}) => setHealthCheckRating(Number(target.value))}/>
                          </div>
                        }

                        {entry === 'OccupationalHealthcare' && 
                          <div>
                            <TextField style={{ marginBottom: 20 }} fullWidth label='Employer Name' value={employerName} onChange={({target}) => setEmployerName(target.value)}/>
                            <div>
                              <InputLabel style={{ marginBottom: 20 }}>Sick Leave</InputLabel>
                              <InputLabel style={{ marginLeft: 10 }}>Start Date</InputLabel>
                              <Input type='date' style={{ marginLeft: 10, width: '98%', marginBottom: 20 }} value={startDate} onChange={({target}) => setStartDate(target.value)}/>
                              <InputLabel style={{ marginLeft: 10 }}>End Date</InputLabel>
                              <Input type='date' style={{ marginLeft: 10, width: '98%', marginRight: 40, marginBottom: 20 }} value={endDate} onChange={({target}) => setEndDate(target.value)}/>
                            </div>
                          </div>
                        }

                        {entry === 'Hospital' && 
                          <div>
                            <div>
                              <InputLabel style={{ marginBottom: 20 }}>Discharge</InputLabel>
                              <InputLabel style={{ marginLeft: 10 }}>Date</InputLabel>
                              <Input type='date' style={{ marginLeft: 10, width: '98%', marginBottom: 20 }} fullWidth value={dischargeDate} onChange={({target}) => setDischargeDate(target.value)}/>
                              <TextField style={{ marginLeft: 10, width: '98%', marginBottom: 20 }} fullWidth label='Criteria' value={criteria} onChange={({target}) => setCriteria(target.value)}/>
                            </div>
                          </div>
                        }
                          <InputLabel>Select Diagnosis Codes</InputLabel>
                          <Select fullWidth multiple label='Diagnosis Codes' value={diagnosisCodes} onChange={({target}) => typeof target.value === 'string' ? setDiagnosisCodes(diagnosisCodes.concat(target.value)) : setDiagnosisCodes(target.value)}>
                            {diagnoses?.map(d => 
                              <MenuItem key={d.code} value={d.code}>{d.code}: {d.name}</MenuItem>
                            )}
                          </Select>
                          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                            <Button style={{ backgroundColor: "red" }} variant='contained' type='button' onClick={handleCancel} >Cancel</Button>
                            <Button variant='contained' type='submit'>Add</Button>
                          </div>
                        </div>
                      </form>
                      </div>
                    }
                    <Typography sx={{ mt: 2, mb: 2 }} variant="h5">
                      <b>entries</b>
                    </Typography>
                    {patient.entries.map(e => {
                      switch (e.type) {
                        case ('Hospital'):
                          return (
                            <div style={{ borderColor: "#000000", borderStyle: "solid", borderWidth: "2px", borderRadius: "10px", padding: "10px", marginBottom: "10px" }} key={e.id}>
                              <p>
                                {e.date} <LocalHospitalIcon />
                              </p>
                              <p>
                                <em>{e.description}</em>
                              </p>
                              <ul>
                                {e.diagnosisCodes && e.diagnosisCodes.map(c => 
                                  <li key={c}>{c} {diagnoses?.find(d => d.code === c)?.name}</li>
                                )}
                              </ul>
                              <p>discharged: {e.discharge.date}. criteria: {e.discharge.criteria}</p>
                              <p>diagnosed by {e.specialist}</p>
                            </div>
                          )
                        case ('OccupationalHealthcare'):
                          return (
                            <div style={{ borderColor: "#000000", borderStyle: "solid", borderWidth: "2px", borderRadius: "10px", padding: "10px", marginBottom: "10px" }} key={e.id}>
                              <p>
                                {e.date} <WorkIcon />
                              </p>
                              <p>
                                <em>{e.description}</em>
                              </p>
                              <ul>
                                {e.diagnosisCodes && e.diagnosisCodes.map(c => 
                                  <li key={c}>{c} {diagnoses?.find(d => d.code === c)?.name}</li>
                                )}
                              </ul>
                              <p>diagnosed by {e.specialist}</p>
                            </div>
                          )
                        case ('HealthCheck'):
                          return (
                            <div style={{ borderColor: "#000000", borderStyle: "solid", borderWidth: "2px", borderRadius: "10px", padding: "10px", marginBottom: "10px" }} key={e.id}>
                              <p>
                                {e.date} <MedicalServicesIcon />
                              </p>
                              <p>
                                <em>{e.description}</em>
                              </p>
                              <ul>
                                {e.diagnosisCodes && e.diagnosisCodes.map(c => 
                                  <li key={c}>{c} {diagnoses?.find(d => d.code === c)?.name}</li>
                                )}
                              </ul>
                              <div>
                                {e.healthCheckRating === 0 ? 
                                <FavoriteIcon sx={{ color: "green" }} />
                                : e.healthCheckRating === 1 ? 
                                <FavoriteIcon sx={{ color: "yellow" }} />
                                : e.healthCheckRating === 2 ?
                                <FavoriteIcon sx={{ color: "orange" }} />
                                : e.healthCheckRating === 3 ?
                                <FavoriteIcon sx={{ color: "red" }} />
                                : null
                                }
                              </div>
                              <p>diagnosed by {e.specialist}</p>
                            </div>
                          )
                        default:
                          return assertNever(e);
                      }
                    })}
                </div>
                <Button onClick={() => setOpen(true)} variant="contained">Add New Entry</Button>
        </div>
    )
}

export default PatientInfo