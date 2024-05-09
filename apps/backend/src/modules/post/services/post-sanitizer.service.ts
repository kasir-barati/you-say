import { Injectable } from '@nestjs/common';
import { Post } from '@shared';
import { FusionAuthUserSanitizer } from '../../../shared/helpers/sanitize-fusionauth-user.helper';
import { PostDocument } from '../entities/post.entity';

@Injectable()
export class PostSanitizer {
  private readonly fusionAuthUserSanitizer: FusionAuthUserSanitizer;
  constructor() {
    this.fusionAuthUserSanitizer = new FusionAuthUserSanitizer();
  }

  toPost(unsanitizedPost: PostDocument): Post {
    if (!unsanitizedPost) {
      throw '[Error-c3d4c6e9e2] No data provided!';
    }

    return {
      id: unsanitizedPost.id,
      title: unsanitizedPost.title,
      content: unsanitizedPost.content,
      description: unsanitizedPost.description,
      fusionAuthUser: this.fusionAuthUserSanitizer.toUser(
        unsanitizedPost.fusionAuthUser,
      ),
      postImage: unsanitizedPost.postImage,
      createdAt: unsanitizedPost.createdAt.toString(),
      updatedAt: unsanitizedPost.updatedAt.toString(),
    };
  }
}
