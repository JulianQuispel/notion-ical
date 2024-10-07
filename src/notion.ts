import {Client, isFullPage} from '@notionhq/client';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({auth: process.env.NOTION_KEY});

export async function getItemsFromDatabase(
  databaseId: string,
  modifiedSince: Date
) {
  const pages = [];
  let cursor: string | undefined = undefined;
  let hasMore = false;

  do {
    const {results, next_cursor, has_more}: QueryDatabaseResponse =
      await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        filter: {
          last_edited_time: {
            after: modifiedSince.toISOString(),
          },
          timestamp: 'last_edited_time',
          type: 'last_edited_time',
        },
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
