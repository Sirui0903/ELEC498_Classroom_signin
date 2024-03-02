import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { nanoid } from 'nanoid';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useRef, useState } from 'react';
import { useUsers } from '../../hook/homeState';
import { IPostSignProps, postSign } from '../../api/sing';
import { Qrcode } from '../qrcode';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

export function Student() {
  const user = useUsers();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(5);
  const [isSubmit, setIsSubmit] = useState(false);
  const contentRef = useRef('');

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      rest();
    }, 100);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const rest = () => {
    setTime(5);
    setIsSubmit(false);
  };

  const submit = () => {
    const randomString = nanoid(); // 默认长度为 21
    const { uid } = user;
    if (!uid) return;
    const currentDate = new Date();
    const data: IPostSignProps = {
      creator: uid,
      content: randomString,
      limit: new Date(currentDate.getTime() + time * 60000),
    };
    postSign(data)
      .then((res) => {
        const { data } = res;
        contentRef.current = data._id;
        setIsSubmit(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '50rem',
          height: '40rem',
          margin: '0 auto',
          border: '1px solid #ddd', // 边框
          borderRadius: '10px', // 圆角
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // 阴影
          backgroundImage: 'url(/image/bgc.jpg)',
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'gray',
              fontStyle: 'italic',
              textAlign: 'center',
              fontWeight: 'bold', // 加粗
              fontSize: '1.2rem', // 调整字体大小
            }}
          >
            Click the button to post a QR code for students to check in.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', position: 'relative', top: '25%' }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'gray' }}
          >
            Post check-in
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Sign in</DialogTitle>
          <DialogContent>
            {!isSubmit && (
              <Box>
                <DialogContentText>
                  You can post a QR code for students to check in and set their
                  expiration time below
                </DialogContentText>
                <Box
                  noValidate
                  component="form"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 'auto',
                    width: 'fit-content',
                  }}
                >
                  <FormControl sx={{ mt: 2, minWidth: 120 }}>
                    <InputLabel htmlFor="max-width">Time limit</InputLabel>
                    <Select
                      autoFocus
                      value={time}
                      label="Time limit"
                      onChange={(e) => setTime(Number(e.target.value))}
                    >
                      <MenuItem value="1">1 minute</MenuItem>
                      <MenuItem value="3">3 minute</MenuItem>
                      <MenuItem value="5">5 minute</MenuItem>
                      <MenuItem value="7">7 minute</MenuItem>
                      <MenuItem value="9">9 minute</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}
            {isSubmit && (
              <Box>
                <Qrcode content={contentRef.current} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            {!isSubmit && (
              <Button onClick={submit} variant={'contained'}>
                Submit
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
