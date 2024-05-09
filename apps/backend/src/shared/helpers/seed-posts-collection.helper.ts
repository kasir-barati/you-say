import { Model } from 'mongoose';
import { Post } from '../../modules/post/entities/post.entity';

export async function seedPostsCollection(
  postModel: Readonly<Model<Post>>,
) {
  await postModel.create({
    title: 'Stay tuned...',
    content:
      "#### There are ongoing developments or upcoming events. There'll be **versatile** posts, articles, original ideas, ground breaking news, and more to come. We encourage readers to remain engaged and sign up if you wanna see blog posts, newsletters, social media updates, and other forms of astonishing contents.",
    description:
      "There are ongoing developments or upcoming events. There'll be versatile posts, articles, original ideas, ground breaking news, and more to come. We encourage readers to remain engaged and sign up if you wanna see blog posts, newsletters, social media updates, and other forms of astonishing contents.",
    postImage: 'https://you-say.com/images/post-image.png', // TODO: add a real image url structure
    fusionAuthUser: {
      email: 'miyu.watanabe@mail.com',
      firstName: 'Miyu',
      fusionAuthId: '3b467620-8dd3-48d1-a403-e4117f16ff41',
      lastName: 'Watanabe',
    },
  });
}
