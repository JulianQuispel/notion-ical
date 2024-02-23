import formatISO from 'date-fns/formatISO';
import {dateIncludesTime, getEndDate} from '../src/utils/date';

test('date including time returns true', () => {
  expect(dateIncludesTime('2024-01-01T01:00:00.000Z')).toBe(true);
});

test('date not including time returns false', () => {
  expect(dateIncludesTime('2024-01-01')).toBe(false);
});

test('getEndDate returns next hour if no endDate and not allDay', () => {
  const endDate = formatISO(
    getEndDate(null, '2024-01-01T01:00:00.000Z', false)
  );

  expect(endDate).toBe(formatISO(new Date('2024-01-01T02:00:00.000Z')));
});

test('getEndDate returns next day if no endDate and allDay', () => {
  const endDate = formatISO(getEndDate(null, '2024-01-01T01:00:00.000Z', true));

  expect(endDate).toBe(formatISO(new Date('2024-01-02T01:00:00.000Z')));
});

test('getEndDate returns endDate if endDate is provided', () => {
  const endDate = formatISO(
    getEndDate('2024-01-03T12:00:00.000Z', '2024-01-01T09:00:00.000Z', true)
  );

  expect(endDate).toBe(formatISO(new Date('2024-01-03T12:00:00.000Z')));
});
