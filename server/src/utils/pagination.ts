export const paginate = async ({ cursor, limit, orderBy, where }: any) => {
  const data = await prisma.entity.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy,
  });

  const nextCursor = data.length > 0 ? data[data.length - 1].id : null;
  return { data, meta: { nextCursor, hasMore: !!nextCursor, total: data.length } };
};