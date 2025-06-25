import { useState, useEffect } from 'react';
import type { DiaryEntry } from './types';
import { getAllDiaryEntries, addDiaryEntry } from './services/diaryService';
import axios from 'axios';

const App = () => {

  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiaries(data);
    })
  }, [])

  const diaryEntryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryEntryToAdd = {
      date,
      visibility,
      weather,
      comment
    };
    addDiaryEntry(diaryEntryToAdd)
      .then(data => {
        setDiaries(diaries.concat(data))
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(error.response.data)
            setTimeout(() => {
              setError('')
            }, 5000)
          } else {
            console.error(error)
          }
        } else {
          console.error(error)
        }
      });
    setDate('');
    setVisibility('');
    setWeather('');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error.length > 0 ? 
        <p style={{ color: "red" }}>{error}</p>
        : null
      }
      <form onSubmit={diaryEntryCreation}>
        <div>
          date
          <input type="date" value={date} onChange={({ target }) => setDate(target.value)}/>
        </div>
        <div>
          visibility
          great
          <input name="visibility" type="radio" value="great" onChange={({ target }) => setVisibility(target.value)}/>
          good
          <input name="visibility" type="radio" value="good" onChange={({ target }) => setVisibility(target.value)}/>
          ok
          <input name="visibility" type="radio" value="ok" onChange={({ target }) => setVisibility(target.value)} checked/>
          poor
          <input name="visibility" type="radio" value="poor" onChange={({ target }) => setVisibility(target.value)}/>
        </div>
        <div>
          weather
          sunny
          <input name="weather" type="radio" value="sunny" onChange={({ target }) => setWeather(target.value)}/>
          rainy
          <input name="weather" type="radio" value="rainy" onChange={({ target }) => setWeather(target.value)} checked/>
          cloudy
          <input name="weather" type="radio" value="cloudy" onChange={({ target }) => setWeather(target.value)}/>
          stormy
          <input name="weather" type="radio" value="stormy" onChange={({ target }) => setWeather(target.value)}/>
          windy
          <input name="weather" type="radio" value="windy" onChange={({ target }) => setWeather(target.value)}/>
        </div>
        <div>
          comment
          <input value={comment} onChange={({ target }) => setComment(target.value)}/>
        </div>
        <button type='submit'>
          add
        </button>

      </form>
      <h2>Diary entries</h2>
      <div>
        {diaries.map(d => (
          <div key={d.id}>
            <h3>{d.date}</h3>
            <p>
              visibility: {d.visibility}
              <br/>
              weather: {d.weather}
            </p>
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default App;
