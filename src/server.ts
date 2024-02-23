import express, {Express, Request, Response} from 'express';
import {Logger} from 'pino';
import {getItemsFromDatabase, convertItemsToEvents} from './notion';
import {generateCalendar} from './utils/calendar';
import {Config} from './types';

const app: Express = express();
const port = process.env.PORT || 3000;

export function startServer(
  logger: Logger,
  config: Config,
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

    const items = await getItemsFromDatabase(calendar.database_id);
    const events = convertItemsToEvents(items, calendar.properties.date);
    const cal = generateCalendar(calendar.name, events);
    cal.serve(res);
    return;
  });

  app.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
    callback();
  });
}
