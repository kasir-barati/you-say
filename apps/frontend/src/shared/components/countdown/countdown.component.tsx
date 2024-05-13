'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { clearInterval, setInterval } from 'worker-timers';

const containerSx = {
  position: 'relative',
  width: '200px',
  height: 'auto',
  backgroundColor: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
const circularProgressTop = {
  animationDuration: '100ms',
  position: 'absolute',
  left: 0,
  strokeLinecap: 'round',
};
const circularProgressStyle = {
  transform: 'scaleX(-1) rotate(-90deg)',
  color: '#DEF2FD',
};
const size = 80;
const thickness = 4;

export function CountDown({
  duration,
  onComplete,
  countdownCurrentPercentage,
}: Readonly<CountDownProps>) {
  const [timeDuration, setTimeDuration] = useState(duration);
  const [countdownPercentage, setCountdownPercentage] = useState(
    countdownCurrentPercentage,
  );

  useEffect(() => {
    let intervalId: number | null = setInterval(() => {
      setTimeDuration((prev) => {
        const newTimeDuration = prev - 1;
        const percentage = Math.ceil(
          (newTimeDuration / timeDuration) *
            countdownCurrentPercentage,
        );
        setCountdownPercentage(percentage);

        if (newTimeDuration === 0 && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          onComplete();
        }

        return newTimeDuration;
      });
    }, 1_000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={containerSx}>
      <Box position="relative">
        <BottomCircularProgress />
        <CircularProgress
          size={size}
          variant="determinate"
          thickness={thickness}
          sx={circularProgressTop}
          value={countdownPercentage}
          style={circularProgressStyle}
        />
      </Box>
    </Box>
  );
}

const bottomCircularProgress = {
  color: '#1E2734',
};
function BottomCircularProgress() {
  return (
    <CircularProgress
      size={size}
      value={100}
      variant="determinate"
      thickness={thickness}
      sx={bottomCircularProgress}
    />
  );
}

interface CountDownProps {
  duration: number;
  onComplete: () => void;
  countdownCurrentPercentage: number;
}
