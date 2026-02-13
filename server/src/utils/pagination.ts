export const getPagination = (cursor: string | null, limit: number) => {
  return {
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  };
};