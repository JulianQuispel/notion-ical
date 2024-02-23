import dotenv from 'dotenv';
import fs from 'fs';

import {parseConfig} from './utils/config_parser';
import pino from 'pino';
import {exit} from 'process';
import {startServer} from './server';

dotenv.config();

const logger = pino();

const CONFIG_FILE_PATH = process.env.CONFIG_FILE || './config.yml';

function main() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    logger.fatal(
      `Could not find config file in location ${CONFIG_FILE_PATH}. Shutting down`
    );
    exit();
  }

  const file = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
  const config = parseConfig(file);

  startServer(logger, config, () => {
    Object.entries(config.calendars!).forEach(([key, calendarConfig]) =>
      logger.info(`Calendar ${calendarConfig.name} running on endpoint /${key}`)
    );
  });
}

main();
