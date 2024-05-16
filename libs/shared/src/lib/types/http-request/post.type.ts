import { PaginationQuery } from './pagination-query.type';

export interface FindAllPostsQuery extends PaginationQuery {
  createdAt?: 'asc' | 'desc';
}
