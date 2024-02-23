import ical from 'ical-generator';
import {Event} from '../types';

export function generateCalendar(name: string, events: Event[]) {
  const cal = ical({name});

  events.forEach(({title, startDate, endDate, allDay}) => {
    cal.createEvent({
      summary: title,
      start: startDate,
      end: endDate,
      allDay,
    });
  });

  return cal;
}
