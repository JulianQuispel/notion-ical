import express, {Express, Request, Response} from 'express';
import {Logger} from 'pino';
import {getItemsFromDatabase} from './notion';
import {convertItemsToEvents, generateCalendar} from './utils/calendar';
import {Config} from './types';
import {ICache} from './cache/cache';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';

const app: Express = express();
const port = process.env.PORT || 3000;

export function startServer(
  logger: Logger,
  config: Config,
  cache: ICache,
  callback: () => void
) {
  const {calendars} = config;

  app.use((req, res, next) => {
    logger.info(`A request was made to ${req.url}`);
    next();
  });

  app.get('/:calendar', async (req: Request, res: Response) => {
    if (!('calendar' in req.params) || !(req.params.calendar in calendars!)) {
      logger.warn('Calendar ${req.params.calendar} is not configured');
      res.status(404).json('Calendar not found');
      return;
    }

    const calendar = calendars![req.params.calendar];

    let items: Record<string, PageObjectResponse> = await cache.get(
      `items_${calendar.database_id}`,
      {}
    );

    const lastFetchedTimestamp = await cache.get<number>(
      `last_edited_date_${calendar.database_id}`,
      0
    );

    if (
      lastFetchedTimestamp === 0 ||
      Date.now() - lastFetchedTimestamp > 1000 * 60 * 5
    ) {
      const itemsFromDb = await getItemsFromDatabase(
        calendar.database_id,
        new Date(lastFetchedTimestamp)
      );

      items = {
        ...items,
        ...itemsFromDb.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<string, PageObjectResponse>),
      };
    }

    const allItems = Object.values(items);

    const events = convertItemsToEvents(allItems, calendar.properties.date);
    const cal = generateCalendar(calendar.name, events);

    cache.set(`items_${calendar.database_id}`, items);
    cache.set(`last_edited_date_${calendar.database_id}`, Date.now());

    cal.serve(res);
    return;
  });

  app.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
    callback();
  });
}
