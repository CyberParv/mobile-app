export const getPagination = (cursor: string | null, limit: number) => {
  return {
    skip: cursor ? 1 : 0,
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
  };
};