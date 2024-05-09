'use client';
/* eslint-disable @next/next/no-img-element */

import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';

interface PostProps {
  title: string;
  description: string;
  updatedAt: Date;
  postImage: string;
  user: { firstName: string };
}

export function Post({
  user,
  title,
  description,
  postImage,
  updatedAt,
}: Readonly<PostProps>) {
  const sanitizedUpdatedAt = sanitizeUpdatedAt(updatedAt);
  const slicedContent = description.slice(0, 300);

  return (
    <Grid2
      container
      gap={3}
      alignItems="center"
      alignContent="center"
    >
      <Grid2 xs>
        <img
          src={postImage}
          alt="Post image"
          style={{ width: '100%', borderRadius: 8 }}
        />
      </Grid2>
      <Grid2 container xs={9}>
        <Typography width={'100%'} variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" width={'100%'} marginBottom={2}>
          {slicedContent}
        </Typography>
        <Typography variant="body2" color="gray">
          By {user.firstName} - {sanitizedUpdatedAt}
        </Typography>
      </Grid2>
    </Grid2>
  );
}

function sanitizeUpdatedAt(date: Date): string {
  const year = date.getFullYear();
  // 0 - 11
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${day}.${month}.${year}`;
}
