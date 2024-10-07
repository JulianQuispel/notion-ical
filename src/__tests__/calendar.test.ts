import {convertItemsToEvents, generateCalendar} from '../utils/calendar';
import items from '../__mocks__/items';

const createEventMock = jest.fn().mockImplementation();
jest.mock('ical-generator', () => {
  return jest.fn().mockImplementation(() => {
    return {
      createEvent: createEventMock,
    };
  });
});

function generateMockEvents(amount: number) {
  const events = [];
  for (let i = 0; i < amount; i++) {
    events.push({
      title: `Event ${i + 1}`,
      startDate: new Date(`2024-01-01T0${i + 1}:00:00.000Z`),
      endDate: new Date(`2024-01-01T0${i + 2}:00:00.000Z`),
      allDay: false,
    });
  }
  return events;
}

it('converts database items to events', () => {
  const events = convertItemsToEvents(items);

  expect(events).toStrictEqual([
    {
      title: 'Test 1',
      startDate: new Date('2024-01-01T01:00:00.000Z'),
      endDate: new Date('2024-01-01T02:00:00.000Z'),
      allDay: false,
    },
  ]);
});

it('turns every item into an event', () => {
  const events = generateMockEvents(3);

  generateCalendar('test', events);

  expect(createEventMock).toHaveBeenCalledTimes(3);
});
