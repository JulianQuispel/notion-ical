import dotenv from 'dotenv';
import fs from 'fs';

import {parseConfig} from './utils/config_parser';
import pino from 'pino';
import {exit} from 'process';
import {startServer} from './server';
import RedisCache from './cache/redis';
import {createClient} from 'redis';

dotenv.config();

const logger = pino();

const CONFIG_FILE_PATH = process.env.CONFIG_FILE || './config.yml';

async function main() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    logger.fatal(
      `Could not find config file in location ${CONFIG_FILE_PATH}. Shutting down`
    );
    exit();
  }

  const file = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
  const config = parseConfig(file);

  logger.info('Config', config);
  logger.info('Env', process.env);

  const redisClient = await createClient({
    url: process.env.REDIS_URL,
  }).connect();
  const cache = new RedisCache(redisClient);

  startServer(logger, config, cache, () => {
    Object.entries(config.calendars!).forEach(([key, calendarConfig]) =>
      logger.info(`Calendar ${calendarConfig.name} running on endpoint /${key}`)
    );
  });
}

main();
