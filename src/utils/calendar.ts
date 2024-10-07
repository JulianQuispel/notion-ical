import ical from 'ical-generator';
import {Event} from '../types';
import {dateIncludesTime, getEndDate} from './date';
import {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {getDateFromProperty} from '../notion';

export function convertItemsToEvents(
  items: PageObjectResponse[],
  datePropertyName = 'Date'
) {
  return items.reduce((events, item) => {
    const title = (
      item.properties['Name'] as {
        type: 'title';
        title: Array<RichTextItemResponse>;
        id: string;
      }
    ).title[0].plain_text;

    const date = getDateFromProperty(item.properties[datePropertyName]);

    if (!date) return events;

    const allDay = !dateIncludesTime(date['start']);
    const startDate = new Date(date['start']);
    const endDate = getEndDate(date['end'], date['start'], allDay);

    events.push({title, startDate, endDate, allDay});
    return events;
  }, [] as Event[]);
}

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
