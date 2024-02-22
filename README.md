# notion-ical

This simple application makes it possible to show items from multiple Notion database in your iCal calendar.

## Prerequisites

Before you can use this application you need to create an internal application within Notion. [Read here how you can do that](https://developers.notion.com/docs/authorization#internal-integration-auth-flow-set-up). Once you've created the integration, you can use the Internal Integration Token in order to authorize requests to the Notion API.

Besides a token you also need the ID of the Notion database you want in your calendar. You can find the ID in the last part of the database URL.

Example: https://www.notion.so/johndoe/**pirlf9eefci9sey4l1gh7hsm0ur4wv2n**?v=pirlf9eefci9sey4l1gh7hsm0ur4wv2n&pvs=4

_The bold part in the URL is the database ID_

## Installation

This application can be installed in two ways. The easiest way is probably using [Docker](#docker)

### Docker

```bash
docker build -t notion-ical .
docker run -d -p 3000:3000 -e NOTION_KEY=<notion API key> -e NOTION_DATABASE_ID=<notion database id> notion-ical
```

### NPM

If you rather not use Docker and have Node.js and NPM installed, you can install the project using the following commands.

```bash
npm install # install dependencies
npm run build # build the source
npm run start # start the ical server
```

## Development

This project was written using Typescript due to its type safety and easy integration with the [Notion SDK for Javascript](https://github.com/makenotion/notion-sdk-js). When developing this application it can be cumbersome to continuously have to recompile the source code and start the server. Therefore you can use the following command which recompiles and restarts the application as soon as you make code changes.

```bash
npm run dev
```

## Contributing

### Code style

This project uses [Google Typescript Style](https://github.com/google/gts) for simplicity sake. Anyone wishing to contribute to this project needs to make sure all linting rules pass before their PR's will be approved.
