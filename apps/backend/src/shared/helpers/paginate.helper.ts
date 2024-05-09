import { FilterQuery, Model } from 'mongoose';

export async function paginate<T>({
  model,
  limit,
  filter = {},
}: {
  limit: number;
  model: Model<T>;
  filter?: FilterQuery<T>;
}) {
  const items = await model.countDocuments(filter).exec();
  const pages = Math.floor((items - 1) / limit) + 1;

  return { items, pages };
}
