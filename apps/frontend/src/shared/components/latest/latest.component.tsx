'use client';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FindAllPostsResponse } from '@shared';
import { useEffect, useState } from 'react';
import { useFindAllMutation } from '../../api/post.api';
import { logger } from '../../utils/logger.util';
import { Divider } from '../divider/divider.component';
import { Post } from './post.component';

export function Latest() {
  const [findAllMutation] = useFindAllMutation();
  const [posts, setPosts] = useState<FindAllPostsResponse['data']>(
    [],
  );

  useEffect(() => {
    findAllMutation({ limit: 3, createdAt: 'desc' })
      .then((response) => {
        if ('error' in response) {
          return;
        }
        setPosts(response.data.data);
      })
      .catch(logger.error);
    // NOTE: Run effect once on component mount, please recheck dependencies if effect is updated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Stack paddingY={3} gap={2}>
        <Typography textTransform="uppercase">latest</Typography>
        <Divider />
        {posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            description={post.description}
            updatedAt={new Date(post.updatedAt)}
            postImage={post.postImage}
            user={{ firstName: post.fusionAuthUser.firstName }}
          />
        ))}
      </Stack>
    </Container>
  );
}
