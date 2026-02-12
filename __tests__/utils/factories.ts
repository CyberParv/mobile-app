export function createUser(overrides = {}) {
  return {
    id: 1,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    ...overrides
  };
}

export function createWorkout(overrides = {}) {
  return {
    id: 1,
    title: 'Morning Run',
    duration: 30,
    ...overrides
  };
}

export function createEntity(overrides = {}) {
  return {
    id: 1,
    name: 'Entity Name',
    ...overrides
  };
}