import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import style from '../../lib/style/navigation.module.scss';
import { useUsers } from '../../hook/homeState';
import { Avatar } from '@mui/material';
import { clearSessionKey } from '../../lib/public/storage';
import { useAppDispatch } from '../../hook/state';
import {
  updatePermission,
  updateUserId,
  updateUserName,
} from '../../store/slices/homeState';
import { ScanQrcode } from '../scanQrcode';
export default function Navigation() {
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useUsers();
  const dispatch = useAppDispatch();
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // 处理退出逻辑
    dispatch(updateUserId(null));
    dispatch(updatePermission(null));
    dispatch(updateUserName(''));
    clearSessionKey();
    handleMenuClose();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //登陆跳转a
  const router = useRouter();

  const clickLogin = () => {
    router.push('/login');
  };

  return (
    <Box className={style.nav}>
      <Container maxWidth="xl">
        <Toolbar className={style.secondNav}>
          <Box className={style.svg}>
            <img src="/image/logo.svg" alt="error" />
          </Box>
          <Box
            sx={{ minWidth: '10rem', display: 'flex', alignItems: 'center' }}
            color={'white'}
          >
            {user.uid && (
              <Box mr={'1.5rem'}>
                <ScanQrcode />
              </Box>
            )}

            {!user.uid && (
              <Box>
                <Button
                  variant="outlined"
                  className={style.logon}
                  onClick={clickLogin}
                >
                  Logon
                </Button>

                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
            {user.uid && (
              <Box sx={{ cursor: 'pointer' }}>
                <Avatar onClick={handleMenuOpen}>
                  {user.user_name.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
}
