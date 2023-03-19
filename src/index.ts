import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {Client, isFullPage} from '@notionhq/client';
import {RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints';
import ical from 'ical-generator';
import {add, isValid} from 'date-fns';

dotenv.config();

const app: Express = express();
const notion = new Client({auth: process.env.NOTION_KEY});
const port = process.env.PORT || 3000;
const databaseId = process.env.NOTION_DATABASE_ID as string;

app.get('/', async (req: Request, res: Response) => {
  getTasksFromDatabase().then(cal => cal.serve(res));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

async function getTasksFromDatabase() {
  const pages = [];
  let cursor: any = undefined;
  const hasMore = false;

  do {
    const {results, next_cursor} = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    cursor = next_cursor;

    pages.push(...results);
  } while (hasMore);

  const cal = ical({name: 'Notion tasks'});
  for (const page of pages) {
    if (!isFullPage(page)) continue;

    const pageId = page.id;

    const title = (
      page.properties['Name'] as {
        type: 'title';
        title: Array<RichTextItemResponse>;
        id: string;
      }
    ).title[0].plain_text;
    const date = page.properties['Date'] as {
      type: 'date';
      date: any;
      id: string;
    };
    const startDate = date.date['start'] as string;
    const allDay = !startDate.includes('T');
    let endDate = new Date(date.date['end']);

    if (!isValid(endDate))
      endDate = add(new Date(startDate), {
        hours: 1,
      });

    if (allDay) endDate = add(endDate, {days: 1});

    cal.createEvent({
      summary: title,
      start: new Date(startDate),
      end: new Date(endDate),
      allDay,
    });
  }

  return cal;
}
