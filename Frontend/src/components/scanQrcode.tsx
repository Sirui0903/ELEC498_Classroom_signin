import { Box } from '@mui/system';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Html5Qrcode } from 'html5-qrcode';
import { useRef, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useUsers } from '../hook/homeState';
import { check_in } from '../api/sing';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;

export const ScanQrcode = () => {
  const user = useUsers();
  const [open, setOpen] = useState(false);
  const html5QrCodeRef = useRef<any>(null);

  const handleClose = () => {
    setOpen(false);
    if (!html5QrCodeRef.current) return;
    html5QrCodeRef.current
      .stop()
      .then((ignore: any) => {
        // QR Code scanning is stopped.
      })
      .catch((err: any) => {
        // Stop failed, handle it.
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const config = { qrbox: { width: 400, height: 150 } };
  const onScanSuccess = (decodedText: any, decodedResult: any) => {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  };

  const onScanFailure = (error: any) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  };

  const scanQrcode = () => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCodeRef.current = new Html5Qrcode(/* element id */ 'reader');
          html5QrCodeRef.current
            .start(
              cameraId,
              {
                fps: 1,
                qrbox: { width: 250, height: 250 },
              },
              (decodedText: any, decodedResult: any) => {
                if (!user.uid) return;
                check_in({ qid: decodedText, uid: user.uid })
                  .then(() => {
                    alert('success');
                  })
                  .catch((error) => {
                    alert(error.response.data.message);
                  });
              },
            )
            .catch((err: any) => {
              alert(err);
            });
        }
      })
      .catch((err) => {
        // handle err
      });
  };

  return (
    <Box>
      <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
        <QrCodeScannerIcon fontSize={'large'} onClick={scanQrcode} />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box id="reader" width="40rem"></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
