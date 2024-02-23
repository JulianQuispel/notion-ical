import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {convertItemsToEvents, getDateFromProperty} from '../src/notion';

test('it gets date from date property', () => {
  expect(
    getDateFromProperty({
      type: 'date',
      date: {
        start: '2024-01-01T01:00:00.000Z',
        end: '2024-01-01T02:00:00.000Z',
        time_zone: 'Europe/Amsterdam',
      },
      id: '123',
    })
  ).toStrictEqual({
    start: '2024-01-01T01:00:00.000Z',
    end: '2024-01-01T02:00:00.000Z',
    time_zone: 'Europe/Amsterdam',
  });
});

test('it gets null if no date', () => {
  expect(
    getDateFromProperty({
      type: 'date',
      date: null,
      id: '123',
    })
  ).toBeNull();
});

test('it gets date from formula property', () => {
  expect(
    getDateFromProperty({
      type: 'formula',
      formula: {
        type: 'date',
        date: {
          start: '2024-01-01T01:00:00.000Z',
          end: '2024-01-01T02:00:00.000Z',
          time_zone: 'Europe/Amsterdam',
        },
      },
      id: '123',
    })
  ).toStrictEqual({
    start: '2024-01-01T01:00:00.000Z',
    end: '2024-01-01T02:00:00.000Z',
    time_zone: 'Europe/Amsterdam',
  });
});

test('it gets null from formula if no date', () => {
  expect(
    getDateFromProperty({
      type: 'formula',
      formula: {
        type: 'date',
        date: null,
      },
      id: '123',
    })
  ).toBeNull();
});

test('it converts database items to events', () => {
  const items: PageObjectResponse[] = [
    {
      id: '1',
      url: '',
      parent: {type: 'database_id', database_id: '1'},
      cover: null,
      icon: null,
      object: 'page',
      archived: false,
      created_by: {
        id: '1',
        object: 'user',
      },
      last_edited_by: {
        id: '1',
        object: 'user',
      },
      created_time: '2024-01-01T01:00:00.000Z',
      last_edited_time: '2024-01-01T01:00:00.000Z',
      properties: {
        Name: {
          type: 'title',
          id: '1',
          title: [
            {
              plain_text: 'Test',
              type: 'text',
              href: null,
              text: {
                content: 'Test',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
        Date: {
          type: 'date',
          id: '1',
          date: {
            start: '2024-01-01T01:00:00.000Z',
            end: '2024-01-01T02:00:00.000Z',
            time_zone: 'Europe/Amsterdam',
          },
        },
      },
    },
  ];

  const events = convertItemsToEvents(items);

  expect(events).toStrictEqual([
    {
      title: 'Test',
      startDate: new Date('2024-01-01T01:00:00.000Z'),
      endDate: new Date('2024-01-01T02:00:00.000Z'),
      allDay: false,
    },
  ]);
});
