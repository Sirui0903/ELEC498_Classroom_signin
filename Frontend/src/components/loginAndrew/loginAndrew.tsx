import React from 'react';
import Login from '../login/index';
import Box from '@mui/material/Box';
import style from '../lib/loginAndreg.module.scss';

export const LoginAndrew = () => {
  return (
    <Box className={style.middle}>
      <Login />
    </Box>
  );
};
