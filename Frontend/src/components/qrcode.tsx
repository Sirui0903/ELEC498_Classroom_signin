import { Box } from '@mui/system';
import { useEffect } from 'react';
const QRCode = require('qrcode');
export const Qrcode = (props: { content: string }) => {
  const { content } = props;
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    QRCode.toCanvas(canvas, content, function (error: any) {
      if (error) console.error(error);
    });
  }, [content]);
  return (
    <Box>
      <canvas id="canvas"></canvas>
    </Box>
  );
};
