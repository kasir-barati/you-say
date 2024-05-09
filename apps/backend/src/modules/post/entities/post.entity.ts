import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { FusionAuthUser } from './fusionauth-user.entity';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  id: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  description: string;

  @Prop({ type: FusionAuthUser })
  fusionAuthUser: FusionAuthUser;

  @Prop()
  postImage: string;

  createdAt: Date;
  updatedAt: Date;
}
export const PostSchema = SchemaFactory.createForClass(Post);
