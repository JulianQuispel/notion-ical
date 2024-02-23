import YAML from 'yaml';
import {Config} from '../types';

export function parseConfig(file: string) {
  const config = YAML.parse(file) as Config;

  if (!config || !('calendars' in config))
    throw new Error("Didn't find calendar configuration");

  for (const calendarKey in config.calendars) {
    const calendar = config.calendars[calendarKey];
    if (
      !('properties' in calendar) ||
      calendar.properties === null ||
      !('date' in calendar.properties)
    )
      throw new Error(`Improper configuration for calendar ${calendarKey}`);
  }

  return config;
}
