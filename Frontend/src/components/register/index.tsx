import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import style from '../../lib/style/regiter.module.scss';
import { TextField } from '@mui/material';
import { goRegister } from '../../api/user';
import { homePermission } from '../../settings/homeState';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { ErrorMessage } from '../../lib/messages';
import { useAppDispatch } from '../../hook/state';
import {
  updatePermission,
  updateUserId,
  updateUserName,
} from '../../store/slices/homeState';
import { useRouter } from 'next/router';
import { setUserData } from '../../lib/public/storage';

export const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    samePassword: '',
    identityCode: '',
  });
  const [userNameError, setUserNameError] = useState(false);
  const [isLegal, setIsLegal] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (
      formData.userName &&
      formData.password &&
      formData.password === formData.samePassword &&
      !userNameError
    ) {
      setIsLegal(true);
    } else {
      if (setIsLegal) {
        setIsLegal(false);
      }
    }
  }, [formData, userNameError]);
  const onUserNameChange = (event: any) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
    const {
      target: { value },
    } = event;
    if (!value.match(regex)) {
      setUserNameError(true);
    } else {
      if (userNameError) {
        setUserNameError(false);
      }
    }
    onValueChange(value, 'userName');
  };

  const onValueChange = (value: string, key: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    const props = {
      user_name: formData.userName,
      password: formData.password,
      permission:
        formData.identityCode === homePermission.admin
          ? homePermission.admin
          : homePermission.common,
    };
    try {
      const res = await goRegister(props);
      const { data } = res;
      setUserData(data);
      await router.replace('/');
    } catch (error: any) {
      ErrorMessage(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: 'inline-block',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
          width: '25rem',
        }}
      >
        <CardContent className={style['card-content']}>
          <Typography className={style.login} gutterBottom>
            Register
          </Typography>
          <Box>
            <TextField
              required
              id="outlined-required"
              label="User name"
              value={formData.userName}
              fullWidth={true}
              onChange={(e) => onUserNameChange(e)}
              error={userNameError}
            />
            {userNameError && (
              <Box
                sx={{ mt: '0.5rem' }}
                fontSize={'0.8rem'}
                color={'rgb(211, 47, 47)'}
              >
                *Username starts with a letter, allows letters, numbers,
                underscores, hyphens, 3-16 characters.
              </Box>
            )}
          </Box>

          <Box>
            <TextField
              required
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              fullWidth={true}
              onChange={(e) => onValueChange(e.target.value, 'password')}
            />
            {!formData.password && (
              <Box
                sx={{ mt: '0.5rem' }}
                fontSize={'0.8rem'}
                color={'rgb(211, 47, 47)'}
              >
                *Not entered password.
              </Box>
            )}
          </Box>

          <Box>
            <TextField
              required
              id="outlined-password-input"
              label="Confirm password"
              type="password"
              autoComplete="current-password"
              value={formData.samePassword}
              fullWidth={true}
              error={formData.password !== formData.samePassword}
              onChange={(e) => onValueChange(e.target.value, 'samePassword')}
            />
            {formData.password !== formData.samePassword && (
              <Box
                sx={{ mt: '0.5rem' }}
                fontSize={'0.8rem'}
                color={'rgb(211, 47, 47)'}
              >
                *Passwords do not match.
              </Box>
            )}
          </Box>

          <Box>
            <TextField
              id="filled-search"
              label="Identity code"
              type="search"
              variant="filled"
              value={formData.identityCode}
              fullWidth={true}
              onChange={(e) => onValueChange(e.target.value, 'identityCode')}
            />
          </Box>
        </CardContent>

        <CardActions className={style.loginbtnbox}>
          <Button
            size="small"
            disabled={!isLegal}
            variant={'contained'}
            onClick={handleRegister}
          >
            Register
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
