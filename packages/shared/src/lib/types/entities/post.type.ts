import { FusionAuthUser } from './fusionauth-user.type';

export interface Post {
  id: string;
  title: string;
  content: string;
  postImage: string;
  description: string;
  fusionAuthUser: FusionAuthUser;
  createdAt: string;
  updatedAt: string;
}
