'use client';

import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => (prevProgress + 1) % 101);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <Progress className='bg-green-900' value={progress} max={100} />;
};

export default ProgressBar;
