import { Prop, Schema } from '@nestjs/mongoose';

// TODO: keep it up to date with FusionAuth
@Schema({ _id: false })
export class FusionAuthUser {
  @Prop()
  fusionAuthId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;
}
