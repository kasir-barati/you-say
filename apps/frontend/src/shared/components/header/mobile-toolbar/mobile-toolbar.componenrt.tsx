'use client';

import { useFusionAuth } from '@fusionauth/react-sdk';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '../../logo/logo.component';
import { ShopButton } from '../../shop-button/shop-button.component';
import { SingOutButton } from '../../sign-out-button/sign-out.component';
import { SearchModal } from '../search-modal.component';

const drawerWidth = 240;
const navItems = [
  { text: 'Home', href: '/', dataTest: 'home-link' },
  { text: 'About', href: '/about', dataTest: 'about-link' },
];

export function MobileToolbar({ id }: Readonly<MobileToolbarProps>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { startLogin, isLoggedIn } = useFusionAuth();
  const handleLogin = () => {
    startLogin(pathname ?? undefined);
  };
  const handleDrawerToggle = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  return (
    <Toolbar
      disableGutters
      sx={{ display: 'flex', justifyContent: 'space-between' }}
      id={id}
    >
      <MuiLink
        component={Link}
        href="/"
        aria-label="Index page"
        data-test="logo-link"
        underline="none"
      >
        <Logo variant="h4" />
      </MuiLink>
      <Drawer
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          // Better open performance on mobile.
          keepMounted: true,
        }}
        sx={{
          'display': { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(#BDDFEC, #455572)',
          },
        }}
      >
        <Box
          onClick={handleDrawerToggle}
          sx={{ textAlign: 'center' }}
        >
          <List>
            {navItems.map((navItem) => (
              <ListItem key={navItem.href} disablePadding>
                <ListItemButton
                  href={navItem.href}
                  component={Link}
                  sx={{ textAlign: 'center' }}
                  data-test={navItem.dataTest}
                >
                  <ListItemText primary={navItem.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {isLoggedIn ? (
            <>
              <SingOutButton />
              <ShopButton />
            </>
          ) : (
            <>
              <Button
                title="Sign in"
                aria-label="Sign in"
                color="primary"
                onClick={handleLogin}
                variant="contained"
              >
                Sign in
              </Button>
              <MuiLink
                marginLeft={1}
                href="/sign-up"
                underline="none"
                component={Link}
                textTransform="uppercase"
              >
                Sign up
              </MuiLink>
            </>
          )}
        </Box>
      </Drawer>
      <Box>
        <SearchModal />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Toolbar>
  );
}

interface MobileToolbarProps {
  id: string;
}
