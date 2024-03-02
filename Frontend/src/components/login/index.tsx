import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import style from '../../lib/style/login.module.scss';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { goLogin } from '../../api/user';
import { ErrorMessage } from '../../lib/messages';
import { setUserData } from '../../lib/public/storage';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleLogin = async () => {
    try {
      const res = await goLogin({ user_name, password });
      if (res) {
        const { data } = res;
        setUserData({
          uid: data._id,
          permission: data.permission,
          user_name: data.user_name,
        });
        router.replace('/');
      }
    } catch (error: any) {
      alert(error);
    }
  };
  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <Box sx={{ minwidth: 300, textAlign: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          display: 'inline-block',
          boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Card className={style.loginAss}>
          <CardContent>
            {/* 登录文本 */}
            <Typography className={style.login} gutterBottom>
              Login
            </Typography>
            {/* 用户名 */}
            <FormControl variant="standard" className={style.loginInfo}>
              <InputLabel
                shrink
                htmlFor="bootstrapInput"
                className={style.InputLabel}
              >
                NetlD：
              </InputLabel>
              <Input
                className={style.bootstrapInput}
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
            <br />
            {/* 密码 */}
            <FormControl variant="standard" className={style.loginInfo}>
              <InputLabel
                shrink
                htmlFor="bootstrapInput"
                className={`${style.InputLabel}`}
              >
                Password：
              </InputLabel>
              <Input
                className={style.bootstrapInput}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </CardContent>
          {/* 按钮 */}
          <CardActions className={style.loginbtnbox} onClick={handleLogin}>
            <Button size="small" className={style.loginbtn}>
              Login
            </Button>
          </CardActions>
          <CardActions className={style.loginbtnbox}>
            {/* "../register/register" */}
            <Link
              underline="hover"
              onClick={handleRegister}
              className={style.jump}
            >
              {'Go register'}
            </Link>
          </CardActions>
        </Card>
      </Card>
    </Box>
  );
}
