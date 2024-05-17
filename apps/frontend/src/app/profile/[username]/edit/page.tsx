'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { DefaultCoverImage } from '../../../../shared/components/default-cover-image/default-cover-image.component';
import { RemovableList } from '../../../../shared/components/removable-list/removable-list.component';
import { WhiteTextField } from '../../../../shared/components/white-textfield/white-textfield.component';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const EditProfileGrid2Box = styled(Grid2)({
  width: '100%',
  backgroundColor: '#455572',
  borderRadius: '8px',
});
const EditProfileTitle = ({
  children,
  marginBottom = 2,
}: Readonly<PropsWithChildren<{ marginBottom?: number }>>) => (
  <Typography
    marginBottom={marginBottom}
    variant="h6"
    fontWeight="bold"
  >
    {children}
  </Typography>
);
const gap = 2;

// TODO: Disable primary button when nothing has changed.
// TODO: Update bio, user info, interests, notifications settings, avatar
export default function EditProfile({
  params,
}: Readonly<EditProfileProps>) {
  const { user: userInfo } = useFusionAuth();
  const username = params.username;
  const handleRemoveInterest = (value: string) => {
    console.log(value);
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        marginBottom={2}
        gap={gap}
      >
        <Typography variant="h4">Edit User Profile</Typography>
        <MuiLink
          display="flex"
          component={Link}
          underline="none"
          fontWeight="bold"
          href={`/profile/${username}`}
        >
          Preview <ArrowOutwardIcon sx={{ marginTop: -0.5 }} />
        </MuiLink>
      </Box>
      <Grid2 container gap={gap}>
        <Grid2 sm xs={12} container gap={gap} height="fit-content">
          <EditProfileGrid2Box paddingBottom={3}>
            <Stack>
              <DefaultCoverImage />
              <Avatar
                src={userInfo?.picture}
                sx={{
                  width: 90,
                  height: 90,
                  position: 'relative',
                  top: -45,
                  left: 45,
                }}
              />
              <Container sx={{ marginTop: -3 }}>
                <EditProfileTitle marginBottom={0}>
                  Your photo
                </EditProfileTitle>
                <Typography
                  variant="body1"
                  color="gray"
                  marginBottom={2}
                >
                  This will be displayed on your profile.
                </Typography>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  sx={{ marginRight: 2 }}
                >
                  Upload New
                  <VisuallyHiddenInput type="file" />
                </Button>
                <Button variant="contained">Save</Button>
              </Container>
            </Stack>
          </EditProfileGrid2Box>
          <EditProfileGrid2Box paddingY={3}>
            <Container>
              <EditProfileTitle>
                Personal information
              </EditProfileTitle>
              <Stack component="form" gap={gap}>
                <WhiteTextField
                  required
                  fullWidth
                  label="Name"
                  name="firstName"
                  placeholder="Name"
                  autoComplete="given-name"
                  value={userInfo?.given_name}
                />
                <WhiteTextField
                  required
                  fullWidth
                  label="Family"
                  placeholder="Family"
                  name="lastName"
                  autoComplete="family-name"
                  value={userInfo?.family_name}
                />
                <WhiteTextField
                  required
                  fullWidth
                  type="text"
                  label="Username"
                  placeholder="user-name"
                  name="username"
                  autoComplete="username"
                  value={username}
                />
                <WhiteTextField
                  required
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="email@example.com"
                  name="email"
                  autoComplete="email"
                  value={userInfo?.email}
                  inputProps={{
                    'data-test':
                      'edit-personal-information-form-email-input',
                  }}
                />
                <Button
                  data-test="edit-personal-information-button"
                  variant="contained"
                  type="submit"
                  sx={{ width: 'fit-content' }}
                >
                  Save
                </Button>
              </Stack>
            </Container>
          </EditProfileGrid2Box>
        </Grid2>
        <Grid2 sm xs={12} container gap={gap} height="fit-content">
          <EditProfileGrid2Box paddingY={3}>
            <Container>
              <EditProfileTitle>Bio</EditProfileTitle>
              <WhiteTextField
                placeholder="Bio"
                multiline
                rows={4}
                maxRows={4}
                fullWidth
                value={undefined}
              />
              <Button sx={{ marginTop: 2 }} variant="contained">
                Save
              </Button>
            </Container>
          </EditProfileGrid2Box>
          <EditProfileGrid2Box paddingY={3}>
            <Container>
              <EditProfileTitle>Interests</EditProfileTitle>
              <Stack gap={gap}>
                <RemovableList
                  values={['interest 1', 'interest 2']}
                  onRemove={handleRemoveInterest}
                />
                <Button
                  fullWidth
                  sx={{ textTransform: 'none' }}
                  variant="outlined"
                >
                  +Add more
                </Button>
              </Stack>
            </Container>
          </EditProfileGrid2Box>
          <EditProfileGrid2Box paddingY={3}>
            <Container>
              <EditProfileTitle>Email notifications</EditProfileTitle>
              <Stack gap={gap}>
                <FormControl>
                  <FormGroup>
                    <FormControlLabel
                      sx={{
                        justifyContent: 'space-between',
                        display: 'flex',
                        marginLeft: 0,
                      }}
                      label="Newsletter"
                      labelPlacement="start"
                      control={
                        <Switch
                          inputProps={{
                            'aria-label': 'Switch newsletter',
                          }}
                        />
                      }
                      value="Newsletter"
                    />
                  </FormGroup>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ width: 'fit-content' }}
                >
                  Update
                </Button>
              </Stack>
            </Container>
          </EditProfileGrid2Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}

interface EditProfileProps {
  params: { username: string };
}
