
const CHEST_ID = 0;
const BACK_ID = 1;
const SHOULDERS_ID = 2;
const TRICEPS_ID = 3;
const BICEPS_ID = 4;
const LEGS_ID = 5;

export const muscleGroups = [
    { name: "Chest", id: CHEST_ID },
    { name: "Back", id: BACK_ID },
    { name: "Shoulders", id: SHOULDERS_ID },
    { name: "Triceps", id: TRICEPS_ID },
    { name: "Biceps", id: BICEPS_ID },
    { name: "Legs", id: LEGS_ID },
]

const chestExercises = [
    { name: "Bench press", id: 0 },
    { name: "Inclined bench press", id: 1 },
    { name: "Fly / Pec dec", id: 2 },
    { name: "Chest press machine", id: 3 },
    { name: "Dumbell press", id: 38 },
    { name: "Inclined press", id: 46 },
]

const backExercises = [
    { name: "Pull ups", id: 4 },
    { name: "Pull downs", id: 5 },
    { name: "Chest supported row", id: 6 },
    { name: "Single arm row", id: 39 },
    { name: "Pull overs", id: 7 },
    { name: "Reverse Fly", id: 10 },
    { name: "Lat prayers", id: 24 },
]

const shoulderExercises = [
    { name: "Lateral Raises", id: 8 },
    { name: "Shoulder Press", id: 9 },
    { name: "Upright Rows", id: 40 },
]

const tricepsExercises = [
    { name: "Skull crushers", id: 11 },
    { name: "Triceps pushdowns", id: 12 },
    { name: "Close Grip press", id: 23 },
    { name: "Dips Machine", id: 27 },
]

const bicepsExercises = [
    { name: "Ez bar curls", id: 13 },
    { name: "Incline curls", id: 14 },
    { name: "Preacher curls", id: 42 },
    { name: "Dumbell curls", id: 43 },
    { name: "Underhand pull downs", id: 15 },
    { name: "Hammer curls", id: 35 },
    { name: "Shrugs", id: 36 },
    { name: "Reverse curls", id: 37 },
]

const legsExercises = [
    { name: "Barbell squat", id: 16 },
    { name: "Hack squat", id: 17 },
    { name: "Sumo squat", id: 33 },
    { name: "Deadlift", id: 26 },
    { name: "Sumo deadlift", id: 41 },
    { name: "RDL", id: 30 },
    { name: "Deficit Deadlift", id: 28 },
    { name: "Back elevated lunges", id: 18 },
    { name: "Front elevated lunges", id: 29 },
    { name: "Leg Press", id: 34 },
    { name: "Hip thrust", id: 19 },
    { name: "Knee extension", id: 20 },
    { name: "Knee flexion", id: 21 },
    { name: "Calf raises", id: 22 },
    { name: "Good Girl", id: 31 },
    { name: "Bad Girl", id: 32 },
    { name: "Kickbacks", id: 44 },
    { name: "Lunges", id: 45 },
]

export const exercises = chestExercises.concat(backExercises, shoulderExercises, tricepsExercises, bicepsExercises, legsExercises);

export const exercisesPerMuscle = [
    { id: CHEST_ID, exercises: chestExercises.map(ex => ex.id) },
    { id: BACK_ID, exercises: backExercises.map(ex => ex.id) },
    { id: SHOULDERS_ID, exercises: shoulderExercises.map(ex => ex.id) },
    { id: TRICEPS_ID, exercises: tricepsExercises.map(ex => ex.id) },
    { id: BICEPS_ID, exercises: bicepsExercises.map(ex => ex.id) },
    { id: LEGS_ID, exercises: legsExercises.map(ex => ex.id) }
]