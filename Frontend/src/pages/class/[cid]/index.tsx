import { Box } from '@mui/system';
import { getClassSign, getSignMessage } from '../../../api/sing';
import { getUsersByClassId } from '../../../api/class';
import BaseLayout from '../../../layout/baseLayout';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
export default function ClassDetails(props: any) {
  const { signData, userData, cid } = props.data;
  const [classSignData, setClassSignData] = useState(props.data.classSignData);
  const [time, setTime] = useState(7);
  const signTotal = signData.length;
  const Total = userData.length;
  const unSignData = Total - signTotal;
  const signRef = useRef(null);
  const classSignRef = useRef(null);
  useEffect(() => {
    if (!signRef.current) return;
    const myChart = echarts.init(classSignRef.current);
    const option = {
      title: {
        text: 'Sign-in percentage',
        subtext: `headcount:${classSignData.classTotal}`,
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Sign-In', 'Not Signed-In'],
      },
      series: [
        {
          name: '签到情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: classSignData.averageSigns, name: 'Sign-In' },
            {
              value: classSignData.classTotal - classSignData.averageSigns,
              name: 'Not Signed-In',
            },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    myChart.setOption(option);
  }, [
    classSignData,
    classSignData.averageSigns,
    classSignData.classTotal,
    signTotal,
    unSignData,
  ]);

  useEffect(() => {
    if (!classSignRef.current) return;
    const myChart = echarts.init(signRef.current);
    const option = {
      title: {
        text: 'Sign-in percentage',
        subtext: `headcount:${Total}`,
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Sign-In', 'Not Signed-In'],
      },
      series: [
        {
          name: '签到情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            {
              value: signTotal,
              name: 'Sign-In',
              itemStyle: { color: 'rgb(8, 36, 79)' },
            },
            {
              value: unSignData,
              name: 'Not Signed-In',
              itemStyle: { color: 'rgb(255, 149, 0)' },
            },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    myChart.setOption(option);
  }, [Total, signTotal, unSignData]);

  const handleTimeRangeChange = async (event: any) => {
    const res = await getClassSign({ cid, time: Number(event.target.value) });
    const { data } = res;
    setClassSignData(data);
    setTime(Number(event.target.value));
  };

  return (
    <BaseLayout>
      <Box height={'100%'} sx={{ padding: '1rem' }}>
        <Box
          height={'100%'}
          sx={{
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0,0.5)',
            display: 'flex',
            padding: '1rem',
          }}
        >
          <Box
            sx={{
              width: '50%',
            }}
          >
            <h1>Sign in details</h1>
            <Box sx={{ width: '100%', height: '50%' }} ref={signRef}></Box>
          </Box>
          <Box sx={{ width: '50%' }}>
            <h1>Class Sign in details</h1>
            <RadioGroup row value={time} onChange={handleTimeRangeChange}>
              <FormControlLabel
                value="7"
                control={<Radio />}
                label="Show Last Week"
              />
              <FormControlLabel
                value="30"
                control={<Radio />}
                label="Show Last Month"
              />
            </RadioGroup>
            <Box
              sx={{ mt: '1rem' }}
              ref={classSignRef}
              width={'100%'}
              height={'50%'}
            ></Box>
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
}

export async function getServerSideProps(context: {
  query: { qid: string; cid: string };
}) {
  const { qid, cid } = context.query;
  const sign = await getSignMessage({ qid });
  const user = await getUsersByClassId({ cid });
  const classSignData = await getClassSign({ cid, time: 1 });

  // 在这里获取数据并返回给页面
  return {
    props: {
      data: {
        cid,
        qid,
        signData: sign.data,
        userData: user.data,
        classSignData: classSignData.data,
      },
    },
  };
}
