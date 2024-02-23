import {Client, isFullPage} from '@notionhq/client';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {Event} from './types';
import {dateIncludesTime, getEndDate} from './utils/date';

const notion = new Client({auth: process.env.NOTION_KEY});

export async function getItemsFromDatabase(databaseId: string) {
  const pages = [];
  let cursor: string | undefined = undefined;
  let hasMore = false;

  do {
    const {results, next_cursor, has_more}: QueryDatabaseResponse =
      await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
      });

    cursor = next_cursor === null ? undefined : next_cursor;

    pages.push(...results.filter(isFullPage));

    hasMore = has_more;
  } while (hasMore);

  return pages;
}

export function getDateFromProperty(
  property: PageObjectResponse['properties'][0]
) {
  if (property.type === 'date' && property.date !== null) {
    return property.date;
  }

  if (
    property.type === 'formula' &&
    property.formula.type === 'date' &&
    property.formula.date !== null
  )
    return property.formula.date;

  return null;
}

export function convertItemsToEvents(
  items: PageObjectResponse[],
  datePropertyName = 'Date'
) {
  const tasks: Event[] = [];

  for (const item of items) {
    const title = (
      item.properties['Name'] as {
        type: 'title';
        title: Array<RichTextItemResponse>;
        id: string;
      }
    ).title[0].plain_text;

    const date = getDateFromProperty(item.properties[datePropertyName]);

    if (!date) continue;

    const allDay = !dateIncludesTime(date['start']);
    const startDate = new Date(date['start']);
    const endDate = getEndDate(date['end'], date['start'], allDay);

    tasks.push({title, startDate, endDate, allDay});
  }

  return tasks;
}
