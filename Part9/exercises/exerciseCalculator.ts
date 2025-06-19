interface ExercisesValues {
    target: number;
    hours: number[];
}


const parseArgumentsExercises = (args: string[]): ExercisesValues => {
    if (args.length < 4) throw new Error('Not enough arguments');

    if (!isNaN(Number(args[2]))) {
        const target = Number(args[2]);
        const hours = [];
        for (let i = 3; i < args.length; i++) {
            if (!isNaN(Number(args[i]))) {
                hours.push(Number(args[i]));
            } else {
                throw new Error('Provided values were not numbers!');
            }
        }

        return ({
            target,
            hours
        });
    
    } else {
        throw new Error('Provided values were not numbers!');
    }
};


interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;

}

const calculateExercises = (target: number, hours: number[]): Result => {
    const periodLength = hours.length;
    const totalHours = hours.reduce((a, b) => a + b, 0);
    const trainingDays = hours.filter((a) => a !== 0).length;
    const average = totalHours / hours.length;
    let success = false;
    let rating = 1;
    let ratingDescription = 'not the best but the next time will be better';
    if (average >= target) {
        success = true;
        rating = 3;
        ratingDescription = 'you met your target so let\'s keep going!';
    } else if (target - average < 1) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }

    return ({
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    });
};


if (require.main === module) {
    try {
    const { target, hours } = parseArgumentsExercises(process.argv);
    console.log(calculateExercises(target, hours));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message;
        } 
        console.log(errorMessage);
    }
}

export default { calculateExercises };