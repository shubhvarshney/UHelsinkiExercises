import express from 'express';
import bmiCalculator from './bmiCalculator';
import exerciseCalculator from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = req.query.height;
    const weight = req.query.weight;
    
    if (height && weight) {
        if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
            res.json({
                weight: Number(weight),
                height: Number(height),
                bmi: bmiCalculator.calculateBmi(Number(height), Number(weight))
            });
        } else {
            res.status(400).json({ error: 'malformatted parameters' }).end();
        }
    } else {
        res.status(400).json({ error: 'parameters missing'}).end();
    }
});

app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body;

    if (daily_exercises || target) {
        if (!isNaN(Number(target)) && Array.isArray(daily_exercises) && daily_exercises.every((i) => typeof i === 'number')) {
            const result = exerciseCalculator.calculateExercises( target, daily_exercises );
            res.json(result);
        } else {
            res.status(400).json({ error: 'malformatted parameters' }).end();
        }    
    } else {
        res.status(400).json({ error: 'parameters missing' }).end();
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});