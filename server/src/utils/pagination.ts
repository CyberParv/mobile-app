export const getPagination = (cursor: string | undefined, limit: number) => {
  const take = limit || 10;
  const skip = cursor ? 1 : 0;
  return { take, skip, cursor: cursor ? { id: cursor } : undefined };
};