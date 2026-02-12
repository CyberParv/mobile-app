import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const paginate = async (model: any, args: any) => {
  const { cursor, limit } = args;
  const items = await prisma[model].findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const nextCursor = items.length === limit ? items[items.length - 1].id : null;
  const hasMore = nextCursor !== null;

  return { data: items, meta: { nextCursor, hasMore, total: items.length } };
};
