import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type NewsletterSubscriptionDocument =
  HydratedDocument<NewsletterSubscription>;
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class NewsletterSubscription {
  @Prop({
    index: true,
    required: true,
    validate: {
      validator(value: string) {
        return isEmail(value.trim());
      },
      message({ value }) {
        return `${value} is not a valid email!`;
      },
    },
  })
  email: string;

  createdAt: Date;
}
export const NewsletterSubscriptionSchema =
  SchemaFactory.createForClass(NewsletterSubscription);
