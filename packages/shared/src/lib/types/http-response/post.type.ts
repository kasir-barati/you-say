/* eslint-disable @typescript-eslint/no-empty-interface */

import { Post } from '../entities/post.type';
import { PaginationResponse } from './pagination.type';

export interface FindAllPostsResponse
  extends PaginationResponse<Post> {}
