// 'use client';

// import { useFusionAuth } from '@fusionauth/react-sdk';
// import Avatar from '@mui/material/Avatar';
// import Container from '@mui/material/Container';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { DefaultCoverImage } from '../../../shared/components/default-cover-image/default-cover-image.component';

// TODO: utilize useFusionAuth + http calls to fetch necessary data for profile page
export default function Profile({ params }: Readonly<ProfileProps>) {
  // const { userInfo } = useFusionAuth();
  // const username = params.username;
  const bio = 'water earth fire air '.repeat(50).trim();

  return (
    <></>
    // <Container>
    //   <DefaultCoverImage sx={{ height: 240 }} />
    //   <Avatar
    //     src={userInfo?.picture}
    //     sx={{
    //       width: 120,
    //       height: 120,
    //       position: 'relative',
    //       top: -60,
    //       left: 60,
    //     }}
    //   />
    //   <Stack gap={2} paddingX={3} marginTop={-4}>
    //     <Typography variant="h5" fontWeight="bold">
    //       {userInfo?.given_name + ' ' + userInfo?.family_name}
    //     </Typography>
    //     <Typography variant="h6" color="gray">
    //       {username}
    //     </Typography>
    //     <Typography variant="body1" textAlign="justify">
    //       {bio}
    //     </Typography>
    //     <List sx={{ display: 'flex' }}>
    //       {['interest 1', 'interest 2'].map((value) => (
    //         <ListItem
    //           key={value}
    //           sx={{
    //             width: 'fit-content',
    //             bgcolor: '#01002311',
    //             marginRight: 1,
    //             borderRadius: 100,
    //           }}
    //         >
    //           <ListItemText primary={value} />
    //         </ListItem>
    //       ))}
    //     </List>
    //   </Stack>
    // </Container>
  );
}

interface ProfileProps {
  params: { username: string };
}
