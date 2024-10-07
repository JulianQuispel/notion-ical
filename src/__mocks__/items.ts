import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';

const items: PageObjectResponse[] = [
  {
    id: '0',
    url: '',
    parent: {type: 'database_id', database_id: '0'},
    cover: null,
    icon: null,
    object: 'page',
    archived: false,
    created_by: {
      id: '0',
      object: 'user',
    },
    last_edited_by: {
      id: '0',
      object: 'user',
    },
    created_time: '2024-01-01T01:00:00.000Z',
    last_edited_time: '2024-01-01T01:00:00.000Z',
    properties: {
      Name: {
        type: 'title',
        id: '0',
        title: [
          {
            plain_text: 'Test 1',
            type: 'text',
            href: null,
            text: {
              content: 'Test 1',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
          },
        ],
      },
      Date: {
        type: 'date',
        id: '0',
        date: {
          start: '2024-01-01T01:00:00.000Z',
          end: '2024-01-01T02:00:00.000Z',
          time_zone: 'Europe/Amsterdam',
        },
      },
    },
  },
  {
    id: '1',
    url: '',
    parent: {type: 'database_id', database_id: '0'},
    cover: null,
    icon: null,
    object: 'page',
    archived: false,
    created_by: {
      id: '0',
      object: 'user',
    },
    last_edited_by: {
      id: '0',
      object: 'user',
    },
    created_time: '2024-01-01T01:00:00.000Z',
    last_edited_time: '2024-01-01T01:00:00.000Z',
    properties: {
      Name: {
        type: 'title',
        id: '0',
        title: [
          {
            plain_text: 'Test 2',
            type: 'text',
            href: null,
            text: {
              content: 'Test 2',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
          },
        ],
      },
      Date: {
        type: 'date',
        id: '1',
        date: null,
      },
    },
  },
];

export default items;
