let userId = 1;
let workoutId = 1;

export const createUser = () => ({ id: ++userId, name: `User ${userId}`, email: `user${userId}@example.com` });
export const createWorkout = () => ({ id: ++workoutId, title: `Workout ${workoutId}`, duration: 60 });
export const createEntity = () => ({ id: ++userId, name: `Entity ${userId}` });