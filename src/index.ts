import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {Client, isFullPage} from '@notionhq/client';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import ical from 'ical-generator';
import {add, isValid} from 'date-fns';
import {Task} from './types';

dotenv.config();

const app: Express = express();
const notion = new Client({auth: process.env.NOTION_KEY});
const port = process.env.PORT || 3000;
const databaseId = process.env.NOTION_DATABASE_ID!;

app.get('/', async (req: Request, res: Response) => {
  const tasks = await getTasksFromDatabase();
  const cal = getCalendar('Notion tasks', tasks);
  cal.serve(res);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`);
});

async function getTasksFromDatabase() {
  const pages: (PageObjectResponse | PartialPageObjectResponse)[] = [];
  let cursor: string | undefined = undefined;
  let hasMore = false;

  do {
    const {results, next_cursor} = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    cursor = next_cursor === null ? undefined : next_cursor;

    pages.push(...results);

    hasMore = results.length > 0;
  } while (hasMore);

  const tasks: Task[] = [];

  for (const page of pages) {
    if (!isFullPage(page)) continue;

    const title = (
      page.properties['Name'] as {
        type: 'title';
        title: Array<RichTextItemResponse>;
        id: string;
      }
    ).title[0].plain_text;

    const date = page.properties['Date'];

    if (date.type !== 'date' || date.date === null) continue;

    const allDay = isAllDay(date.date['start']);
    const startDate = new Date(date.date['start']);
    const endDate = getEndDate(date.date['end'], date.date['start'], allDay);

    tasks.push({title, startDate, endDate, allDay});
  }

  return tasks;
}

function getCalendar(name: string, tasks: Task[]) {
  const cal = ical({name});

  tasks.forEach(({title, startDate, endDate, allDay}) => {
    cal.createEvent({
      summary: title,
      start: startDate,
      end: endDate,
      allDay,
    });
  });

  return cal;
}

const isAllDay = (startDate: string) => !startDate.includes('T');

function getEndDate(
  endDate: string | null,
  startDate: string,
  allDay: boolean
) {
  if (endDate && isValid(new Date(endDate))) return new Date(endDate);

  return add(new Date(startDate), {
    hours: 1,
    days: allDay ? 1 : 0,
  });
}
