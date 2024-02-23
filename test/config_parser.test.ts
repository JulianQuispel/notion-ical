import {parseConfig} from '../src/utils/config_parser';

const configNoProperties = `
calendars:
  tasks:
    name: Tasks
    database_id: 63138270427139784081265724046142
    properties:
`;

const configNoDateProperty = `
calendars:
  tasks:
    name: Tasks
    database_id: 63138270427139784081265724046142
    properties:
`;

const config = `
calendars:
  tasks:
    name: Tasks
    database_id: 63138270427139784081265724046142
    properties:
      date: Date
  workouts:
    name: Workouts
    database_id: 39804639019819613784449002869425
    properties:
      date: Date
`;

test('parseConfig throws Error when config is invalid', () => {
  expect(() => parseConfig('')).toThrow("Didn't find calendar configuration");
  expect(() => parseConfig(configNoProperties)).toThrow(
    'Improper configuration for calendar tasks'
  );
  expect(() => parseConfig(configNoDateProperty)).toThrow(
    'Improper configuration for calendar tasks'
  );
});

test('parseConfig parses correctly when config is valid', () => {
  expect(() => parseConfig(config)).not.toThrow();
  expect(parseConfig(config)).not.toBeNull();
});
