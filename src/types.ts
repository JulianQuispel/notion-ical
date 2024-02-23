export type Event = {
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
};

export type Config = {
  calendars?: Record<string, CalendarConfig>;
};

export type CalendarConfig = {
  name: string;
  database_id: string;
  properties: {
    date: string;
  };
};
