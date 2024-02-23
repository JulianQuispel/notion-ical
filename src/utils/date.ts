import {add, isValid} from 'date-fns';

export const dateIncludesTime = (date: string) => date.includes('T');

export function getEndDate(
  endDate: string | null,
  startDate: string,
  allDay: boolean
) {
  if (endDate && isValid(new Date(endDate))) return new Date(endDate);

  return add(new Date(startDate), {
    hours: allDay ? 0 : 1,
    days: allDay ? 1 : 0,
  });
}
