import {useCallback, useRef, useState} from 'react';

function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(0);
  const start = useCallback(() => {
    intervalRef.current = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, []);
  const pause = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = 0;
  }, []);
  const reset = useCallback(() => {
    setElapsedTime(0);
    pause();
  }, []);

  return {elapsedTime, start, pause, reset};
}

export {useTimer};
