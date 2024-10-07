import {QueryDatabaseResponse} from '@notionhq/client/build/src/api-endpoints';
import {getDateFromProperty, getItemsFromDatabase, notion} from '../notion';
import {isFullPage} from '@notionhq/client';

jest.mock('@notionhq/client', () => {
  const actual = jest.requireActual('@notionhq/client');
  return {
    ...actual,
    isFullPage: jest.fn().mockReturnValue(true),
  };
});

describe('getDateFromProperty', () => {
  test('it gets date from date property', () => {
    expect(
      getDateFromProperty({
        type: 'date',
        date: {
          start: '2024-01-01T01:00:00.000Z',
          end: '2024-01-01T02:00:00.000Z',
          time_zone: 'Europe/Amsterdam',
        },
        id: '123',
      })
    ).toStrictEqual({
      start: '2024-01-01T01:00:00.000Z',
      end: '2024-01-01T02:00:00.000Z',
      time_zone: 'Europe/Amsterdam',
    });
  });

  test('it gets null if no date', () => {
    expect(
      getDateFromProperty({
        type: 'date',
        date: null,
        id: '123',
      })
    ).toBeNull();
  });

  test('it gets date from formula property', () => {
    expect(
      getDateFromProperty({
        type: 'formula',
        formula: {
          type: 'date',
          date: {
            start: '2024-01-01T01:00:00.000Z',
            end: '2024-01-01T02:00:00.000Z',
            time_zone: 'Europe/Amsterdam',
          },
        },
        id: '123',
      })
    ).toStrictEqual({
      start: '2024-01-01T01:00:00.000Z',
      end: '2024-01-01T02:00:00.000Z',
      time_zone: 'Europe/Amsterdam',
    });
  });

  test('it gets null from formula if no date', () => {
    expect(
      getDateFromProperty({
        type: 'formula',
        formula: {
          type: 'date',
          date: null,
        },
        id: '123',
      })
    ).toBeNull();
  });
});

describe('getItemsFromDatabase', () => {
  let queryMock: jest.SpyInstance;

  beforeEach(() => {
    queryMock = jest.spyOn(notion.databases, 'query');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets items from database', async () => {
    queryMock.mockResolvedValue({
      results: [
        {
          object: 'page',
          id: 'page_id',
          properties: {},
        },
      ],
      next_cursor: null,
      has_more: false,
    } as unknown as QueryDatabaseResponse);

    const databaseId = 'database_id';
    const modifiedSince = new Date('2023-01-01T00:00:00.000Z');

    const items = await getItemsFromDatabase(databaseId, modifiedSince);

    expect(queryMock).toHaveBeenCalledWith({
      database_id: databaseId,
      start_cursor: undefined,
      filter: {
        last_edited_time: {
          after: modifiedSince.toISOString(),
        },
        timestamp: 'last_edited_time',
        type: 'last_edited_time',
      },
    });

    expect(items).toEqual([
      {
        object: 'page',
        id: 'page_id',
        properties: {},
      },
    ]);
  });

  it('handles pagination in getItemsFromDatabase', async () => {
    queryMock
      .mockResolvedValueOnce({
        results: [
          {
            object: 'page',
            id: 'page_id_1',
            properties: {},
          },
        ],
        next_cursor: 'next_cursor',
        has_more: true,
      })
      .mockResolvedValueOnce({
        results: [
          {
            object: 'page',
            id: 'page_id_2',
            properties: {},
          },
        ],
        next_cursor: null,
        has_more: false,
      });

    const databaseId = 'database_id';
    const modifiedSince = new Date('2023-01-01T00:00:00.000Z');

    const items = await getItemsFromDatabase(databaseId, modifiedSince);

    expect(queryMock).toHaveBeenCalledTimes(2);
    expect(items).toEqual([
      {
        object: 'page',
        id: 'page_id_1',
        properties: {},
      },
      {
        object: 'page',
        id: 'page_id_2',
        properties: {},
      },
    ]);
  });
});
