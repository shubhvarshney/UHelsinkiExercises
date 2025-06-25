import axios from 'axios';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = '/api/diaries';

export const getAllDiaryEntries = () => {
    return axios
        .get<DiaryEntry[]>(baseUrl)
        .then(response => response.data);
};

export const addDiaryEntry = (newDiaryEntry: NewDiaryEntry) => {
    return axios
        .post<DiaryEntry>(baseUrl, newDiaryEntry)
        .then(response => response.data);
};