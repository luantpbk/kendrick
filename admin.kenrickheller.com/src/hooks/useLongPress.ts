/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';

interface PressHandlers<T> {
  onLongPress: (e: React.TouchEvent<T>) => void;
  onPress: (e: React.TouchEvent<T>) => void;
}

export default function useLongPress<T>({ onLongPress, onPress }: PressHandlers<T>, ms = 500) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  const event = useRef<React.TouchEvent<T>>();

  useEffect(() => {
    if (startLongPress) {
      if (onPress) onPress(event.current);
      timer.current = setTimeout(() => {
        onLongPress(event.current);
      }, ms);
    } else if (timer.current) {
      clearTimeout(timer.current);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [startLongPress]);

  return {
    onTouchStart: (e: React.TouchEvent<T>) => {
      event.current = e;
      setStartLongPress(true);
    },
    onTouchEnd: () => {
      setStartLongPress(false);
    },
  };
}
